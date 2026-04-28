const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const includePattern = /<!--\s*#include\s+virtual="([^"]+)"\s*-->/g;
const maxIncludeDepth = 10;
const defaultLocale = "no";
const supportedLocales = new Set(["en", "no"]);
const languageCookieName = "neurosys-lang";
const sitemapPaths = [
  "/",
  "/about",
  "/services",
  "/agent-platform",
  "/contact",
  "/customer-references",
  "/ai-workshops",
  "/applications/dialogueagents",
  "/applications/processagents",
  "/applications/productagents",
  "/industries/marketing",
  "/industries/sales",
  "/industries/service",
  "/industries/production",
  "/industries/project-and-data",
  "/industries/transport-and-logistics",
  "/insights",
  "/insights/samelane-lms-competency-intelligence",
  "/insights/mediex-media-intelligence-platform",
  "/insights/jernia-agentic-pilot-insights",
  "/insights/identifying-ai-opportunities-in-industrial-operations",
  "/insights/operationalizing-agentic-ai-with-dify",
];

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
  "/training": "/ai-workshops",
  "/news": "/insights",
  "/our-work": "/customer-references",
  "/applications/dialogagenter": "/applications/dialogueagents",
  "/applications/prosessagenter": "/applications/processagents",
  "/applications/produktagenter": "/applications/productagents",
  "/forretningsomrader/markedsforing": "/industries/marketing",
  "/forretningsomrader/salg": "/industries/sales",
  "/forretningsomrader/service": "/industries/service",
  "/forretningsomrader/produksjon": "/industries/production",
  "/forretningsomrader/prosjekt-og-data": "/industries/project-and-data",
  "/forretningsomrader/transport-og-logistikk": "/industries/transport-and-logistics",
  "/forretningsomrader/leveranser": "/industries/project-and-data",
  "/applications/communication-agents": "/applications/dialogueagents",
  "/applications/ai-process-optimization": "/applications/processagents",
  "/applications/ai-enabled-products": "/applications/productagents",
  "/forretningsomrader/digitale-flater": "/applications/productagents",
  "/news/samelane-lms-competency-intelligence": "/insights/samelane-lms-competency-intelligence",
  "/news/mediex-media-intelligence-platform": "/insights/mediex-media-intelligence-platform",
  "/news/jernia-agentic-pilot-insights": "/insights/jernia-agentic-pilot-insights",
  "/news/identifying-ai-opportunities-in-industrial-operations": "/insights/identifying-ai-opportunities-in-industrial-operations",
  "/news/operationalizing-agentic-ai-with-dify": "/insights/operationalizing-agentic-ai-with-dify"
};

const routeAliases = {
  "/ai-workshops": "training",
  "/customer-references": "our-work",
  "/insights": "news/index",
  "/insights/samelane-lms-competency-intelligence":
    "news/samelane-lms-competency-intelligence",
  "/insights/mediex-media-intelligence-platform":
    "news/mediex-media-intelligence-platform",
  "/insights/jernia-agentic-pilot-insights":
    "news/jernia-agentic-pilot-insights",
  "/insights/identifying-ai-opportunities-in-industrial-operations":
    "news/identifying-ai-opportunities-in-industrial-operations",
  "/insights/operationalizing-agentic-ai-with-dify":
    "news/operationalizing-agentic-ai-with-dify",
  "/applications/dialogueagents": "applications/dialogagenter",
  "/applications/processagents": "applications/prosessagenter",
  "/applications/productagents": "applications/produktagenter",
  "/industries/marketing": "forretningsomrader/markedsforing",
  "/industries/sales": "forretningsomrader/salg",
  "/industries/service": "forretningsomrader/service",
  "/industries/production": "forretningsomrader/produksjon",
  "/industries/project-and-data": "forretningsomrader/prosjekt-og-data",
  "/industries/transport-and-logistics":
    "forretningsomrader/transport-og-logistikk"
};

const normalizePathname = (pathname) => pathname.replace(/\/+$/, "") || "/";
const decodeHtmlEntities = (value) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const normalizeText = (value) => decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
const escapeHtmlText = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeHtmlAttribute = (value) =>
  escapeHtmlText(value).replace(/"/g, "&quot;");

const extractObjectLiteral = (source, anchor) => {
  const anchorIndex = source.indexOf(anchor);
  if (anchorIndex === -1) return null;

  const objectStart = source.indexOf("{", anchorIndex);
  if (objectStart === -1) return null;

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(objectStart, index + 1);
      }
    }
  }

  return null;
};

