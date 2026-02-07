const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const sanitizedPath = requestUrl.pathname.replace(/\/+$/, "") || "/";
  const relativePath = sanitizedPath.replace(/^\/+/, "");
  const filePath =
    relativePath === ""
      ? path.join(publicDir, "index.html")
      : path.join(publicDir, relativePath);

  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(publicDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(resolvedPath, (statErr, stats) => {
    if (statErr) {
      if (statErr.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Server Error");
      }
      return;
    }

    const finalPath = stats.isDirectory()
      ? path.join(resolvedPath, "index.html")
      : resolvedPath;

    fs.readFile(finalPath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Not Found");
        } else {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Server Error");
        }
        return;
      }

      const ext = path.extname(finalPath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";
      const headers = { "Content-Type": contentType };

      if ([".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico"].includes(ext)) {
        headers["Cache-Control"] = "public, max-age=86400";
      } else if (ext === ".html") {
        headers["Cache-Control"] = "public, max-age=0, must-revalidate";
      }

      res.writeHead(200, headers);
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
