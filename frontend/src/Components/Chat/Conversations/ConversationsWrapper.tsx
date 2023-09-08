import { Session } from "next-auth";
import React from "react";

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
  return <div>ConversationsWrapper</div>;
};

export default ConversationsWrapper;
