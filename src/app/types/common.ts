import { UserRole } from "../../../generated/prisma/enums";

export type IJwtPayload = {
  email: string;
  role: UserRole;
};
