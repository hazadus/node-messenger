import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";
import { BiDotsVertical, BiHelpCircle } from "react-icons/bi";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout } from "react-icons/md";

type ConversationsNavbarProps = {
  session: Session;
};

const ConversationsNavbar: React.FC<ConversationsNavbarProps> = ({ session }) => {
  return (
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
      {session.user.image ? (
        <Tooltip
          hasArrow
          label={session.user.username}
          placement="right"
        >
          <Image
            src={session.user.image}
            boxSize="40px"
            borderRadius="full"
            alt=""
          />
        </Tooltip>
      ) : (
        <Avatar size="md" />
      )}
      <Flex>
        <Button bg="none">
          <BsChatLeftDotsFill size={20} />
        </Button>
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
            >
              <Flex
                align="center"
                ml="40px"
              >
                Profile
              </Flex>
            </MenuItem>
            <MenuItem
              height="40px"
              fontSize="10pt"
              fontWeight={700}
              bg="#2D2D2D"
              _hover={{ bg: "whiteAlpha.300" }}
              isDisabled
            >
              <Flex
                align="center"
                ml="40px"
              >
                Sounds On/Off
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              height="40px"
              fontSize="10pt"
              fontWeight={700}
              bg="#2D2D2D"
              _hover={{ bg: "whiteAlpha.300" }}
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
              onClick={() => {}}
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
              onClick={() => signOut()}
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
  );
};

export default ConversationsNavbar;
