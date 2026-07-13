import { Request, Response } from "express";
import pick from "../../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../types/common";
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

const scheduleForDoctor = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);
    const user = req.user;

    const result = await ScheduleService.scheduleForDoctor(
      user as IJwtPayload,
      options,
      filters,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  },
);

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteScheduleFromDB(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Delete Schedule successfully!",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  scheduleForDoctor,
  deleteScheduleFromDB,
};
