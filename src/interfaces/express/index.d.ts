import { User } from "../user.interface.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace 'User' with your actual user type/interface
    }
  }
}