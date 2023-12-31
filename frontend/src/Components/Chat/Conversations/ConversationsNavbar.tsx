import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { BiDotsVertical, BiHelpCircle } from "react-icons/bi";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GoMute, GoUnmute } from "react-icons/go";
import { MdOutlineLogout } from "react-icons/md";
import { createUmamiEvent } from "../../../helpers/helpers";
import { useStickyState } from "../../../utils/utils";
import AboutAppModal from "./Modal/AboutAppModal";
import FindConversationModal from "./Modal/FindConversationModal";
import UserProfileModal from "./Modal/UserProfileModal";

type ConversationsNavbarProps = {
  session: Session;
};

const ConversationsNavbar: React.FC<ConversationsNavbarProps> = ({ session }) => {
  const [isClient, setIsClient] = useState(false);
  const [isFindConversationModalOpen, setIsFindConversationModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isAboutAppModalOpen, setIsAboutAppModalOpen] = useState(false);

  const [isSoundEnabled, setIsSoundEnabled] = useStickyState("isSoundEnabled", true);

  const onOpenFindConversationModal = () => {
    setIsFindConversationModalOpen(true);
    createUmamiEvent("Create Chat modal open", session.user.username);
  };
  const onCloseFindConversationModal = () => setIsFindConversationModalOpen(false);

  const onOpenUserProfileModal = () => {
    setIsUserProfileModalOpen(true);
    createUmamiEvent("User Profile modal open", session.user.username);
  };
  const onCloseUserProfileModal = () => setIsUserProfileModalOpen(false);

  const onOpenAboutAppModal = () => {
    setIsAboutAppModalOpen(true);
    createUmamiEvent("About App modal open", session.user.username);
  };
  const onCloseAboutAppModal = () => setIsAboutAppModalOpen(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Flex
        px={4}
        py={2}
        height="60px"
        width="100%"
        bg="whiteAlpha.100"
        flexDirection="row"
        flexShrink={0}
        align="center"
        justify="space-between"
      >
        <Tooltip
          label={session.user.username}
          placement="right"
          hasArrow
        >
          <Avatar
            src={session.user.image || ""}
            size="md"
            cursor="pointer"
            onClick={onOpenUserProfileModal}
          />
        </Tooltip>
        <Flex>
          <Tooltip
            label="New Chat"
            fontSize="10px"
            hasArrow
          >
            <Button
              bg="none"
              onClick={onOpenFindConversationModal}
            >
              <BsChatLeftDotsFill size={20} />
            </Button>
          </Tooltip>
          <Menu>
            <MenuButton
              cursor="pointer"
              padding="0 6px"
              borderRadius={4}
              _hover={{ bg: "whiteAlpha.300" }}
            >
              <BiDotsVertical size={20} />
            </MenuButton>
            <MenuList
              width="254px"
              bg="#2D2D2D"
            >
              <MenuItem
                height="40px"
                fontSize="10pt"
                fontWeight={700}
                color="gray.500"
                bg="#2D2D2D"
                isDisabled
              >
                <Flex align="center">
                  <Icon
                    as={CgProfile}
                    fontSize={20}
                    mx="10px"
                  />
                  My Stuff
                </Flex>
              </MenuItem>{" "}
              <MenuItem
                height="40px"
                fontSize="10pt"
                fontWeight={700}
                bg="#2D2D2D"
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={onOpenUserProfileModal}
              >
                <Flex
                  align="center"
                  ml="40px"
                >
                  Profile
                </Flex>
              </MenuItem>
              {isClient && (
                <MenuItem
                  height="40px"
                  fontSize="10pt"
                  fontWeight={700}
                  bg="#2D2D2D"
                  _hover={{ bg: "whiteAlpha.300" }}
                  onClick={() => {
                    setIsSoundEnabled(!isSoundEnabled);
                    createUmamiEvent("Sound notifications toggled", session.user.username);
                  }}
                >
                  <Flex align="center">
                    <Icon
                      as={isSoundEnabled ? GoUnmute : GoMute}
                      fontSize={20}
                      mx="10px"
                    />
                    Sounds:&nbsp;{isSoundEnabled ? <span>On</span> : <span>Off</span>}
                  </Flex>
                </MenuItem>
              )}
              <MenuDivider />
              <MenuItem
                height="40px"
                fontSize="10pt"
                fontWeight={700}
                bg="#2D2D2D"
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={onOpenFindConversationModal}
              >
                <Flex
                  align="center"
                  ml="40px"
                >
                  New Chat
                </Flex>
              </MenuItem>
              <MenuItem
                height="40px"
                fontSize="10pt"
                fontWeight={700}
                bg="#2D2D2D"
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={onOpenAboutAppModal}
              >
                <Flex align="center">
                  <Icon
                    as={BiHelpCircle}
                    fontSize={20}
                    mx="10px"
                  />
                  About Messenger
                </Flex>
              </MenuItem>
              <MenuDivider />
              <MenuItem
                height="40px"
                fontSize="10pt"
                fontWeight={700}
                bg="#2D2D2D"
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={() => {
                  createUmamiEvent("Sign Out", session.user.username);
                  signOut();
                }}
              >
                <Flex align="center">
                  <Icon
                    as={MdOutlineLogout}
                    fontSize={20}
                    mx="10px"
                  />
                  Log Out
                </Flex>
              </MenuItem>
              <MenuItem
                fontSize="9pt"
                color="gray.500"
                bg="#2D2D2D"
                isDisabled
              >
                <Flex
                  align="center"
                  ml="10px"
                  mt="8px"
                  mb="8px"
                >
                  Hazadus.ru &copy; 2023. All rights preserved.
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      {/* Modals */}
      <FindConversationModal
        isOpen={isFindConversationModalOpen}
        onClose={onCloseFindConversationModal}
        session={session}
      />
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={onCloseUserProfileModal}
        session={session}
      />
      <AboutAppModal
        isOpen={isAboutAppModalOpen}
        onClose={onCloseAboutAppModal}
      />
    </>
  );
};

export default ConversationsNavbar;
