import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Mutation {
    """
    Create new conversation with passed user IDs as participants.
    """
    createConversation(participantIds: [String]): CreateConversationResponse
  }

  type CreateConversationResponse {
    conversationId: String
  }

  type Query {
    """
    Get all conversations of the signed in user.
    """
    conversations: [Conversation]
  }

  """
  Represents a chat in the app.
  """
  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type Subscription {
    """
    Fires off when a conversation is created.
    """
    conversationCreated: Conversation
  }
`;

export default typeDefs;
