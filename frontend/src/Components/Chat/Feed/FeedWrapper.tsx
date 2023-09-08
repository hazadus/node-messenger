import { Button } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";

type FeedWrapperProps = {
  session: Session;
};

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  return (
    <div>
      FeedWrapper | <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
};

export default FeedWrapper;
