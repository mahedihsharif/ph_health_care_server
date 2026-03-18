import { Request, Response } from "express";
import { paginationFields } from "../../../constant/pagination.constant";
import pick from "../../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import { UserService } from "./user.service";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: patient,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await UserService.createDoctor(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully!",
    data: doctor,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin = await UserService.createAdmin(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully!",
    data: admin,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationFields);

  const results = await UserService.getAllUser(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All user retrieved successfully!",
    meta: results.meta,
    data: results.data,
  });
});

export const UserController = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
};
