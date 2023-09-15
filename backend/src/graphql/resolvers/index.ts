import merge from "lodash.merge";
import conversationResolvers from "./conversation";
import messageResolvers from "./message";
import scalarResolvers from "./scalars";
import userResolvers from "./user";

const resolvers = merge({}, userResolvers, conversationResolvers, messageResolvers, scalarResolvers);

export default resolvers;