const loadServerI18nStrings = () => {
  try {
    const appJs = fs.readFileSync(path.join(publicDir, "app.js"), "utf8");
    const objectLiteral = extractObjectLiteral(appJs, "const I18N_STRINGS =");
    if (!objectLiteral) {
      return {};
    }
    return vm.runInNewContext(`(${objectLiteral})`);
  } catch (error) {
    return {};
  }
};

const serverI18nStrings = loadServerI18nStrings();
const getLocaleDictionary = (locale) => serverI18nStrings[locale] || {};
const reverseNoDictionary = Object.fromEntries(
  Object.entries(serverI18nStrings.no || {}).reduce((entries, [english, norwegian]) => {
    if (typeof english !== "string" || typeof norwegian !== "string") {
      return entries;
    }
    const normalizedNorwegian = normalizeText(norwegian);
    if (!normalizedNorwegian || entries.some(([key]) => key === normalizedNorwegian)) {
      return entries;
    }
    entries.push([normalizedNorwegian, english]);
    return entries;
  }, [])
);

const prefixLocale = (locale, contentPath) => {
  const normalizedContentPath = normalizePathname(contentPath);
  return normalizedContentPath === "/"
    ? `/${locale}/`
    : `/${locale}${normalizedContentPath}`;
};

const extractLocale = (pathname) => {
  const normalized = normalizePathname(pathname);
  const match = normalized.match(/^\/(en|no)(?=\/|$)/);
  if (!match) {
    return { locale: null, hasLocalePrefix: false, contentPath: normalized };
  }

  const locale = match[1];
  const stripped = normalized.slice(match[0].length) || "/";
  return {
    locale,
    hasLocalePrefix: true,
    contentPath: normalizePathname(stripped),
  };
};

const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader
      .split(";")
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const separatorIndex = pair.indexOf("=");
        if (separatorIndex === -1) return [pair, ""];
        return [
          decodeURIComponent(pair.slice(0, separatorIndex).trim()),
          decodeURIComponent(pair.slice(separatorIndex + 1).trim()),
        ];
      })
  );

const getPreferredLocale = (req) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const cookieLocale = cookies[languageCookieName];
  if (supportedLocales.has(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = req.headers["accept-language"] || "";
  if (/\bno\b/i.test(acceptLanguage) || /\bnb\b/i.test(acceptLanguage)) {
    return "no";
  }

  return defaultLocale;
};

const isAssetRequest = (pathname) => {
  const ext = path.extname(pathname).toLowerCase();
  if (ext) return true;
  return ["/robots.txt", "/sitemap.xml"].includes(pathname);
};

const localizeSiteUrl = (url, locale) => {
  if (!url.startsWith("https://www.neurosys.no")) return url;
  const pathPart = url.slice("https://www.neurosys.no".length) || "/";
  return `https://www.neurosys.no${prefixLocale(locale, pathPart)}`;
};

const getSourceLanguage = (html) => {
  const match = html.match(/<html\b[^>]*lang="([^"]*)"/i);
  return match?.[1]?.toLowerCase() || "en";
};

const getTranslationDictionary = (sourceLanguage, locale) => {
  if (sourceLanguage.startsWith("no") && locale === "en") {
    return reverseNoDictionary;
  }
  if (!sourceLanguage.startsWith("no") && locale === "no") {
    return getLocaleDictionary("no");
  }
  return null;
};

const translateString = (value, dictionary) => {
  if (!dictionary || typeof value !== "string") return value;
  const translated = dictionary[normalizeText(value)];
  return translated || value;
};

const translateAttributeValue = (rawValue, attrName, dictionary) => {
  const decodedValue = decodeHtmlEntities(rawValue);
  const directTranslation = translateString(decodedValue, dictionary);
  if (directTranslation !== decodedValue) {
    return directTranslation;
  }

  if (attrName.toLowerCase() === "aria-label" && decodedValue.startsWith("Read: ")) {
    const translatedPrefix = translateString("Read:", dictionary);
    const translatedTitle = translateString(decodedValue.slice(6), dictionary);
    if (translatedPrefix !== "Read:" || translatedTitle !== decodedValue.slice(6)) {
      return `${translatedPrefix} ${translatedTitle}`;
    }
  }

  return decodedValue;
};

