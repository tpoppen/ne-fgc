import type { Express, Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      permissions: string[];
    }
  }
}
