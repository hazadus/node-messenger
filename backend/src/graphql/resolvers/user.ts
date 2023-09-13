import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { CreateUsernameResponse, GraphQLContext } from "../../types";

const userResolvers = {
  Query: {
    /**
     * Find a user in the database by username, excluding signed in user
     * from search results.
     */
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext,
    ): Promise<Array<User>> => {
      const { username: usernameToFind } = args;
      const { session, prisma } = context;

      console.log("💡 searchUsers resolver | usernameToFind =", usernameToFind);

      if (!session?.user) {
        throw new GraphQLError("User no authorized.");
      }

      const {
        user: { username: signedInUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: usernameToFind,
              not: signedInUsername,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error: any) {
        console.log("❌ searchUsers error:", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    /**
     * Set `username` field for currently authenticated user - create new or update existing.
     * Do not allow to use usernames that already taken.
     *
     * @returns operation result: { success: boolean, error: string }
     */
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext,
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;

      console.log("💡 createUsername resolver | username =", username);
      console.log("   createUsername resolver | session  =", session);

      if (!session?.user) {
        console.log("❌ createUsername: User is not authenticated.");
        return {
          success: false,
          error: "Not authenticated.",
        };
      }

      const { id: userId } = session.user;

      try {
        /**
         * Check that username is not already taken.
         */
        const existingUser = await prisma.user.findUnique({ where: { username: username } });

        if (existingUser) {
          console.log("❌ createUsername: Username is already taken.");
          return {
            success: false,
            error: "Username is already taken. Try another!",
          };
        }

        /**
         * Update user document in the database.
         */
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username: username,
          },
        });

        console.log(`✅ createUsername: Username "${username}" successfully set for user ${userId}.`);
        return {
          success: true,
          error: "",
        };
      } catch (error: any) {
        console.log("❌ createUsername error:", error);
        return {
          success: false,
          error: error.message,
        };
      }
    },
  },
};

export default userResolvers;
