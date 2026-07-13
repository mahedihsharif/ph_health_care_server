import express from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/create", ScheduleController.insertIntoDB);
router.get(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  ScheduleController.scheduleForDoctor,
);
router.delete("/:id", ScheduleController.deleteScheduleFromDB);

export const ScheduleRoutes = router;
