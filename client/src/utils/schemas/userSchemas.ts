import zod from "zod";

export const updateAccountSchema = zod.object({
  userName: zod.string().min(3, { message: "User name is required" }),
  email: zod.string().email("Email is not valid"),
});
