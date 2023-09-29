import { gql } from "@apollo/client";

export const MessageFields = `
  id
  sender {
    id
    username
    image
  }
  body
  createdAt
`;

export default {
  Query: {
    messages: gql`
      query Messages($conversationId: String!) {
        messages(conversationId: $conversationId) {
          ${MessageFields}
        }
    }
    `,
  },
  Mutation: {
    sendMessage: gql`
      mutation SendMessage($id: String!, $conversationId: String!, $senderId: String!, $body: String!) {
        sendMessage(id: $id, conversationId: $conversationId, senderId: $senderId, body: $body)
      }
    `,
    deleteMessage: gql`
      mutation DeleteMessage($messageId: String!) {
        deleteMessage(messageId: $messageId)
      }
    `,
  },
  Subscription: {
    messageSent: gql`
      subscription MessageSent($conversationId: String!) {
        messageSent(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
    messageDeleted: gql`
      subscription MessageDeleted($conversationId: String!) {
        messageDeleted(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
  },
};
