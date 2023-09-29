import MessageOperations from "@/graphql/operations/message";
import { useMutation } from "@apollo/client";
import { Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { BsPin, BsReply } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdOutlineContentCopy } from "react-icons/md";
import { TiArrowForwardOutline } from "react-icons/ti";
import { MessagePopulated } from "../../../../../../backend/src/types";
import { createUmamiEvent } from "@/helpers/helpers";

type MessageItemMenuProps = {
  message: MessagePopulated;
  isSentBySignedInUser: boolean;
};

const MessageItemMenu: React.FC<MessageItemMenuProps> = ({ message, isSentBySignedInUser }) => {
  const [deleteMessage] = useMutation<{ deleteMessage: boolean }, { messageId: string }>(
    MessageOperations.Mutation.deleteMessage,
  );

  const onDeleteMessage = async () => {
    createUmamiEvent("Delete message", message.sender.username || "");

    try {
      await deleteMessage({
        variables: {
          messageId: message.id,
        },
        update: () => {
          toast.success("Message deleted.");
        },
      });
    } catch (error: any) {
      console.log("onDeleteMessage error:", error);
      toast.error(`Failed to delete message! ${error}`);
    }
  };

  return (
    <Menu isLazy>
      <MenuButton
        cursor="pointer"
        px={1}
        py={0}
        borderRadius={4}
        _hover={{ bg: "whiteAlpha.300" }}
      >
        <Icon
          as={BiChevronDown}
          fontSize={16}
          color="whiteAlpha.700"
        />
      </MenuButton>
      <MenuList bg="#2D2D2D">
        <MenuItem
          icon={<BsReply fontSize={18} />}
          bg="#2D2D2D"
          _hover={{ bg: "WhiteAlpha.300" }}
          isDisabled
        >
          Reply
        </MenuItem>
        <MenuItem
          icon={<FiEdit fontSize={18} />}
          bg="#2D2D2D"
          _hover={{ bg: "WhiteAlpha.300" }}
          isDisabled
        >
          Edit
        </MenuItem>
        <MenuItem
          icon={<MdOutlineContentCopy fontSize={18} />}
          bg="#2D2D2D"
          _hover={{ bg: "WhiteAlpha.300" }}
          isDisabled
        >
          Copy Text
        </MenuItem>
        <MenuItem
          icon={<BsPin fontSize={18} />}
          bg="#2D2D2D"
          _hover={{ bg: "WhiteAlpha.300" }}
          isDisabled
        >
          Pin
        </MenuItem>
        <MenuItem
          icon={<TiArrowForwardOutline fontSize={18} />}
          bg="#2D2D2D"
          _hover={{ bg: "WhiteAlpha.300" }}
          isDisabled
        >
          Forward
        </MenuItem>
        <MenuItem
          icon={<AiOutlineDelete fontSize={19} />}
          bg="#2D2D2D"
          color="red.500"
          _hover={{ bg: "whiteAlpha.300" }}
          onClick={onDeleteMessage}
          isDisabled={!isSentBySignedInUser}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MessageItemMenu;
