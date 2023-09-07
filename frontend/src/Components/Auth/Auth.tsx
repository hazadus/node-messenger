import UserOperations from "@/graphql/operations/user";
import type { CreateUsernameData, CreateUsernameVariables } from "@/types";
import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

type AuthProps = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");
  const [createUsername, { loading, error }] = useMutation<CreateUsernameData, CreateUsernameVariables>(
    UserOperations.Mutations.createUsername,
  );

  const onSubmitUsername = async () => {
    if (!username) return;

    try {
      console.log("onSubmitUsername session data =", session);
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        throw new Error(error);
      }

      // Reload user from database to retrieve newly set `username`
      reloadSession();
    } catch (error: any) {
      console.log("onSubmitUsername error:", error);
    }
  };

  return (
    <Center height="100vh">
      <Stack
        align="center"
        spacing={5}
      >
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Button
              width="100%"
              onClick={onSubmitUsername}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">Node Messenger</Text>
            <Button
              leftIcon={
                <Image
                  src="/images/googleLogo.png"
                  alt="Google Logo"
                  height="20px"
                />
              }
              onClick={() => signIn("google")}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
