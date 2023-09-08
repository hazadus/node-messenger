/**
 * Naming convention:
 *
 * QueryName... - query name is equal to capitalized names defined in `graphql/operations/*.ts`
 * QueryNameVariables - data we pass to query;
 * QueryNameData - data we get from query.
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

type SearchedUser = {
  // Files selected to get from backend are at `operations/users.ts`, `Queries.searchUsers()`:
  id: string;
  username: string;
};
