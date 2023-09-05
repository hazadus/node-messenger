import type { NextPage, NextPageContext } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data } = useSession();

  return (
    <div>
      {data?.user ? (
        <>
          <button onClick={() => signOut()}>Sign Out</button>
          {data?.user?.name}
        </>
      ) : (
        <>
          <button onClick={() => signIn("google")}>Sign In</button>
        </>
      )}
    </div>
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
