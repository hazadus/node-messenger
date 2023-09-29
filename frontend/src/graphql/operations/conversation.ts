import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
  id
  participants {
    user {
      id
      username
      image
    }
    hasSeenLatestMessage
  }
  latestMessage {
    ${MessageFields}
  }
  createdByUser {
    id
    username
    image
  }
  updatedAt
`;

const ConversationOperations = {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations {
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
    deleteConversation: gql`
      mutation DeleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
    markConversationAsRead: gql`
      mutation MarkConversationAsRead($conversationId: String!, $userId: String!) {
        markConversationAsRead(conversationId: $conversationId, userId: $userId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversation {
            ${ConversationFields}
          }
        }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          deletedConversation {
            ${ConversationFields}
          }
        }
      }
    `,
  },
};

export default ConversationOperations;
