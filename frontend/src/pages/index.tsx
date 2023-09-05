import Auth from "@/Components/Auth/Auth";
import Chat from "@/Components/Chat/Chat";
import { Box } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data } = useSession();

  return <Box>{data?.user ? <Chat /> : <Auth />}</Box>;
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
