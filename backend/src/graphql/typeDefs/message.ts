import { gql } from "graphql-tag";

const typeDefs = gql`
  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }

  type Query {
    """
    Return all messages from the conversation.
    """
    messages(
      """
      Conversation from which to get messages
      """
      conversationId: String
    ): [Message]
  }

  type Mutation {
    """
    Creates new message document in the database. Updates the conversation document.
    Notifies clients.
    """
    sendMessage(id: String, conversationId: String, senderId: String, body: String): Boolean
  }

  type Mutation {
    """
    Delete message document from the database. Update conversation, if it was the
    latest message in the conversation. Notify clients.
    """
    deleteMessage(messageId: String!): Boolean
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

  type Subscription {
    """
    Sent when a message was deleted.
    """
    messageDeleted(
      """
      conversationId (from where the message is) let us know to which conversation's
      participants we want to emit this event.
      """
      conversationId: String
    ): Message
  }
`;

export default typeDefs;
