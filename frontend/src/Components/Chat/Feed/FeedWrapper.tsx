import { Session } from "next-auth";
import React from "react";

type FeedWrapperProps = {
  session: Session;
};

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  return <div>FeedWrapper</div>;
};

export default FeedWrapper;
