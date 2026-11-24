import type { Request, Response } from "express";
import { DEFAULT_LOCALE, isLocale, type PublicSettings } from "@kelianc/shared";
import type { Services } from "../services";
import { notFound } from "../lib/errors";

function localeOf(req: Request) {
  const q = req.query.locale;
  return isLocale(q) ? q : DEFAULT_LOCALE;
}

export function createPublicController(services: Services, settings: { getPublic(): Promise<PublicSettings> }) {
  return {
    health(_req: Request, res: Response) {
      res.json({ status: "ok" });
    },
    async getContent(req: Request, res: Response) {
      res.json({ locale: localeOf(req), content: await services.content.getPublic(localeOf(req)) });
    },
    async getProjects(req: Request, res: Response) {
      res.json({ locale: localeOf(req), projects: await services.projects.listSummaries(localeOf(req)) });
    },
    async getProject(req: Request, res: Response) {
      const detail = await services.projects.getDetail(req.params.slug ?? "", localeOf(req));
      if (!detail) throw notFound("Project");
      res.json({ locale: localeOf(req), project: detail });
    },
    async getTimeline(req: Request, res: Response) {
      res.json({ locale: localeOf(req), events: await services.timeline.listLocalized(localeOf(req)) });
    },
    async getGithubRepos(_req: Request, res: Response) {
      res.json(await services.github.getRepos());
    },
    async getSettings(_req: Request, res: Response) {
      res.json(await settings.getPublic());
    },
    async postContact(req: Request, res: Response) {
      const result = await services.contact.submit(req.body, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      res.status(202).json(result);
    },
  };
}
