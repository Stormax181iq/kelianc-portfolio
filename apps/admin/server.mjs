// Production static server for the admin build.
// Sends X-Robots-Tag: noindex on every response and serves the SPA fallback.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("./dist", import.meta.url));
const port = Number(process.env.ADMIN_PORT ?? 4001);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    if (path === "/" || path === "\\") path = "/index.html";
    let file = join(dist, path);
    let body;
    try {
      body = await readFile(file);
    } catch {
      file = join(dist, "index.html"); // SPA fallback
      body = await readFile(file);
    }
    res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
    res.end(body);
  } catch (err) {
    res.statusCode = 500;
    res.end("Internal server error");
  }
}).listen(port, () => console.log(`Admin app on http://localhost:${port} (noindex)`));
