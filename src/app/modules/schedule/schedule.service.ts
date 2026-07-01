import { addHours, addMinutes, format } from "date-fns";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { IOptions, paginationHelper } from "../../../helper/paginationHelper";

const insertIntoDB = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;
  const intervalTime = 30;
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0]),
        ),
        Number(startTime.split(":")[1]),
      ),
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0]),
        ),
        Number(endTime.split(":")[1]),
      ),
    );

    while (startDateTime < endDateTime) {
      const slotStartDateTime = startDateTime; //10:00
      const slotEndDateTime = addMinutes(startDateTime, intervalTime); //10:30

      const scheduleData = {
        startDateTime: slotStartDateTime,
        endDateTime: slotEndDateTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }
      slotStartDateTime.setMinutes(
        slotStartDateTime.getMinutes() + intervalTime,
      );
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const scheduleForDoctor = async (options: IOptions, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } =
    filters;
  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (filterStartDateTime && filterEndDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: filterStartDateTime,
          },
          endDateTime: {
            lte: filterEndDateTime,
          },
        },
      ],
    });
  }

  const whereCondition: Prisma.ScheduleWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const results = await prisma.schedule.findMany({
    skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.schedule.count({
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

const deleteScheduleFromDB = async (id: string) => {
  return await prisma.schedule.delete({
    where: { id },
  });
};

export const ScheduleService = {
  insertIntoDB,
  scheduleForDoctor,
  deleteScheduleFromDB,
};
