import merge from "lodash.merge";
import conversationResolvers from "./converation";
import userResolvers from "./user";

const resolvers = merge({}, userResolvers, conversationResolvers);

export default resolvers;
