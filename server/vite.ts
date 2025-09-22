// server/vite.ts
import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";
import { createServer as createViteServer, createLogger } from "vite";
import type { Server } from "node:http";
import viteConfig from "../vite.config"; // keep if you rely on it; otherwise remove
import { nanoid } from "nanoid";

const viteLogger = createLogger();

/** Small timestamped logger (optional) */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

/** ---------- PRODUCTION: serve built client from dist/public ---------- */
const clientDir = path.resolve(process.cwd(), "dist", "public");
const indexFile = path.join(clientDir, "index.html");

export function serveStatic(app: Express) {
  if (!fs.existsSync(clientDir)) {
    throw new Error(
      `Build output not found at ${clientDir}. Did you run "npm run build" and is Vite's build.outDir = "dist/public"?`
    );
  }

  // Health check for Replit Autoscale
  app.get("/healthz", (_req, res) => res.sendStatus(200));

  // Serve static files (assets, index.html will be handled below for SPA)
  app.use(express.static(clientDir));

  // SPA fallback: always return index.html for non-asset routes
  app.use("*", (_req, res) => {
    res.sendFile(indexFile);
  });

  log(`Serving static client from ${clientDir}`, "serveStatic");
}

/** ---------- DEVELOPMENT: Vite middleware (HMR) ---------- */
export async function setupVite(app: Express, server?: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      middlewareMode: true,
      // Use the existing HTTP server when provided (for HMR websockets)
      hmr: server ? { server } : true,
      allowedHosts: true as const,
    },
    appType: "custom",
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Make failures obvious in platform logs
        process.exit(1);
      },
    },
  });

  app.use(vite.middlewares);

  // Health check in dev too
  app.get("/healthz", (_req, res) => res.sendStatus(200));

  // Pick your dev index.html location; this matches your previous code:
  // project-root/client/index.html
  const devIndex = path.resolve(process.cwd(), "client", "index.html");

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;

      // Always load latest template from disk
      const templatePath = fs.existsSync(devIndex)
        ? devIndex
        : path.resolve(process.cwd(), "index.html"); // fallback if you keep index at root

      let template = await fs.promises.readFile(templatePath, "utf-8");

      // Bust cache for your entry if you like
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  log("Vite middleware attached (development)", "setupVite");
}

/** ---------- Auto-select dev vs prod ---------- */
export async function attachVite(app: Express, server?: Server) {
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }
}

export default attachVite;
