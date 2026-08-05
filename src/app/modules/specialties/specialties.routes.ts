import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";

import { UserRole } from "../../../../generated/prisma/enums";
import { fileUploader } from "../../../helper/fileUploader";
import auth from "../../middlewares/auth";
import { SpecialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data));
    return SpecialtiesController.insertIntoDB(req, res, next);
  },
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteFromDB,
);

export const SpecialtiesRoutes = router;
