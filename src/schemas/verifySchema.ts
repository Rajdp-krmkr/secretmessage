import { z } from "zod";
export const verifyValidation = z
  .string()
  .length(6, "Verification code must be of 6 digits");

export const verifySchema = z.object({
  code: verifyValidation,
});
