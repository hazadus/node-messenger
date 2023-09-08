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

type FindConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FindConversationModal: React.FC<FindConversationModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button isDisabled={!username}>Search</Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FindConversationModal;
