const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const zlib = require("zlib");
const { randomUUID } = require("crypto");

const loadLocalEnv = () => {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  const envSource = fs.readFileSync(envPath, "utf8");
  envSource.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) return;

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
};

loadLocalEnv();

if (!process.env.DIFY_API && process.env.DIFY_API_KEY) {
  process.env.DIFY_API = process.env.DIFY_API_KEY;
}

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const includePattern = /<!--\s*#include\s+virtual="([^"]+)"\s*-->/g;
const maxIncludeDepth = 10;
const defaultLocale = "no";
const supportedLocales = new Set(["en", "no"]);
const languageCookieName = "neurosys-lang";
const analyzerBasePath = "/analyze-your-business";
const scanTimeoutMs = Math.max(
  15000,
  parseInt(process.env.DIFY_SCAN_TIMEOUT_MS || "120000", 10) || 120000
);
const scanCacheTtlMs = Math.max(
  60000,
  parseInt(process.env.DIFY_SCAN_CACHE_TTL_MS || "21600000", 10) || 21600000
);
const scanRateLimitWindowMs = 60000;
const scanRateLimitMax = 5;
const scanJobs = new Map();
const scanCache = new Map();
const rateLimitStore = new Map();
const sitemapPaths = [
  "/",
  "/about",
  "/services",
  "/agent-platform",
  "/contact",
  analyzerBasePath,
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

const compressibleContentTypes = [
  "text/",
  "application/javascript",
  "text/javascript",
  "application/json",
  "application/xml",
  "image/svg+xml"
];

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

const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

const canCompressResponse = (req, contentType, bodyLength) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";
  if (bodyLength < 1024 || !/\b(br|gzip)\b/.test(acceptEncoding)) {
    return false;
  }

  return compressibleContentTypes.some((prefix) => contentType.startsWith(prefix));
};

const compressResponseBody = (req, body, headers) => {
  const bodyBuffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const contentType = headers["Content-Type"] || "";

  if (!canCompressResponse(req, contentType, bodyBuffer.length)) {
    return { body: bodyBuffer, headers };
  }

  const acceptEncoding = req.headers["accept-encoding"] || "";
  const nextHeaders = { ...headers, Vary: "Accept-Encoding" };

  try {
    if (acceptEncoding.includes("br")) {
      return {
        body: zlib.brotliCompressSync(bodyBuffer),
        headers: { ...nextHeaders, "Content-Encoding": "br" }
      };
    }

    if (acceptEncoding.includes("gzip")) {
      return {
        body: zlib.gzipSync(bodyBuffer),
        headers: { ...nextHeaders, "Content-Encoding": "gzip" }
      };
    }
  } catch (error) {
    return { body: bodyBuffer, headers };
  }

  return { body: bodyBuffer, headers };
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
  [analyzerBasePath]: "analyze-your-business",
  [`${analyzerBasePath}/loading`]: "analyze-your-business-loading",
  [`${analyzerBasePath}/result`]: "analyze-your-business-result",
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
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendJson = (req, res, statusCode, payload, extraHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  };
  const compressedResponse = compressResponseBody(req, JSON.stringify(payload), headers);
  res.writeHead(statusCode, compressedResponse.headers);
  res.end(compressedResponse.body);
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 64 * 1024) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!rawBody.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
};

const consumeRateLimit = (key) => {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(key) || []).filter(
    (timestamp) => now - timestamp < scanRateLimitWindowMs
  );
  timestamps.push(now);
  rateLimitStore.set(key, timestamps);
  return {
    allowed: timestamps.length <= scanRateLimitMax,
    remaining: Math.max(scanRateLimitMax - timestamps.length, 0),
    retryAfterMs: timestamps[0] ? scanRateLimitWindowMs - (now - timestamps[0]) : 0,
  };
};

