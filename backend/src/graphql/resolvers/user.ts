const userResolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: () => {
      console.log("💡 createUsername resolver called");
    },
  },
};

export default userResolvers;
