import { SearchUsersData, SearchUsersVariables } from "@/types";
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

type FindConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FindConversationModal: React.FC<FindConversationModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [searchUsers, { data, loading, error }] = useLazyQuery<SearchUsersData, SearchUsersVariables>(
    userOperations.Queries.searchUsers,
  );

  console.log("Data fetched:", data);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username: username } });
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
          <ModalHeader>Find Chat</ModalHeader>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FindConversationModal;
