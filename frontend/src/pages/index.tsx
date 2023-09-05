import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

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

export default Home;
