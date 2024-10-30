import zod from "zod";

export const registerSchema = zod
  .object({
    userName: zod.string().min(3, { message: "User name is required" }),
    email: zod.string().email("Email is not valid"),
    password: zod
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 chars long"),
    confirmPassword: zod.string({
      required_error: "Password confirmation is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = zod.object({
  email: zod.string().email("Email is not valid"),
  password: zod
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 chars long"),
});

export const forgotSchema = zod.object({
  email: zod.string().email("Email is not valid"),
});

export const resetSchema = zod
  .object({
    resetString: zod.string({ required_error: "Reset string is required" }),
    password: zod
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 chars long"),
    confirmPassword: zod.string({
      required_error: "Password confirmation is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updatePasswordSchema = zod
  .object({
    currentPassword: zod
      .string({ required_error: "Current password is required" })
      .min(8, "Password must be at least 8 chars long"),
    password: zod
      .string({ required_error: "Password is required" })
      .min(8, "Password be at least 8 chars long"),
    confirmPassword: zod.string().min(8, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
