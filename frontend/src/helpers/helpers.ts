import { ParticipantPopulated } from "../../../backend/src/types";

/**
 * Formats array of conversation participants as string with comma-separated list of
 * conversation participants, excluding signed in user
 *
 * @param participants array of conversation participants
 * @param singedInUserId user with this id will be excluded from the list
 * @returns comma-separated list of conversation participants, excluding signed in user
 */
export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  singedInUserId: string,
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id !== singedInUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
};
