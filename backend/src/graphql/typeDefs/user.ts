import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    id: String
    name: String
    username: String
    email: String
    emailVerified: Boolean
    image: String
  }

  type Query {
    searchUsers(username: String): [SearchedUser]
  }

  type SearchedUser {
    id: String
    username: String
    image: String
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
