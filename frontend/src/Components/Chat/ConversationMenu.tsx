import ConversationOperations from "@/graphql/operations/conversation";
import { createUmamiEvent } from "@/helpers/helpers";
import { useMutation } from "@apollo/client";
import { Icon, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { BiChevronDown, BiDotsVertical } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { IoExitOutline } from "react-icons/io5";
import { ConversationPopulated } from "../../../../backend/src/types";

type ConversationMenuProps = {
  iconType: "dots" | "chevron";
  conversation: ConversationPopulated;
};

const ConversationMenu: React.FC<ConversationMenuProps> = ({ iconType, conversation }) => {
  const [deleteConversation] = useMutation<{ deleteConversation: boolean }, { conversationId: string }>(
    ConversationOperations.Mutations.deleteConversation,
  );
  const { data: session } = useSession();
  const signedInUserId = session?.user.id;

  /**
   * Delete conversation and redirect user to "/" on success.
   */
  const onDeleteConversation = async () => {
    createUmamiEvent("Delete chat", session?.user.username || "");

    try {
      /**
       * Redirect user to "/" on success.
       */
      await deleteConversation({
        variables: {
          conversationId: conversation.id,
        },
        update: () => {
          toast.success("Chat deleted.");
        },
      });
    } catch (error: any) {
      console.log("onDeleteConversation error:", error);
      toast.error(`Failed to delete chat! ${error}`);
    }
  };

  return (
    <Menu isLazy>
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
          isDisabled={conversation.createdByUser.id !== signedInUserId}
          onClick={onDeleteConversation}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ConversationMenu;
