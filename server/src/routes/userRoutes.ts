import express, { RequestHandler } from "express";
import { tokenProtect } from "../middlewares/tokenProtect";
import { requireUser } from "../middlewares/requireUser";
import {
  getUserInfoHandler,
  updateUserAccountHandler,
} from "../controllers/userController";
import { body } from "express-validator";

const router = express.Router();

router.use(tokenProtect as RequestHandler, requireUser as RequestHandler);

router.get("/user-info", getUserInfoHandler as RequestHandler);

router.patch(
  "/update-user-account",
  [
    body("userName").notEmpty().withMessage("User name is required"),
    body("email").notEmpty().withMessage("Email is required"),
  ],
  updateUserAccountHandler as RequestHandler
);

export default router;
