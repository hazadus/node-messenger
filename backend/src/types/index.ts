import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

export type GraphQLContext = {
  session: MySession | null;
  prisma: PrismaClient;
  // pubsub
};

export type CreateUsernameResponse = {
  success: boolean;
  error: string;
};

interface MySession {
  user?: User;
  expires: ISODateString;
}

interface User {
  id?: string;
  username?: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  image?: string | null;
}
