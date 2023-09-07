import { CreateUsernameResponse, GraphQLContext } from "../../types";

const userResolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
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
          return {
            success: false,
            error: "Username already taken.",
          };
        }

        /**
         * Update user.
         */
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username: username,
          },
        });

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

      return {
        success: true,
        error: "",
      };
    },
  },
};

export default userResolvers;
