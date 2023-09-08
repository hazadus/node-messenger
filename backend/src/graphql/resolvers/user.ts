import { CreateUsernameResponse, GraphQLContext } from "../../types";

const userResolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    /**
     * Set `username` field for currently authenticated user - create new or update existing.
     * Do not allow to use usernames that already taken.
     * @param args
     * @param context
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
