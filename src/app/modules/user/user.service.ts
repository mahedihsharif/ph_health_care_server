import bcrypt from "bcrypt";
import { Request } from "express";
import { Prisma } from "../../../../generated/prisma/browser";
import { UserRole } from "../../../../generated/prisma/enums";
import { prisma } from "../../../../lib/prisma";
import config from "../../../config";
import { fileUploader } from "../../../helper/fileUploader";
import { IOptions, paginationHelper } from "../../../helper/paginationHelper";
import { userSearchableFields } from "./user.constant";

const createPatient = async (req: Request) => {
  const file = req.file;
  const bodyData = req.body;
  if (file) {
    const uploadFile = await fileUploader.uploadToCloudinary(file);
    bodyData.patient.profilePhoto = uploadFile?.secure_url;
  }

  const saltRounds = Number(config.BCRYPT_SALT_ROUND) || 10;
  const hashedPassword = await bcrypt.hash(bodyData.password, saltRounds);

  const patient = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: bodyData.patient.email,
        password: hashedPassword,
      },
    });

    return await tnx.patient.create({
      data: bodyData.patient,
    });
  });
  return patient;
};

const createDoctor = async (req: Request) => {
  const file = req.file;
  const bodyData = req.body;
  if (file) {
    const uploadFile = await fileUploader.uploadToCloudinary(file);
    bodyData.doctor.profilePhoto = uploadFile?.secure_url;
  }

  const saltRounds = Number(config.BCRYPT_SALT_ROUND) || 10;
  const hashedPassword = await bcrypt.hash(bodyData.password, saltRounds);

  const userData = {
    email: bodyData.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const doctor = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    return await tnx.doctor.create({
      data: bodyData.doctor,
    });
  });
  return doctor;
};

const createAdmin = async (req: Request) => {
  const file = req.file;

  const bodyData = req.body;
  if (file) {
    const uploadFile = await fileUploader.uploadToCloudinary(file);

    bodyData.admin.profilePhoto = uploadFile?.secure_url;
  }

  const saltRounds = Number(config.BCRYPT_SALT_ROUND) || 10;
  const hashedPassword = await bcrypt.hash(bodyData.password, saltRounds);

  const userData = {
    email: bodyData.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const admin = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    return await tnx.admin.create({
      data: bodyData.admin,
    });
  });
  return admin;
};

const getAllUser = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((filed) => ({
        [filed]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const results = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: results,
  };
};

export const UserService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
};
