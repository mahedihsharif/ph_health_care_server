import z from "zod";

const createPatientValidationSchema = z.object({
  password: z.string(),
  patient: z.object({
    name: z.string().nonempty("Name is Required!"),
    email: z.string().nonempty("Email is Required!"),
    address: z.string().optional(),
  }),
});

const createDoctorValidationSchema = z.object({
  password: z.string(),
  doctor: z.object({
    name: z.string().nonempty("Name is Required!"),
    email: z.string().nonempty("Email is Required!"),
    address: z.string().optional(),
  }),
});

const createAdminValidationSchema = z.object({
  password: z.string(),
  admin: z.object({
    name: z.string().nonempty("Name is Required!"),
    email: z.string().nonempty("Email is Required!"),
    address: z.string().optional(),
  }),
});

export const UserValidation = {
  createPatientValidationSchema,
  createDoctorValidationSchema,
  createAdminValidationSchema,
};
