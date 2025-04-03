import { Request } from "express";
import { IUser } from "../models/User";

export interface IProtectRequest extends Request {
  user: IUser;
}
