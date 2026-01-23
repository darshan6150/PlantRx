import type { Express } from "express";

export function setupSEORedirects(app: Express) {
  // Trust Render/Proxy headers
  app.set("trust proxy", 1);

  app.use((req, res, next) => {
    const host = (req.headers.host || "").toLowerCase();

    // 1) Canonical host: FORCE non-www -> www (matches Render setup)
    if (host === "plantrxapp.com") {
      return res.redirect(301, `https://www.plantrxapp.com${req.originalUrl}`);
    }

    // 2) Force HTTPS if proxy says request came in via http
    const xfProto = (req.headers["x-forwarded-proto"] || "").toString().toLowerCase();
    if (xfProto.includes("http") && !xfProto.includes("https")) {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }

    next();
  });
}
