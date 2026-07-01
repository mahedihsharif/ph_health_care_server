import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/create", ScheduleController.insertIntoDB);
router.get("/", ScheduleController.scheduleForDoctor);

export const ScheduleRoutes = router;
