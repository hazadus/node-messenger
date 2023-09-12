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
    """
    Search user by part of his username.
    """
    searchUsers(username: String): [SearchedUser]
  }

  """
  User info returned by searchUsers
  """
  type SearchedUser {
    id: String
    """
    Username chosen by user in our app.
    """
    username: String
    """
    Image URL from user's Google account.
    """
    image: String
  }

  type Mutation {
    """
    Set username for currently signed in user.
    """
    createUsername(username: String): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
