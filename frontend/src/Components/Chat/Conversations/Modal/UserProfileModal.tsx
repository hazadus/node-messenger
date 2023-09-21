import {
  Avatar,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";

type UserProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, session }) => {
  const user = session.user;

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
          <ModalHeader>Your Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack align="center">
              <Avatar
                src={user.image || ""}
                size="2xl"
              />
              <Text fontSize="3xl">{session.user.username}</Text>
              <Text color="whiteAlpha.600">{user.name}</Text>
              <Text color="whiteAlpha.600">{user.email}</Text>
              <Text
                fontSize="sm"
                color="whiteAlpha.500"
              >
                {session.user.id}
              </Text>
              <Divider mt={4} />
              <Text
                fontSize="sm"
                color="whiteAlpha.500"
              >
                Note: other users can only see your username and avatar.
              </Text>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserProfileModal;
