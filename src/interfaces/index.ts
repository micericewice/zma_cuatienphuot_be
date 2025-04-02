import { Request } from "express";

export interface IProtectRequest extends Request {
  user: {
    zaloId: string;
    userId: string;
  };
}
