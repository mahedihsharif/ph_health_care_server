import z from "zod";

export const createDoctorScheduleValidation = z.object({
  body: z.object({
    scheduleIds: z.array(z.string()),
  }),
});