const localizeStructuredData = (value, locale, dictionary) => {
  if (typeof value === "string") {
    const localizedUrl = localizeSiteUrl(value, locale);
    return translateString(localizedUrl, dictionary);
  }

  if (Array.isArray(value)) {
    return value.map((item) => localizeStructuredData(item, locale, dictionary));
  }

  if (value && typeof value === "object") {
    const localizedObject = Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        localizeStructuredData(nestedValue, locale, dictionary),
      ])
    );

    if (localizedObject["@type"] && !localizedObject.inLanguage) {
      localizedObject.inLanguage = locale === "no" ? "nb-NO" : "en";
    }

    return localizedObject;
  }

  return value;
};

const replaceMetaContent = (html, attrName, attrValue, translate) =>
  html.replace(
    new RegExp(
      `(<meta[\\s\\S]*?${attrName}="${attrValue}"[\\s\\S]*?content=")([^"]*)("[\\s\\S]*?\\/>)`,
      "i"
    ),
    (match, prefix, content, suffix) => `${prefix}${escapeHtmlAttribute(translate(content))}${suffix}`
  );

const translateHtmlAttributes = (html, dictionary) =>
  html.replace(
    /\b(placeholder|aria-label|title|alt)="([^"]*)"/gi,
    (match, attrName, rawValue) => {
      const translated = translateAttributeValue(rawValue, attrName, dictionary);
      return `${attrName}="${escapeHtmlAttribute(translated)}"`;
    }
  );

const translateHtmlTextNodes = (html, dictionary) =>
  html.replace(/>([^<>]+)</g, (match, rawText) => {
    const normalized = normalizeText(rawText);
    const translated = dictionary[normalized];
    if (!translated) return match;

    const leadingWhitespace = rawText.match(/^\s*/)?.[0] ?? "";
    const trailingWhitespace = rawText.match(/\s*$/)?.[0] ?? "";
    return `>${leadingWhitespace}${escapeHtmlText(translated)}${trailingWhitespace}<`;
  });

const translateHtmlContent = (html, dictionary) => {
  if (!dictionary) return html;

  const segments = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/gi);
  return segments
    .map((segment, index) => {
      if (index % 2 === 1) return segment;
      return translateHtmlTextNodes(translateHtmlAttributes(segment, dictionary), dictionary);
    })
    .join("");
};

const translateHeadMetadata = (html, dictionary) => {
  let transformed = html;

  if (dictionary) {
    transformed = transformed.replace(/<title>([\s\S]*?)<\/title>/i, (match, title) => {
      return `<title>${escapeHtmlText(translateString(title, dictionary))}</title>`;
    });

    transformed = replaceMetaContent(transformed, "name", "description", (content) =>
      translateString(content, dictionary)
    );
    transformed = replaceMetaContent(transformed, "property", "og:title", (content) =>
      translateString(content, dictionary)
    );
    transformed = replaceMetaContent(
      transformed,
      "property",
      "og:description",
      (content) => translateString(content, dictionary)
    );
    transformed = replaceMetaContent(transformed, "name", "twitter:title", (content) =>
      translateString(content, dictionary)
    );
    transformed = replaceMetaContent(
      transformed,
      "name",
      "twitter:description",
      (content) => translateString(content, dictionary)
    );
  }

  transformed = transformed.replace(
    /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi,
    (match, jsonText) => {
      try {
        const parsed = JSON.parse(jsonText);
        const localized = localizeStructuredData(parsed, locale, dictionary);
        return `<script type="application/ld+json">\n    ${JSON.stringify(
          localized,
          null,
          2
        ).replace(/\n/g, "\n    ")}\n    </script>`;
      } catch (error) {
        return match;
      }
    }
  );

  return transformed;
};

const generateHreflangLinks = (contentPath) => {
  const xDefaultPath = normalizePathname(contentPath);
  const enUrl = `https://www.neurosys.no${prefixLocale("en", xDefaultPath)}`;
  const noUrl = `https://www.neurosys.no${prefixLocale("no", xDefaultPath)}`;
  const xDefaultUrl = `https://www.neurosys.no${prefixLocale(defaultLocale, xDefaultPath)}`;

  return [
    `<link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `<link rel="alternate" hreflang="no" href="${noUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`,
  ].join("");
};

