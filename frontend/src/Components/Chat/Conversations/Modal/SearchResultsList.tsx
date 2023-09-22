import { SearchedUser } from "@/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

type SearchResultsListProps = {
  users?: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
  removeParticipant: (user: SearchedUser) => void;
};

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  users,
  addParticipant,
  removeParticipant,
}) => {
  return (
    <>
      {users && (
        <>
          {users.length === 0 ? (
            <Flex
              mt={6}
              justify="center"
            >
              <Text>No users found.</Text>
            </Flex>
          ) : (
            <Stack mt={6}>
              {users.map((user) => (
                <Flex
                  key={`results-user-item-id-${user.id}`}
                  p="10px"
                  align="center"
                  borderRadius="4px"
                  cursor="pointer"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={() => addParticipant(user)}
                >
                  <Avatar
                    src={user.image}
                    name={user.username}
                    size="md"
                    mr={4}
                  />
                  <Flex
                    align="center"
                    width="100%"
                    justify="space-between"
                  >
                    <Text color="whiteAlpha.700">{user.username}</Text>
                    <Button onClick={() => {}}>Select</Button>
                  </Flex>
                </Flex>
              ))}
            </Stack>
          )}
        </>
      )}
    </>
  );
};

export default SearchResultsList;
