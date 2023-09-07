const userResolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: (_: any, args: { username: string }, context: any) => {
      const { username } = args;
      console.log("💡 createUsername resolver | username =", username);
      console.log("   createUsername resolver | context  =", context);
    },
  },
};

export default userResolvers;
