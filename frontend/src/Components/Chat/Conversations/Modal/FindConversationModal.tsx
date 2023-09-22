import {
  CreateConversationData,
  CreateConversationVariables,
  SearchUsersData,
  SearchUsersVariables,
  SearchedUser,
} from "@/types";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConversationOperations from "../../../../graphql/operations/conversation";
import UserOperations from "../../../../graphql/operations/user";
import Participants from "./Participants";
import SearchResultsList from "./SearchResultsList";

type FindConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
};

const FindConversationModal: React.FC<FindConversationModalProps> = ({ isOpen, onClose, session }) => {
  const {
    user: { id: signedInUserId },
  } = session;
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data: foundUsersData, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariables
  >(UserOperations.Queries.searchUsers);
  const [createConversation, { loading: createConversationLoading }] = useMutation<
    CreateConversationData,
    CreateConversationVariables
  >(ConversationOperations.Mutations.createConversation);
  const router = useRouter();

  const onSubmitSearchUser = (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username: username } });
  };

  /**
   * Create conversation (chat) on the backend using GraphQL API.
   */
  const onCreateConversation = async () => {
    try {
      // Add selected users and signed in user's IDs
      const participantIds = [...participants.map((item) => item.id), signedInUserId];
      const { data } = await createConversation({
        variables: { participantIds: participantIds },
      });

      if (!data?.createConversation) {
        throw new Error("Failed to create conversation – no data was received from backend.");
      }

      const {
        createConversation: { conversationId },
      } = data;

      /**
       * On success, push user to the newly created conversation,
       * reset modal state and close it.
       */
      router.push({ query: { conversationId } });
      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error: any) {
      console.log("onCreateConversation error:", error);
      toast.error(error?.message);
    }
  };

  const addParticipant = (user: SearchedUser) => {
    // Prevent user duplication in the list
    if (!participants.find((item) => item.id === user.id)) setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (user: SearchedUser) => {
    setParticipants((prev) => prev.filter((item) => item.id !== user.id));
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          bg="#2D2D2D"
          pb={4}
        >
          <ModalHeader>Create New Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSubmitSearchUser}>
              <Stack spacing={4}>
                <Input
                  value={username}
                  placeholder="Enter a username to find"
                  isDisabled={loading}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button
                  isDisabled={!username}
                  isLoading={loading}
                  type="submit"
                >
                  Search
                </Button>
              </Stack>
            </form>
            <SearchResultsList
              users={foundUsersData?.searchUsers}
              addParticipant={addParticipant}
              removeParticipant={removeParticipant}
            />
            <Participants
              participants={participants}
              removeParticipant={removeParticipant}
            />
            <Button
              bg="brand.100"
              width="100%"
              mt={4}
              isLoading={createConversationLoading}
              isDisabled={!participants.length}
              _hover={{ bg: "brand.100" }}
              onClick={onCreateConversation}
            >
              Create Chat
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FindConversationModal;
