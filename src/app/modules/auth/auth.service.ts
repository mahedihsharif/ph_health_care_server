import bcrypt from "bcrypt";
import { UserStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../../lib/prisma";
import config from "../../../config";
import { jwtHelper } from "../../../helper/jwtHelper";

export const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isCorrectPassword) {
    throw new Error("Password doesn't matched!");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_EXPIRES as string,
  );
  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.JWT.JWT_REFRESH_SECRET as string,
    config.JWT.JWT_REFRESH_EXPIRES as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = { login };
