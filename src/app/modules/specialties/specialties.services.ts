import { Request } from "express";
import { Specialties } from "../../../../generated/prisma/browser";
import { prisma } from "../../../../lib/prisma";
import { fileUploader } from "../../../helper/fileUploader";

const insertIntoDB = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesServices = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};
