import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

type FindConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FindConversationModal: React.FC<FindConversationModalProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Modal Body</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FindConversationModal;
