import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";

// Add process error handlers to catch unhandled errors
process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, "error");
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, "error");
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down gracefully', "server");
  process.exit(0);
});

process.on('SIGINT', () => {
  log('SIGINT received, shutting down gracefully', "server");
  process.exit(0);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    log('Starting server initialization...', "server");
    
    const server = await registerRoutes(app);
    log('Routes registered successfully', "server");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error handled: ${status} - ${message}`, "error");
      res.status(status).json({ message });
      
      // Don't throw the error, as it will cause uncaught exception
      if (status >= 500) {
        console.error('Server Error:', err);
      }
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    const environment = app.get("env") || process.env.NODE_ENV || "development";
    log(`Environment: ${environment}`, "server");
    
    if (environment === "development") {
      log('Setting up Vite development server...', "server");
      await setupVite(app, server);
      log('Vite development server setup complete', "server");
    } else {
      log('Setting up static file serving for production...', "server");
      
      // Check for the correct build output directory first
      const distPublic = path.resolve(import.meta.dirname, "..", "dist", "public");
      const indexPath = path.resolve(distPublic, "index.html");
      
      if (fs.existsSync(distPublic) && fs.existsSync(indexPath)) {
        log(`Serving static files from: ${distPublic}`, "server");
        
        // Serve static files with proper caching headers
        app.use(express.static(distPublic, {
          maxAge: '1y',
          etag: false,
          lastModified: false
        }));

        // SPA fallback - serve index.html for any unmatched routes
        app.use("*", (_req, res, next) => {
          res.sendFile(indexPath, (err) => {
            if (err) {
              log(`Error serving index.html: ${err.message}`, "error");
              next(err);
            }
          });
        });
        
        log('Static file serving setup complete', "server");
      } else {
        log(`Build directory not found at ${distPublic}, falling back to serveStatic`, "server");
        // Fallback to original serveStatic function for backwards compatibility
        serveStatic(app);
        log('Static file serving setup complete', "server");
      }
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    
    log(`Attempting to start server on port ${port}...`, "server");
    
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server successfully started and serving on port ${port}`, "server");
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use`, "error");
      } else {
        log(`Server error: ${error.message}`, "error");
      }
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error: any) {
    log(`Failed to start server: ${error.message}`, "error");
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  }
})();
