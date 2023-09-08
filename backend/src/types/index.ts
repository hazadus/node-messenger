import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

export type GraphQLContext = {
  session: CustomSession | null;
  prisma: PrismaClient;
  // pubsub
};

export type CreateUsernameResponse = {
  success: boolean;
  error: string;
};

interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}

export interface CustomUser {
  id?: string;
  username?: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  image?: string | null;
}
