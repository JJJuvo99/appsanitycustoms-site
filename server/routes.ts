import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { sendContactFormEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      const contactMessage = await storage.createContactMessage(validatedData);
      
      // Send email notification using SendGrid
      const emailSent = await sendContactFormEmail({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      });
      
      if (emailSent) {
        console.log("New contact message received and email sent:", contactMessage);
      } else {
        console.error("Contact message stored but email failed to send:", contactMessage);
      }
      
      res.json({ 
        success: true, 
        message: "Thank you for your message! I'll get back to you soon." 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please check your input and try again.",
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Something went wrong. Please try again later." 
        });
      }
    }
  });

  // Get contact messages (for admin purposes)
  app.get("/api/contact-messages", async (req, res) => {
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
