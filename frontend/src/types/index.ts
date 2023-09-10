import { ConversationPopulated } from "../../../backend/src/types";

/**
 * Naming convention:
 *
 * QueryName... - query name is equal to capitalized names defined in `graphql/operations/*.ts`
 * QueryNameVariables - data we pass to query;
 * QueryNameData - data we get from query.
 */

/**
 * USERS
 */
export type CreateUsernameVariables = {
  username: string;
};

export type CreateUsernameData = {
  createUsername: {
    success: boolean;
    error: string;
  };
};

export type SearchUsersVariables = {
  username: string;
};

export type SearchUsersData = {
  searchUsers: Array<SearchedUser>;
};

/**
 * This type represents data returned by `searchUsers` resolver on the backend.
 */
export type SearchedUser = {
  // Fields selected to get from backend are at `operations/users.ts`, `Queries.searchUsers()`:
  id: string;
  username: string;
  image: string;
};

/**
 * CONVERSATIONS
 */
export type CreateConversationVariables = {
  participantIds: Array<string>;
};

export type CreateConversationData = {
  createConversation: {
    conversationId: string;
  };
};

export type ConversationsData = {
  conversations: Array<ConversationPopulated>;
};
