import { type User, type InsertUser, type UpdateUserProfile, type Content, type InsertContent, type Template, type InsertTemplate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUserProfile): Promise<User | undefined>;
  
  getAllContent(): Promise<Content[]>;
  getContent(id: string): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: string, updates: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: string): Promise<boolean>;
  
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  incrementTemplateUsage(id: string): Promise<Template | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private content: Map<string, Content>;
  private templates: Map<string, Template>;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.templates = new Map();
    this.seedTemplates();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      name: null,
      email: null,
      profilePicture: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: UpdateUserProfile): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getContent(id: string): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = randomUUID();
    const content: Content = { 
      ...insertContent, 
      favorited: insertContent.favorited ?? false,
      id, 
      createdAt: new Date() 
    };
    this.content.set(id, content);
    return content;
  }

  async updateContent(id: string, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const existing = this.content.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.content.set(id, updated);
    return updated;
  }

  async deleteContent(id: string): Promise<boolean> {
    return this.content.delete(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).sort((a, b) => b.usageCount - a.usageCount);
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = { 
      ...insertTemplate,
      usageCount: insertTemplate.usageCount ?? 0,
      id 
    };
    this.templates.set(id, template);
    return template;
  }

  async incrementTemplateUsage(id: string): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;
    
    const updated = { ...template, usageCount: template.usageCount + 1 };
    this.templates.set(id, updated);
    return updated;
  }

  private seedTemplates() {
    const defaultTemplates: InsertTemplate[] = [
      {
        name: "Hair Transformation Reveal",
        type: "instagram",
        description: "Showcase dramatic before/after hair transformations",
        promptTemplate: "Create an engaging Instagram caption for a hair transformation from {beforeStyle} to {afterStyle}. Include trending hashtags and a call-to-action.",
        category: "Transformation",
        usageCount: 0
      },
      {
        name: "Product Spotlight",
        type: "instagram",
        description: "Highlight your favorite beauty products",
        promptTemplate: "Write an Instagram post featuring {productName} and its benefits for hair care. Make it engaging and authentic.",
        category: "Product",
        usageCount: 0
      },
      {
        name: "Tutorial Script",
        type: "tiktok",
        description: "Step-by-step beauty tutorial scripts",
        promptTemplate: "Create a TikTok script for a {tutorialType} tutorial. Include hook, steps, and trending sound suggestions.",
        category: "Tutorial",
        usageCount: 0
      },
      {
        name: "Behind The Scenes",
        type: "reels",
        description: "Show your creative process",
        promptTemplate: "Write a Reels caption showing the behind-the-scenes of {serviceType}. Make it relatable and fun.",
        category: "Lifestyle",
        usageCount: 0
      },
      {
        name: "Client Testimonial",
        type: "instagram",
        description: "Share client success stories",
        promptTemplate: "Create a heartfelt Instagram post featuring a client testimonial about {serviceType}. Include emotional connection and results.",
        category: "Social Proof",
        usageCount: 0
      },
      {
        name: "Trend Alert",
        type: "instagram",
        description: "Highlight the latest beauty trends",
        promptTemplate: "Write an Instagram post about the trending {trendName} in hair and beauty. Explain why clients should try it.",
        category: "Trends",
        usageCount: 0
      }
    ];

    defaultTemplates.forEach(template => {
      const id = randomUUID();
      this.templates.set(id, { ...template, usageCount: 0, id });
    });
  }
}

export const storage = new MemStorage();
