import {z} from 'zod';

const messageValidation = z.string().max(300,{message: "Message must be at most 300 characters long"});

export const messageSchema = z.object({
  message: messageValidation,
});