import React from "react";
import { SearchedUser } from "@/types";
import { Flex, Stack, Text, Image, Button } from "@chakra-ui/react";

type SearchResultsListProps = {
  users?: Array<SearchedUser>;
};

const SearchResultsList: React.FC<SearchResultsListProps> = ({ users }) => {
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
                >
                  <Image
                    src={user.image}
                    boxSize="40px"
                    borderRadius="full"
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
