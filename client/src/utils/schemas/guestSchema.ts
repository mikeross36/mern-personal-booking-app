import zod from "zod";

export const guestDataSchema = zod.object({
  checkIn: zod.date({
    required_error: "Check in is required",
    invalid_type_error: "Check in must be a date",
  }),
  checkOut: zod.date({
    required_error: "Check out is required",
    invalid_type_error: "Check out must be a date",
  }),
  adults: zod.coerce.number({
    required_error: "Adults data is required",
    invalid_type_error: "Adults must be a number",
  }),
  kids: zod.coerce.number({
    required_error: "Children data is required",
    invalid_type_error: "Children must be a number",
  }),
});
