import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../dist/", import.meta.url));
const qaRoot = fileURLToPath(new URL("../qa/", import.meta.url));
const port = Number(process.env.PORT || 4174);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};
const qa = process.argv.includes("--qa");
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const qaRoutes = {
      "/__qa": "check.html",
      "/__mobile": "mobile.html",
      "/__desktop": "desktop.html",
    };
    const base = qa && qaRoutes[pathname] ? qaRoot : root;
    const relative =
      qa && qaRoutes[pathname]
        ? qaRoutes[pathname]
        : pathname === "/"
          ? "index.html"
          : pathname.slice(1);
    const target = path.resolve(base, relative);
    if (!target.startsWith(path.resolve(base) + path.sep)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const data = await readFile(target);
    res.writeHead(200, {
      "Content-Type": types[path.extname(target)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log("Psaltis website: http://127.0.0.1:" + port),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
