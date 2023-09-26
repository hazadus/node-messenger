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

/**
 * Send an event to my Umami stats app.
 * Umami code is included in `_app.tsx` inside `<Head>` component.
 * Reference: https://umami.is/docs/track-events
 *
 * @param event event name will be displayed on the dashboard
 * @param username username to log
 */
export const createUmamiEvent = (event: string, username: string) => {
  // @ts-ignore
  umami.track(event, { username: username });
};
