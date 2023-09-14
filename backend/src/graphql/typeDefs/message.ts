import { gql } from "graphql-tag";

const typeDefs = gql`
  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }

  type Mutation {
    """
    Creates new message document in the database. Updates the conversation document.
    Notifies clients.
    """
    sendMessage(id: String, conversationId: String, senderId: String, body: String): Boolean
  }

  type Subscription {
    """
    Sent every time new message created.
    """
    messageSent(
      """
      conversationId let us know to which conversation's participants we want
      to emit this event
      """
      conversationId: String
    ): Message
  }
`;

export default typeDefs;
