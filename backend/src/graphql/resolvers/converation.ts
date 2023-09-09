import type { GraphQLContext } from "../../types";

const resolvers = {
  Mutation: {
    createConversation: async (_: any, args: { participantIds: Array<string> }, context: GraphQLContext) => {
      console.log("💡 createConversation resolver | participantIds =", args.participantIds);
    },
  },
};

export default resolvers;
