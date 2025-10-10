// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "node:fs";
import path from "node:path";

// ---- Process error handlers (keep) ----
process.on("uncaughtException", (error) => {
  log(`Uncaught Exception: ${error.message}`, "error");
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, "error");
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
process.on("SIGTERM", () => {
  log("SIGTERM received, shutting down gracefully", "server");
  process.exit(0);
});
process.on("SIGINT", () => {
  log("SIGINT received, shutting down gracefully", "server");
  process.exit(0);
});

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---- Mount /policies (static) BEFORE any SPA fallback or Vite middleware ----
(() => {
  // Prefer the built folder in prod; fall back to source public/policies in dev
  const distPolicies = path.join(process.cwd(), "dist", "policies");
  const publicPolicies = path.join(process.cwd(), "public", "policies");
  const policiesDir = fs.existsSync(distPolicies) ? distPolicies : publicPolicies;

  app.use(
    "/policies",
    express.static(policiesDir, {
      extensions: ["html"], // lets /policies/app-name resolve index.html
      setHeaders(res, filePath) {
        // cache HTML lightly, assets longer
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
        } else {
          res.setHeader("Cache-Control", "public, max-age=86400, immutable");
        }
      },
    })
  );
  log(`Serving /policies from: ${policiesDir}`, "server");
})();

// ---- API logging (keep) ----
app.use((req, res, next) => {
  const start = Date.now();
  const routePath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson as Record<string, any>;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (routePath.startsWith("/api")) {
      let logLine = `${req.method} ${routePath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    log("Starting server initialization...", "server");

    const server = await registerRoutes(app);
    log("Routes registered successfully", "server");

    // API 404 handler
    app.use("/api/*", (_req: Request, res: Response) => {
      res.status(404).json({ message: "API endpoint not found" });
    });

    const isProd = process.env.NODE_ENV === "production";
    log(`Environment: ${isProd ? "production" : "development"}`, "server");

    if (!isProd) {
      // Dev: Vite HMR (keep AFTER /policies mount so policies always serve statically)
      log("Setting up Vite development server...", "server");
      await setupVite(app, server);
      log("Vite development server setup complete", "server");
    } else {
      // Prod: serve built assets + SPA fallback
      log("Setting up static file serving for production...", "server");
      try {
        serveStatic(app);
        log("Static file serving setup complete", "server");
      } catch (error: any) {
        log(`Failed to setup static file serving: ${error.message}`, "error");
        log("This may indicate that 'npm run build' needs to be run first", "server");
        throw error;
      }
    }

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error handled: ${status} - ${message}`, "error");
      res.status(status).json({ message });
      if (status >= 500) console.error("Server Error:", err);
    });

    const port = parseInt(process.env.PORT || "5000", 10);
    log(`Attempting to start server on port ${port}...`, "server");

    server.listen(
      { port, host: "0.0.0.0", reusePort: true },
      () => {
        log(`Server successfully started and serving on port ${port}`, "server");
        log(`NODE_ENV=${process.env.NODE_ENV ?? "undefined"}`, "server");
      }
    );

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        log(`Port ${port} is already in use`, "error");
      } else {
        log(`Server error: ${error.message}`, "error");
      }
      console.error("Server error:", error);
      process.exit(1);
    });
  } catch (error: any) {
    log(`Failed to start server: ${error.message}`, "error");
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
})();