const rewriteAnchorHrefs = (html, locale) =>
  html.replace(/(<a\b[^>]*\shref=")(\/[^"]*)"/g, (match, prefix, href) => {
    if (href.startsWith("//") || href.startsWith("/_partials/")) {
      return match;
    }
    return `${prefix}${prefixLocale(locale, href)}"`;
  });

const transformHtmlForLocale = (html, locale, contentPath) => {
  const localizedUrl = `https://www.neurosys.no${prefixLocale(locale, contentPath)}`;
  const sourceLanguage = getSourceLanguage(html);
  const dictionary = getTranslationDictionary(sourceLanguage, locale);
  const runtimeConfig =
    `<script>window.__NEUROSYS_LANG__=${JSON.stringify(locale)};` +
    `window.__NEUROSYS_LOCALE_PATH__=${JSON.stringify(contentPath)};</script>`;

  let transformed = translateHtmlContent(translateHeadMetadata(html, dictionary), dictionary)
    .replace(/<html\b[^>]*lang="[^"]*"/i, `<html lang="${locale}"`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/i, `<link rel="canonical" href="${localizedUrl}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/i, `<meta property="og:url" content="${localizedUrl}" />`);

  transformed = rewriteAnchorHrefs(transformed, locale);

  transformed = transformed.replace(
    /<\/head>/i,
    `<meta property="og:locale" content="${locale === "no" ? "nb_NO" : "en_US"}" />${generateHreflangLinks(contentPath)}${runtimeConfig}</head>`
  );

  return transformed;
};

const generateSitemapXml = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = [];

  for (const locale of ["en", "no"]) {
    for (const contentPath of sitemapPaths) {
      const loc = `https://www.neurosys.no${prefixLocale(locale, contentPath)}`;
      const enUrl = `https://www.neurosys.no${prefixLocale("en", contentPath)}`;
      const noUrl = `https://www.neurosys.no${prefixLocale("no", contentPath)}`;
      const xDefaultUrl = `https://www.neurosys.no${prefixLocale(defaultLocale, contentPath)}`;
      urls.push([
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />`,
        `    <xhtml:link rel="alternate" hreflang="no" href="${noUrl}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`,
        `    <lastmod>${lastmod}</lastmod>`,
        "    <changefreq>weekly</changefreq>",
        "    <priority>0.7</priority>",
        "  </url>",
      ].join("\n"));
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
  ].join("\n");
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
    const normalizedPath = normalizePathname(pathname);

    if (normalizedPath === "/sitemap.xml") {
      res.writeHead(200, {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      });
      res.end(generateSitemapXml());
      return;
    }

    if (pathname.endsWith(".html")) {
      const cleanPath =
        pathname === "/index.html"
          ? "/"
          : pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "") || "/";
      const location = `${normalizePathname(cleanPath)}${requestUrl.search}`;
      res.writeHead(301, { Location: location });
      res.end();
      return;
    }

    const localeMatch = extractLocale(normalizedPath);
    const hasExtension = Boolean(path.extname(normalizedPath));

    if (!localeMatch.hasLocalePrefix && !isAssetRequest(normalizedPath) && !hasExtension) {
      const redirectedPath = permanentRedirects[localeMatch.contentPath] || localeMatch.contentPath;
      const location = `${prefixLocale(defaultLocale, redirectedPath)}${requestUrl.search}`;
      res.writeHead(301, { Location: location });
      res.end();
      return;
    }

    if (
      localeMatch.hasLocalePrefix &&
      Object.prototype.hasOwnProperty.call(permanentRedirects, localeMatch.contentPath)
    ) {
      const location = `${prefixLocale(
        localeMatch.locale,
        permanentRedirects[localeMatch.contentPath]
      )}${requestUrl.search}`;
      res.writeHead(301, { Location: location });
      res.end();
      return;
    }

    const contentPath = localeMatch.hasLocalePrefix ? localeMatch.contentPath : normalizedPath;
    const aliasedPath = routeAliases[contentPath] || contentPath;
    const relativePath = aliasedPath === "/" ? "" : aliasedPath.replace(/^\/+/, "");

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
        ? transformHtmlForLocale(
            applyAssetTokens(await renderHtmlWithIncludes(resolved.path)),
            localeMatch.locale || getPreferredLocale(req),
            contentPath
          )
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
