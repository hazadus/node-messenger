import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  Stack,
  Link,
  Divider,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { BsGithub, BsLink45Deg } from "react-icons/bs";

type AboutAppModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AboutAppModal: React.FC<AboutAppModalProps> = ({ isOpen, onClose }) => {
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
          <ModalHeader>About App</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack align="center">
              <Image
                src="images/appLogo.png"
                boxSize="200px"
              />
              <Text
                align="center"
                fontSize="2xl"
                fontWeight={600}
              >
                Node Messenger
              </Text>
              <Text
                align="center"
                color="whiteAlpha.700"
              >
                Real time messaging app built with Next.js, Apollo Server/Client, MongoDB and Prisma.
              </Text>
              <Text
                align="center"
                color="whiteAlpha.700"
              >
                Thanks to{" "}
                <Link
                  href="https://github.com/shadeemerhi"
                  target="_blank"
                  textDecoration="underline"
                >
                  Shadee Merhi
                </Link>{" "}
                for his amazing{" "}
                <Link
                  href="https://www.youtube.com/watch?v=mj_Qe2jBYS4"
                  target="_blank"
                  textDecoration="underline"
                >
                  video tutorial
                </Link>
                , which was used as the base for this project.
              </Text>
              <Divider my={2} />
              <Flex
                align="center"
                color="whiteAlpha.700"
              >
                <Icon
                  as={BsGithub}
                  mr={2}
                />
                <Link
                  mr={2}
                  target="_blank"
                  href="https://github.com/hazadus/node-messenger"
                >
                  Source code
                </Link>

                <Icon
                  as={BsLink45Deg}
                  mr={2}
                />
                <Link
                  target="_blank"
                  href="https://hazadus.ru"
                >
                  Hazadus.ru
                </Link>
              </Flex>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutAppModal;
