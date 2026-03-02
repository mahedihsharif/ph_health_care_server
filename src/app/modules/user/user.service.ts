import bcrypt from "bcrypt";
import { Request } from "express";
import { prisma } from "../../../../lib/prisma";
import config from "../../../config";
import { fileUploader } from "../../../helper/fileUploader";

export const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadFile = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadFile?.secure_url;
  }

  const saltRounds = Number(config.BCRYPT_SALT_ROUND) || 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const user = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });
  return user;
};

export const UserService = { createPatient };
