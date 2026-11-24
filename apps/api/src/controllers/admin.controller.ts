import { randomBytes } from "node:crypto";
import { extname, join } from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import type { Request, Response } from "express";
import {
  contentBlockUpdateSchema,
  loginSchema,
  projectUpsertSchema,
  settingsUpdateSchema,
  timelineUpsertSchema,
} from "@kelianc/shared";
import type { Services } from "../services";
import type { Repositories } from "../repositories/types";
import type { Config } from "../config";
import { badRequest, notFound, unauthorized } from "../lib/errors";

const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif", ".mp4", ".webm", ".pdf"]);
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export function createAdminController(deps: { services: Services; repos: Repositories; config: Config }) {
  const { services, repos, config } = deps;
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: config.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return {
    async login(req: Request, res: Response) {
      const { email, password } = loginSchema.parse(req.body);
      const token = await services.auth.login(email, password);
      if (!token) throw unauthorized();
      res.cookie(config.ADMIN_COOKIE_NAME, token, cookieOpts);
      res.json({ ok: true });
    },
    async logout(req: Request, res: Response) {
      const token = req.cookies?.[config.ADMIN_COOKIE_NAME];
      if (typeof token === "string") await services.auth.logout(token);
      res.clearCookie(config.ADMIN_COOKIE_NAME, { path: "/" });
      res.json({ ok: true });
    },
    me(req: Request, res: Response) {
      res.json({ id: req.adminUserId });
    },
    async getContent(_req: Request, res: Response) {
      res.json({ blocks: await services.content.getAllLocalized() });
    },
    async putContent(req: Request, res: Response) {
      const parsed = contentBlockUpdateSchema.parse(req.body);
      if (parsed.key !== req.params.key) throw badRequest("key-mismatch", "Key in body must match URL");
      await services.content.upsert({
        key: parsed.key,
        value: { en: parsed.en, fr: parsed.fr },
        updatedAt: new Date().toISOString(),
      });
      res.json({ ok: true });
    },
    async getProjects(_req: Request, res: Response) {
      res.json({ projects: await services.projects.listAll() });
    },
    async putProject(req: Request, res: Response) {
      const parsed = projectUpsertSchema.parse({ ...req.body, slug: req.params.slug });
      await services.projects.upsert(parsed);
      res.json({ ok: true });
    },
    async deleteProject(req: Request, res: Response) {
      const deleted = await services.projects.delete(req.params.slug ?? "");
      if (!deleted) throw notFound("Project");
      res.json({ ok: true });
    },
    async getTimeline(_req: Request, res: Response) {
      res.json({ events: await services.timeline.listAll() });
    },
    async postTimeline(req: Request, res: Response) {
      await services.timeline.upsert(timelineUpsertSchema.parse(req.body));
      res.status(201).json({ ok: true });
    },
    async putTimeline(req: Request, res: Response) {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) throw badRequest("id-invalid", "Invalid id");
      await services.timeline.upsert(timelineUpsertSchema.parse(req.body), id);
      res.json({ ok: true });
    },
    async deleteTimeline(req: Request, res: Response) {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || !(await services.timeline.delete(id))) throw notFound("Timeline event");
      res.json({ ok: true });
    },
    async getMedia(_req: Request, res: Response) {
      res.json({ media: await repos.media.list() });
    },
    async postMedia(req: Request, res: Response) {
      const raw = req.body as Buffer;
      if (!Buffer.isBuffer(raw) || raw.length === 0) throw badRequest("file-required", "A file body is required");
      if (raw.length > MAX_UPLOAD_BYTES) throw badRequest("file-too-large", "File exceeds 15 MB");
      const original = String(req.query.filename ?? "file");
      const ext = extname(original).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) throw badRequest("file-type", "Unsupported file type");
      const safeName = `${randomBytes(8).toString("hex")}${ext}`;
      await mkdir(config.UPLOAD_DIR, { recursive: true });
      await writeFile(join(config.UPLOAD_DIR, safeName), raw);
      const { id, path } = await repos.media.create({
        filename: original.slice(0, 200),
        path: `/uploads/${safeName}`,
        altEn: String(req.query.altEn ?? ""),
        altFr: String(req.query.altFr ?? ""),
        mime: String(req.headers["content-type"] ?? "application/octet-stream").slice(0, 100),
        size: raw.length,
      });
      res.status(201).json({ id, path });
    },
    async deleteMedia(req: Request, res: Response) {
      const id = Number(req.params.id);
      const items = await repos.media.list();
      const item = items.find((m) => m.id === id);
      if (!item || !(await repos.media.delete(id))) throw notFound("Media");
      // Best-effort removal of the file from disk.
      const filename = item.path.replace(/^\/uploads\//, "");
      if (/^[a-f0-9]{16}\.[a-z0-9]+$/.test(filename)) {
        await unlink(join(config.UPLOAD_DIR, filename)).catch(() => {});
      }
      res.json({ ok: true });
    },
    async getSettings(_req: Request, res: Response) {
      res.json({ settings: await repos.settings.getAll() });
    },
    async putSettings(req: Request, res: Response) {
      const parsed = settingsUpdateSchema.parse(req.body);
      for (const [key, value] of Object.entries(parsed)) {
        if (value !== undefined) await repos.settings.set(key, value);
      }
      res.json({ ok: true });
    },
  };
}
