import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentSchema, insertTemplateSchema } from "@shared/schema";
import OpenAI from "openai";
import { z } from "zod";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Content routes
  app.get("/api/content", async (req, res) => {
    const content = await storage.getAllContent();
    res.json(content);
  });

  app.get("/api/content/:id", async (req, res) => {
    const content = await storage.getContent(req.params.id);
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }
    res.json(content);
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validated = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validated);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  app.patch("/api/content/:id", async (req, res) => {
    try {
      const updateContentSchema = insertContentSchema.partial();
      const validated = updateContentSchema.parse(req.body);
      
      if (Object.keys(validated).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const updated = await storage.updateContent(req.params.id, validated);
      if (!updated) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    const deleted = await storage.deleteContent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Content not found" });
    }
    res.status(204).send();
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    const templates = await storage.getAllTemplates();
    res.json(templates);
  });

  app.get("/api/templates/:id", async (req, res) => {
    const template = await storage.getTemplate(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const validated = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validated);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.post("/api/templates/:id/use", async (req, res) => {
    const template = await storage.incrementTemplateUsage(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  });

  // AI content generation route
  app.post("/api/generate", async (req, res) => {
    if (!openai) {
      return res.status(503).json({ error: "OpenAI is not configured. Please add OPENAI_API_KEY." });
    }

    const { prompt, type } = req.body;
    
    if (!prompt || !type) {
      return res.status(400).json({ error: "Prompt and type are required" });
    }

    try {
      const systemPrompt = `You are a professional content creator specializing in hair, beauty, and barbering industry social media content. Create engaging, authentic, and trend-aware content that resonates with beauty professionals and their clients.`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message.content) {
        return res.status(500).json({ error: "No content generated" });
      }

      const generatedContent = completion.choices[0].message.content;
      
      res.json({ content: generatedContent });
    } catch (error) {
      console.error("OpenAI error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
