import { SearchedUser } from "@/types";
import { Avatar, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

type ParticipantsProps = {
  participants: Array<SearchedUser>;
  removeParticipant: (user: SearchedUser) => void;
};

const Participants: React.FC<ParticipantsProps> = ({ participants, removeParticipant }) => {
  return (
    <>
      {participants.length > 0 && (
        <Flex
          mt={6}
          gap="10px"
          flexWrap="wrap"
        >
          {participants.map((participant) => (
            <Stack
              key={`participant-user-id-${participant.id}`}
              direction="row"
              align="center"
              bg="whiteAlpha.200"
              px={2}
              py={1}
              borderRadius="4px"
            >
              <Avatar
                src={participant.image}
                name={participant.username}
                size="xs"
              />
              <Text>{participant.username}</Text>
              <Icon
                as={IoMdCloseCircleOutline}
                boxSize="20px"
                cursor="pointer"
                onClick={() => removeParticipant(participant)}
              />
            </Stack>
          ))}
        </Flex>
      )}
    </>
  );
};

export default Participants;
