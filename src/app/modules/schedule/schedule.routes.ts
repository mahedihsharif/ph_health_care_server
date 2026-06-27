import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/create", ScheduleController.insertIntoDB);

export const ScheduleRoutes = router;
