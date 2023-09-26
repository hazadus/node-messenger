import { Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsVertical } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { IoExitOutline } from "react-icons/io5";
import { BiChevronDown } from "react-icons/bi";

type ConversationMenuProps = {
  iconType: "dots" | "chevron";
};

const ConversationMenu: React.FC<ConversationMenuProps> = ({ iconType }) => {
  return (
    <Menu
      // isOpen={isOpen}
      // onClose={onClose}
      isLazy
    >
      <MenuButton
        cursor="pointer"
        padding="4px 6px"
        mr={2}
        borderRadius={4}
        _hover={{ bg: "whiteAlpha.300" }}
      >
        {iconType === "dots" && <BiDotsVertical size={20} />}
        {iconType === "chevron" && (
          <Icon
            as={BiChevronDown}
            fontSize={20}
            color="whiteAlpha.700"
          />
        )}
      </MenuButton>
      <MenuList bg="#2D2D2D">
        <MenuItem
          icon={<FiEdit fontSize={18} />}
          bg="#2D2D2D"
          _hover={{ bg: "WhiteAlpha.300" }}
          isDisabled
        >
          Edit
        </MenuItem>
        <MenuItem
          icon={<IoExitOutline fontSize={19} />}
          bg="#2D2D2D"
          _hover={{ bg: "WhiteAlpha.300" }}
          isDisabled
        >
          Leave
        </MenuItem>
        <MenuItem
          icon={<AiOutlineDelete fontSize={19} />}
          bg="#2D2D2D"
          _hover={{ bg: "whiteAlpha.300" }}
          isDisabled
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ConversationMenu;
