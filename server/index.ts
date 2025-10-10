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
    const server = await registerRoutes(app);

    // API 404 handler
    app.use("/api/*", (_req: Request, res: Response) => {
      res.status(404).json({ message: "API endpoint not found" });
    });

    // ---- Mount /policies (static) AFTER routes registration ----
    const isProd = process.env.NODE_ENV === "production";
    const distPolicies = path.join(process.cwd(), "dist", "policies");
    const publicPolicies = path.join(process.cwd(), "public", "policies");
    const policiesDir = isProd && fs.existsSync(distPolicies) ? distPolicies : publicPolicies;

    if (fs.existsSync(policiesDir)) {
      app.use(
        "/policies",
        express.static(policiesDir, {
          extensions: ["html"],
          setHeaders(res, filePath) {
            if (filePath.endsWith(".html")) {
              res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
            } else {
              res.setHeader("Cache-Control", "public, max-age=86400, immutable");
            }
          },
        })
      );
    }

    if (!isProd) {
      await setupVite(app, server);
    } else {
      try {
        serveStatic(app);
      } catch (error: any) {
        log(`Failed to setup static files: ${error.message}`, "error");
        throw error;
      }
    }

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      if (status >= 500) console.error("Server Error:", err);
    });

    const port = parseInt(process.env.PORT || "5000", 10);

    server.listen(
      { port, host: "0.0.0.0", reusePort: true },
      () => {
        log(`Server ready on port ${port}`, "server");
      }
    );

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        log(`Port ${port} in use`, "error");
      } else {
        log(`Server error: ${error.message}`, "error");
      }
      console.error("Server error:", error);
      process.exit(1);
    });
  } catch (error: any) {
    log(`Startup failed: ${error.message}`, "error");
    console.error("Fatal error:", error);
    process.exit(1);
  }
})();
