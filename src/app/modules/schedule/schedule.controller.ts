import { Request, Response } from "express";
import pick from "../../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule create successfully!",
    data: result,
  });
});

const scheduleForDoctor = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);

  const result = await ScheduleService.scheduleForDoctor(options, filters);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Schedule create successfully!",
    data: result,
  });
});
export const ScheduleController = { insertIntoDB, scheduleForDoctor };
