import Auth from "@/Components/Auth/Auth";
import Chat from "@/Components/Chat/Chat";
import { Box } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  /**
   * This will cause NextAuth to reload session and trigger `session()` callback
   * in `[...nextauth].ts`. It is needed to reload user data from the database.
   * `useSession()` will refresh `session`, and then user will see the Chat component.
   */
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {session?.user?.username ? (
        <Chat session={session} />
      ) : (
        <Auth
          session={session}
          reloadSession={reloadSession}
        />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  // `getSession()` is used on the server side.
  // This allow us to server side render page using actual session state (user logged in or logged out).
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
