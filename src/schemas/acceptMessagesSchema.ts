import {z} from 'zod';

const acceptMessagesValidation = z.boolean();

export const acceptMessagesSchema = z.object({
  acceptMessages: acceptMessagesValidation,
});