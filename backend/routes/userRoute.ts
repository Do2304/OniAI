import express, { Router } from "express";
import { getUsers } from "../controller/userController";

const router = express.Router();

router.get("/", getUsers);

export const UserRoutes: Router = router;