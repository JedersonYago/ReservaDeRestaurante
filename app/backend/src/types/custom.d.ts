import { Request as ExpressRequest } from "express";
import { IUser } from "../models/User";

export interface Request extends ExpressRequest {
  user?: IUser;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
