import {Router} from "express";
import { registerUser, loginHandler, verifyEmail } from "../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginHandler);
authRouter.get("/verify-email/:token", verifyEmail);

export default authRouter;
