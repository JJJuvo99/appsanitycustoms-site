import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Legacy Express contact route.
  // Cloudflare Pages now handles production contact form email via:
  // functions/api/contact.ts
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);

      const contactMessage = await storage.createContactMessage(validatedData);

      console.log("New contact message received:", contactMessage);

      res.json({
        success: true,
        message: "Thank you for your message! I'll get back to you soon.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Please check your input and try again.",
          errors: error.errors,
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({
          success: false,
          message: "Something went wrong. Please try again later.",
        });
      }
    }
  });

  // Get contact messages (legacy/admin route)
  app.get("/api/contact-messages", async (_req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
