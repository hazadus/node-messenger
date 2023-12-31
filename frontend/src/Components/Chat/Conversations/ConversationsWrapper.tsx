import SkeletonLoader from "@/Components/SkeletonLoader";
import ConversationOperations from "@/graphql/operations/conversation";
import { ConversationDeletedData, ConversationUpdatedData, ConversationsData } from "@/types";
import { getIsSoundEnabled } from "@/utils/utils";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsFilterCircleFill, BsSearch } from "react-icons/bs";
import { LuDelete, LuListFilter } from "react-icons/lu";
// @ts-ignore
import useSound from "use-sound";
import { ConversationPopulated } from "../../../../../backend/src/types";
import { createUmamiEvent } from "../../../helpers/helpers";
import ConversationsList from "./ConversationsList";
import ConversationsNavbar from "./ConversationsNavbar";

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);
  const router = useRouter();
  const { conversationId: selectedConversationId } = router.query;
  const signedInUserId = session.user.id;

  const [searchText, setSearchText] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { conversationId: string; userId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  const [playNotificationSound] = useSound("/sounds/come-here-notification.mp3");

  /**
   * Subscribe to conversation updates.
   */
  useSubscription<ConversationUpdatedData>(ConversationOperations.Subscriptions.conversationUpdated, {
    /**
     * Called when new subscription data is received.
     */
    onData: async ({ client, data }) => {
      const { data: subscriptionData } = data;

      if (!subscriptionData) {
        return;
      }

      /**
       * If we received update on conversation which is currently open,
       * mark it as read (if it is not already).
       */
      const updatedConversationId = subscriptionData.conversationUpdated.conversation.id;
      const isMarkedAsRead = subscriptionData.conversationUpdated.conversation.participants.find(
        (p) => p.user.id === signedInUserId,
      )?.hasSeenLatestMessage;

      if (updatedConversationId === selectedConversationId) {
        if (!isMarkedAsRead) {
          try {
            await markConversationAsRead({
              variables: {
                userId: signedInUserId,
                conversationId: updatedConversationId,
              },
            });
          } catch (error: any) {
            console.log("useSubscription / onData error:", error);
            toast.error(error?.message);
          }
        }
      }

      /**
       * Play notification sound.
       *
       * Check if there's actually new message in the conversation
       * (latest message is not read). Because we do not want to play sounds
       * when, for example, conversation was just marked as read.
       */
      if (getIsSoundEnabled() && !isMarkedAsRead) playNotificationSound();
    },
  });

  /**
   * Subscribe to conversation deletions.
   */
  useSubscription<ConversationDeletedData>(ConversationOperations.Subscriptions.conversationDeleted, {
    onData: ({ client, data }) => {
      const { data: subscriptionData } = data;

      if (!subscriptionData) {
        return;
      }

      /**
       * Grab existing conversations from the Apollo cache
       */
      const existingConversationsData = client.readQuery<ConversationsData>({
        query: ConversationOperations.Queries.conversations,
      });

      if (!existingConversationsData) {
        return;
      }

      const { conversations: existingConversations } = existingConversationsData;
      const deletedConversationId = subscriptionData.conversationDeleted.deletedConversation.id;

      /**
       * Update cache removing deleted conversation.
       */
      client.writeQuery<ConversationsData>({
        query: ConversationOperations.Queries.conversations,
        data: {
          conversations: existingConversations.filter(
            (conversation) => conversation.id !== deletedConversationId,
          ),
        },
      });

      /**
       * Push user away from the deleted conversation
       */
      if (deletedConversationId === selectedConversationId) {
        router.push("/");
      }
    },
  });

  /**
   * Called when user selects a conversation in the list: push user to this conversation
   * and mark it as read, if needed.
   * @param conversationId selected conversation's id
   */
  const onViewConversation = async (conversationId: string, hasSeenLatestMessage: boolean) => {
    /**
     * Push user to conversation with `conversationId`
     */
    router.push({ query: { conversationId } });

    /**
     * Mark the conversation as read
     */
    if (hasSeenLatestMessage) {
      return;
    }

    try {
      await markConversationAsRead({
        variables: {
          userId: signedInUserId,
          conversationId,
        },
      });
    } catch (error: any) {
      console.log("onViewConversation error:", error);
      toast.error(error?.message);
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        // Inline typecast `subscriptionData`:
        { subscriptionData }: { subscriptionData: { data: { conversationCreated: ConversationPopulated } } },
      ) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          // Update `conversationsData` with newly created conversation:
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  /**
   * Subscribe to updates on mount.
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Flex
      display={{ base: selectedConversationId ? "none" : "block", lg: "block" }}
      direction="column"
      width={{ base: "100%", lg: "410px" }}
      minWidth={{ base: "100%", lg: "410px" }}
      height="100vh"
      overflow="hidden"
      bg="whiteAlpha.50"
    >
      {/* Navbar */}
      <ConversationsNavbar session={session} />

      {/* Search & filter */}
      <Flex
        width="100%"
        p={1}
      >
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.600"
          >
            <BsSearch />
          </InputLeftElement>
          <Input
            mr={1}
            placeholder="Search chats..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          {searchText.length > 0 && (
            <InputRightElement
              p={0}
              cursor="pointer"
              onClick={() => setSearchText("")}
            >
              <LuDelete size={20} />
            </InputRightElement>
          )}
        </InputGroup>
        <Tooltip
          label="Filter unread"
          fontSize="10px"
          hasArrow
        >
          <Button
            bg="none"
            p={0}
            onClick={() => {
              setShowUnreadOnly(!showUnreadOnly);
              createUmamiEvent("Show unread chats only toggled", session.user.username);
            }}
          >
            {showUnreadOnly ? <BsFilterCircleFill size={20} /> : <LuListFilter size={20} />}
          </Button>
        </Tooltip>
      </Flex>

      {/* List */}
      {conversationsLoading ? (
        <SkeletonLoader
          count={3}
          width="100%"
          height="80px"
        />
      ) : (
        <ConversationsList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
          searchText={searchText}
          showUnreadOnly={showUnreadOnly}
        />
      )}
    </Flex>
  );
};

export default ConversationsWrapper;
