import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../errors/AppError";
import handleJsonWebTokenError from "../errors/handleJsonWebTokenError";
import handleTokenExpiredError from "../errors/handleTokenExpireError";
import handleZodError from "../errors/handleZodError";
import { TErrorSource } from "../interface/error.types";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;
  let errorSources: TErrorSource[] = [];
  let type;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Unique constraint failed";
      error = err.meta;
      statusCode = httpStatus.CONFLICT;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    statusCode = httpStatus.BAD_REQUEST;
  }

  //Zod Validation Error
  else if (err.name === "ZodError") {
    const simpliFiedError = handleZodError(err);
    statusCode = simpliFiedError.statusCode;
    message = simpliFiedError.message;
    errorSources = simpliFiedError.errorSources as TErrorSource[];
  }

  //jsonwebtoken error
  else if (err.name === "JsonWebTokenError") {
    const simpliFiedError = handleJsonWebTokenError();
    statusCode = simpliFiedError.statusCode;
    message = simpliFiedError.message;
  }
  //token expires error
  else if (err.name === "TokenExpiredError") {
    const simpliFiedError = handleTokenExpiredError();
    statusCode = simpliFiedError.statusCode;
    message = simpliFiedError.message;
  }

  //custom app error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    type = err.type || null;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
