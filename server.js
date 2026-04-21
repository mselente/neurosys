const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const includePattern = /<!--\s*#include\s+virtual="([^"]+)"\s*-->/g;
const maxIncludeDepth = 10;

const assetTokens = {
  __CSS_VERSION__: "styles.css",
  __JS_VERSION__: "app.js"
};

const assetVersion = (assetRelativePath) => {
  try {
    const stats = fs.statSync(path.join(publicDir, assetRelativePath));
    return Math.floor(stats.mtimeMs).toString(36);
  } catch (err) {
    return "1";
  }
};

const applyAssetTokens = (html) => {
  let result = html;
  for (const [token, asset] of Object.entries(assetTokens)) {
    result = result.split(token).join(assetVersion(asset));
  }
  return result;
};

const permanentRedirects = {
  "/applications/communication-agents": "/applications/dialogagenter",
  "/applications/ai-process-optimization": "/applications/prosessagenter",
  "/applications/ai-enabled-products": "/applications/produktagenter",
  "/forretningsomrader/leveranser": "/forretningsomrader/prosjekt-og-data",
  "/forretningsomrader/digitale-flater": "/applications/produktagenter"
};

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

const tryStat = (candidatePath) =>
  new Promise((resolve) => {
    fs.stat(candidatePath, (err, stats) => {
      if (err) {
        resolve(null);
        return;
      }
      resolve(stats);
    });
  });

const resolvePublicPath = async (relativePath) => {
  const candidates =
    relativePath === ""
      ? [path.join(publicDir, "index.html")]
      : [
          path.join(publicDir, relativePath),
          path.join(publicDir, `${relativePath}.html`),
          path.join(publicDir, relativePath, "index.html"),
        ];

  for (const candidate of candidates) {
    const resolvedCandidate = path.resolve(candidate);
    if (!resolvedCandidate.startsWith(publicDir)) {
      return { forbidden: true };
    }

    const stats = await tryStat(resolvedCandidate);
    if (!stats) continue;

    if (stats.isDirectory()) {
      const indexPath = path.join(resolvedCandidate, "index.html");
      const indexStats = await tryStat(indexPath);
      if (indexStats) {
        return { path: indexPath };
      }
      continue;
    }

    return { path: resolvedCandidate };
  }

  return { path: null };
};

const resolveIncludePath = (virtualPath) => {
  const relativeIncludePath = virtualPath.replace(/^\/+/, "");
  const resolvedIncludePath = path.resolve(publicDir, relativeIncludePath);

  if (!resolvedIncludePath.startsWith(publicDir)) {
    return null;
  }

  return resolvedIncludePath;
};

const renderHtmlWithIncludes = async (filePath, depth = 0) => {
  if (depth > maxIncludeDepth) {
    throw new Error("Max include depth exceeded");
  }

  const fileContent = await fs.promises.readFile(filePath, "utf8");
  const matches = Array.from(fileContent.matchAll(includePattern));

  if (matches.length === 0) {
    return fileContent;
  }

  let rendered = "";
  let lastIndex = 0;

  for (const match of matches) {
    const [fullMatch, virtualPath] = match;
    const includePath = resolveIncludePath(virtualPath);

    if (!includePath) {
      throw new Error(`Invalid include path: ${virtualPath}`);
    }

    rendered += fileContent.slice(lastIndex, match.index);
    rendered += await renderHtmlWithIncludes(includePath, depth + 1);
    lastIndex = match.index + fullMatch.length;
  }

  rendered += fileContent.slice(lastIndex);
  return rendered;
};

const server = http.createServer((req, res) => {
  (async () => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = requestUrl.pathname || "/";

    if (pathname.endsWith(".html")) {
      const cleanPath =
        pathname === "/index.html"
          ? "/"
          : pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "") || "/";
      const location = `${cleanPath}${requestUrl.search}`;
      res.writeHead(301, { Location: location });
      res.end();
      return;
    }

    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    if (Object.prototype.hasOwnProperty.call(permanentRedirects, normalizedPath)) {
      const location = `${permanentRedirects[normalizedPath]}${requestUrl.search}`;
      res.writeHead(301, { Location: location });
      res.end();
      return;
    }

    const sanitizedPath = pathname.replace(/\/+$/, "") || "/";
    const relativePath = sanitizedPath.replace(/^\/+/, "");

    if (relativePath.startsWith("_partials/")) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const resolved = await resolvePublicPath(relativePath);

    if (resolved.forbidden) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    if (!resolved.path) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(resolved.path).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    const headers = { "Content-Type": contentType };

    if ([".css", ".js"].includes(ext)) {
      headers["Cache-Control"] = "public, max-age=0, must-revalidate";
    } else if ([".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico"].includes(ext)) {
      headers["Cache-Control"] = "public, max-age=86400";
    } else if (ext === ".html") {
      headers["Cache-Control"] = "public, max-age=0, must-revalidate";
    }

    const responseBody =
      ext === ".html"
        ? applyAssetTokens(await renderHtmlWithIncludes(resolved.path))
        : await fs.promises.readFile(resolved.path);

    res.writeHead(200, headers);
    res.end(responseBody);
  })().catch(() => {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server Error");
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
