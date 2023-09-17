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

  type Mutation {
    """
    Marks conversation as read by setting hasReadLatestMessage to true for the
    user in corresponding ConversationParticipant document.
    """
    markConversationAsRead(conversationId: String!, userId: String!): Boolean
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

  type Subscription {
    """
    Fires off when conversation gets updated: new message created, conversation marked as read, etc.
    """
    conversationUpdated: ConversationUpdatedSubscriptionPayload
  }

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }
`;

export default typeDefs;
