import { Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { BsReply, BsPin } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { TiArrowForwardOutline } from "react-icons/ti";
import { MessagePopulated } from "../../../../../../backend/src/types";

type MessageItemMenuProps = {
  message: MessagePopulated;
  isSentBySignedInUser: boolean;
};

const MessageItemMenu: React.FC<MessageItemMenuProps> = ({ message, isSentBySignedInUser }) => {
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
          onClick={() => {}}
          isDisabled={!isSentBySignedInUser}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MessageItemMenu;
