import { z } from "zod";

const identifierValidation = z.string();
const passwordValidation = z.string();

export const signInSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
});