const normalizeWebsiteUrl = (input) => {
  const raw = String(input || "").trim();
  if (!raw) {
    throw new Error("Please enter a website URL.");
  }

  const withProtocol = /^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`;
  let parsedUrl;
  try {
    parsedUrl = new URL(withProtocol);
  } catch (error) {
    throw new Error("Please enter a valid website URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  if (!parsedUrl.hostname || !parsedUrl.hostname.includes(".")) {
    throw new Error("Please enter a valid company website.");
  }

  parsedUrl.hash = "";
  const normalizedPathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";
  parsedUrl.pathname = normalizedPathname === "/" ? "/" : normalizedPathname;
  return {
    normalizedUrl: parsedUrl.toString(),
    domainKey: parsedUrl.hostname.toLowerCase(),
  };
};

const cleanupExpiredScans = () => {
  const now = Date.now();
  for (const [cacheKey, entry] of scanCache.entries()) {
    if (now - entry.completedAt > scanCacheTtlMs) {
      scanCache.delete(cacheKey);
    }
  }

  for (const [scanId, job] of scanJobs.entries()) {
    const age = now - (job.updatedAt || job.createdAt || now);
    if (
      (job.status === "completed" || job.status === "failed") &&
      age > scanCacheTtlMs
    ) {
      scanJobs.delete(scanId);
    }
  }
};

const safeParseJson = (value) => {
  if (value == null) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    return null;
  }
};

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((entry) => String(entry).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n+/)
      .map((entry) => entry.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean);
  }
  return [];
};

const firstNonEmpty = (...values) =>
  values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .find((value) => typeof value === "string" && value.trim()) || "";

const extractPlainText = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return firstNonEmpty(value);
  return "";
};

const extractInsightHeadline = (value) => {
  const text = extractPlainText(value)
    .replace(/#{1,6}\s*/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);
  return text || "";
};

const extractLeadSentence = (value) => {
  const text = extractPlainText(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  const match = text.match(/^(.+?[.!?])(?:\s|$)/);
  return (match ? match[1] : text).trim();
};

const WORKFLOW_NODE_OUTPUT_MAP = {
  "Business Understanding": "company",
  "AI Opportunities": "opportunity",
};

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

const EFFORT_ORDER = {
  low: 0,
  medium: 1,
  high: 2,
};

const mergeOutputs = (target, source) => {
  if (!source || typeof source !== "object") return target;
  Object.entries(source).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    target[key] = value;
  });
  return target;
};

const getSectionsReady = (outputs = {}) => ({
  summary: Boolean(
    firstNonEmpty(outputs.summary, safeParseJson(outputs.company)?.summary, outputs.company_name)
  ),
  situation: false,
  opportunities: Boolean(
    ensureArray(
      safeParseJson(outputs.opportunity)?.opportunities ||
        safeParseJson(outputs.opportunities) ||
        safeParseJson(outputs.ai_opportunities)
    ).length
  ),
  actions: false,
  investment: false,
  comparison: false,
  narrative: false,
});

const rankOpportunity = (opportunity) => {
  const priority = String(opportunity?.priority || "").trim().toLowerCase();
  const effort = String(opportunity?.effort || "").trim().toLowerCase();
  return {
    priority: PRIORITY_ORDER[priority] ?? 99,
    effort: EFFORT_ORDER[effort] ?? 99,
    title: String(opportunity?.title || "").toLowerCase(),
  };
};

const getJobProgress = (job) => ({
  workflowRunId: job.workflowRunId || null,
  taskId: job.taskId || null,
  currentNodeTitle: job.currentNodeTitle || "",
  completedNodes: job.completedNodes || [],
  sectionsReady: getSectionsReady(job.partialOutputs || job.result?.rawOutputs || {}),
  lastEvent: job.lastEvent || null,
});

const serializeResultForClient = (result) => {
  if (!result || typeof result !== "object") return null;
  const { rawOutputs, ...clientResult } = result;
  return clientResult;
};

const updateJobPartialResult = (job) => {
  job.result = normalizeDifyResult({ outputs: job.partialOutputs || {} }, job.websiteUrl);
  job.updatedAt = Date.now();
};

const applyWorkflowEventToJob = (job, event) => {
  if (!job || !event || typeof event !== "object") return;

  if (event.task_id) {
    job.taskId = event.task_id;
  }
  if (event.workflow_run_id) {
    job.workflowRunId = event.workflow_run_id;
  }
  if (event.event) {
    job.lastEvent = event.event;
  }

  const data = event.data && typeof event.data === "object" ? event.data : {};

  if (event.event === "node_started") {
    job.currentNodeTitle = data.title || data.node_type || "";
    job.updatedAt = Date.now();
    return;
  }

  if (event.event === "node_finished") {
    if (data.title || data.node_id) {
      job.completedNodes = job.completedNodes || [];
      job.completedNodes.push({
        id: data.node_id || data.id || randomUUID(),
        title: data.title || data.node_type || "Node",
        status: data.status || "succeeded",
      });
    }
    if (data.outputs && typeof data.outputs === "object") {
      mergeOutputs(job.partialOutputs, data.outputs);
      if (typeof data.title === "string" && typeof data.outputs.text === "string") {
        const mappedKey = WORKFLOW_NODE_OUTPUT_MAP[data.title.trim()];
        if (mappedKey) {
          job.partialOutputs[mappedKey] = data.outputs.text;
        }
      }
      updateJobPartialResult(job);
    }
    job.currentNodeTitle = "";
    job.updatedAt = Date.now();
    return;
  }

  if (event.event === "workflow_finished") {
    if (data.outputs && typeof data.outputs === "object") {
      mergeOutputs(job.partialOutputs, data.outputs);
      updateJobPartialResult(job);
    }

    if (data.status === "succeeded") {
      job.status = "completed";
      job.error = null;
      job.updatedAt = Date.now();
      if (job.result) {
        scanCache.set(job.domainKey, {
          result: job.result,
          completedAt: job.updatedAt,
        });
      }
    } else {
      job.status = "failed";
      job.error = data.error || "The analysis could not be completed.";
      job.updatedAt = Date.now();
    }
    job.currentNodeTitle = "";
  }
};

const consumeSseStream = async (stream, onEvent) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

    let separatorIndex = buffer.indexOf("\n\n");
    while (separatorIndex !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex).trim();
      buffer = buffer.slice(separatorIndex + 2);

      if (rawEvent) {
        const dataPayload = rawEvent
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("\n");

        if (dataPayload) {
          try {
            const parsedEvent = JSON.parse(dataPayload);
            await onEvent(parsedEvent);
          } catch (error) {
            // Ignore malformed chunks to keep the stream alive.
          }
        }
      }

      separatorIndex = buffer.indexOf("\n\n");
    }
  }
};

const normalizeDifyResult = (payload, websiteUrl) => {
  const outputs = payload?.data?.outputs || payload?.outputs || payload?.data || payload || {};
  const company =
    safeParseJson(outputs.company) ||
    {};
  const opportunityPayload =
    safeParseJson(outputs.opportunity) ||
    safeParseJson(outputs.opportunities) ||
    safeParseJson(outputs.ai_opportunities) ||
    {};
  const opportunities = Array.isArray(opportunityPayload)
    ? opportunityPayload
    : opportunityPayload.opportunities || [];
  const companyName = firstNonEmpty(
    outputs.company_name,
    outputs.companyName,
    company.company_name,
    company.companyName
  );
  const summary = firstNonEmpty(outputs.summary, company.summary, company.company_summary);

  const normalizedOpportunities = Array.isArray(opportunities)
    ? opportunities.map((opportunity, index) => ({
        title: firstNonEmpty(
          opportunity?.title,
          opportunity?.opportunity,
          opportunity?.name,
          `Opportunity ${index + 1}`
        ),
        where: firstNonEmpty(opportunity?.where, opportunity?.area, opportunity?.category),
        what: firstNonEmpty(
          opportunity?.what,
          opportunity?.summary,
          opportunity?.description,
          opportunity?.why_now,
          opportunity?.whyNow
        ),
        why: firstNonEmpty(
          opportunity?.why,
          opportunity?.impact,
          opportunity?.business_impact,
          opportunity?.businessImpact
        ),
        value: firstNonEmpty(
          opportunity?.value,
          opportunity?.business_value,
          opportunity?.businessValue
        ),
        howItIsBuilt: firstNonEmpty(
          opportunity?.how_it_is_built,
          opportunity?.howItIsBuilt,
          opportunity?.how_neurosys_delivers,
          opportunity?.howNeurosysDelivers,
          opportunity?.neurosys_approach,
          opportunity?.neurosysApproach
        ),
        firstStep: firstNonEmpty(opportunity?.first_step, opportunity?.firstStep),
        effort: firstNonEmpty(opportunity?.effort, opportunity?.complexity),
        priority: firstNonEmpty(opportunity?.priority),
      }))
        .sort((left, right) => {
          const leftRank = rankOpportunity(left);
          const rightRank = rankOpportunity(right);
          return (
            leftRank.priority - rightRank.priority ||
            leftRank.effort - rightRank.effort ||
            leftRank.title.localeCompare(rightRank.title)
          );
        })
    : [];
  const keyInsight = firstNonEmpty(
    outputs.key_insight,
    outputs.keyInsight,
    extractLeadSentence(summary),
    normalizedOpportunities[0]?.title
  );

  return {
    companyName,
    websiteUrl,
    summary,
    keyInsight,
    opportunities: normalizedOpportunities,
    generatedAt: new Date().toISOString(),
    rawOutputs: outputs,
  };
};

const runScanJob = async (scanId) => {
  const job = scanJobs.get(scanId);
  if (!job || job.status === "completed") {
    return;
  }

  if (!process.env.DIFY_API) {
    job.status = "failed";
    job.error = "Scanner is not configured on the server.";
    job.updatedAt = Date.now();
    return;
  }

  job.status = "running";
  job.updatedAt = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), scanTimeoutMs);

  try {
    const response = await fetch(
      `${process.env.DIFY_API_BASE_URL || "https://workflows.neurosys.com/v1"}/workflows/run`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DIFY_API}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            website_url: job.websiteUrl,
          },
          response_mode: "streaming",
          user: `neurosys-web:${job.domainKey}`,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.message || "The analysis request failed.");
    }

    await consumeSseStream(response.body, async (event) => {
      applyWorkflowEventToJob(job, event);
    });

    if (job.status === "running") {
      job.status = "failed";
      job.error = "The analysis could not be completed.";
      job.updatedAt = Date.now();
    }
  } catch (error) {
    job.status = "failed";
    job.error =
      error?.name === "AbortError"
        ? "The analysis took too long. Please try again."
        : error?.message || "The analysis could not be completed.";
    job.updatedAt = Date.now();
  } finally {
    clearTimeout(timeout);
    cleanupExpiredScans();
  }
};

const server = http.createServer((req, res) => {
  (async () => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = requestUrl.pathname || "/";
    const normalizedPath = normalizePathname(pathname);

    if (normalizedPath === "/api/scan" && req.method === "POST") {
      cleanupExpiredScans();
      const rateLimit = consumeRateLimit(getClientIp(req));
      if (!rateLimit.allowed) {
        sendJson(req, res, 429, {
          error: "Too many scan requests. Please wait a moment and try again.",
        });
        return;
      }

      let body;
      try {
        body = await readJsonBody(req);
      } catch (error) {
        sendJson(req, res, 400, { error: error.message });
        return;
      }

      let normalizedInput;
      try {
        normalizedInput = normalizeWebsiteUrl(body.website_url || body.websiteUrl);
      } catch (error) {
        sendJson(req, res, 400, { error: error.message });
        return;
      }

      const cachedEntry = scanCache.get(normalizedInput.domainKey);
      const scanId = randomUUID();
      const now = Date.now();

      if (cachedEntry && now - cachedEntry.completedAt < scanCacheTtlMs) {
        scanJobs.set(scanId, {
          id: scanId,
          status: "completed",
          websiteUrl: normalizedInput.normalizedUrl,
          domainKey: normalizedInput.domainKey,
          result: cachedEntry.result,
          partialOutputs: cachedEntry.result?.rawOutputs || {},
          workflowRunId: null,
          taskId: null,
          currentNodeTitle: "",
          completedNodes: [],
          lastEvent: "workflow_finished",
          error: null,
          createdAt: now,
          updatedAt: now,
        });
        sendJson(req, res, 200, {
          scanId,
          status: "completed",
          cached: true,
          websiteUrl: normalizedInput.normalizedUrl,
        });
        return;
      }

      scanJobs.set(scanId, {
        id: scanId,
        status: "queued",
        websiteUrl: normalizedInput.normalizedUrl,
        domainKey: normalizedInput.domainKey,
        result: null,
        partialOutputs: {},
        workflowRunId: null,
        taskId: null,
        currentNodeTitle: "",
        completedNodes: [],
        lastEvent: null,
        error: null,
        createdAt: now,
        updatedAt: now,
      });

      void runScanJob(scanId);

      sendJson(req, res, 202, {
        scanId,
        status: "queued",
        websiteUrl: normalizedInput.normalizedUrl,
      });
      return;
    }

    if (normalizedPath === "/api/scan-status" && req.method === "GET") {
      cleanupExpiredScans();
      const scanId = requestUrl.searchParams.get("id");
      if (!scanId) {
        sendJson(req, res, 400, { error: "Missing scan id." });
        return;
      }

      const job = scanJobs.get(scanId);
      if (!job) {
        sendJson(req, res, 404, { error: "Scan not found." });
        return;
      }

      sendJson(req, res, 200, {
        scanId: job.id,
        status: job.status,
        websiteUrl: job.websiteUrl,
        domainKey: job.domainKey,
        retryable: job.status === "failed",
        error: job.error,
        result: serializeResultForClient(job.result),
        progress: getJobProgress(job),
      });
      return;
    }

    if (
      ["/api/scan", "/api/scan-status"].includes(normalizedPath) &&
      !["POST", "GET"].includes(req.method || "GET")
    ) {
      sendJson(req, res, 405, { error: "Method not allowed." }, { Allow: "GET, POST" });
      return;
    }

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
    } else if ([".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif", ".ico", ".woff2"].includes(ext)) {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    } else if (ext === ".html") {
      headers["Cache-Control"] = "public, max-age=0, must-revalidate";
    }

    let responseBody;
    if (ext === ".html") {
      responseBody = transformHtmlForLocale(
        applyAssetTokens(await renderHtmlWithIncludes(resolved.path)),
        localeMatch.locale || getPreferredLocale(req),
        contentPath
      );
    } else if (ext === ".css") {
      responseBody = minifyCss(await fs.promises.readFile(resolved.path, "utf8"));
    } else {
      responseBody = await fs.promises.readFile(resolved.path);
    }

    const compressedResponse = compressResponseBody(req, responseBody, headers);
    res.writeHead(200, compressedResponse.headers);
    res.end(compressedResponse.body);
  })().catch(() => {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server Error");
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
