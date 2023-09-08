import { SearchUsersData, SearchUsersVariables, SearchedUser } from "@/types";
import { useLazyQuery } from "@apollo/client";
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
import React, { useState } from "react";
import userOperations from "../../../../graphql/operations/user";
import SearchResultsList from "./SearchResultsList";
import Participants from "./Participants";

type FindConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FindConversationModal: React.FC<FindConversationModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<SearchUsersData, SearchUsersVariables>(
    userOperations.Queries.searchUsers,
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username: username } });
  };

  const addParticipant = (user: SearchedUser) => {
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
          <ModalHeader>Create new Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSubmit}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username to find"
                  value={username}
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
              users={data?.searchUsers}
              addParticipant={addParticipant}
              removeParticipant={removeParticipant}
            />
            <Participants
              participants={participants}
              removeParticipant={removeParticipant}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FindConversationModal;
