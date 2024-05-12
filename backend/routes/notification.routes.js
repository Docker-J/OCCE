import express from "express";

import { registerController } from "../controller/notification.controller.js";

const router = express.Router();

router.put("/register", registerController);

export default router;
