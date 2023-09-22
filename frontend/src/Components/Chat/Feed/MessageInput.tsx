import { ApolloError, useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { ObjectId } from "bson";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SendMessageArguments } from "../../../../../backend/src/types";
import MessageOperations from "../../../graphql/operations/message";

type MessageInputProps = {
  session: Session;
  conversationId: string;
};

const MessageInput: React.FC<MessageInputProps> = ({ session, conversationId }) => {
  const [messageBody, setMessageBody] = useState("");
  const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessageArguments>(
    MessageOperations.Mutation.sendMessage,
    {
      onError: (error: ApolloError) => {
        console.log("Messages component: error sending message!", error.message);
        toast.error(error?.message);
      },
    },
  );

  /**
   * Actually send the message when user submits the form (hits enter in text input).
   * @param event React.FormEvent
   */
  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!messageBody.trim().length) {
      return;
    }

    try {
      // Call sendMessage mutation
      const senderId = session.user.id;
      const messageId = new ObjectId().toString();
      const newMessage: SendMessageArguments = {
        id: messageId,
        senderId,
        conversationId,
        body: messageBody,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
      });

      // On success, clear message body
      if (data?.sendMessage && !errors) {
        setMessageBody("");
      }
    } catch (error: any) {
      console.log("onSendMessage error:", error);
      toast.error(error?.message);
    }
  };

  /**
   * Auto-focus message input when new conversation is selected in
   * the conversations list.
   */
  let messageInput: HTMLInputElement | null = null;

  useEffect(() => {
    if (messageInput) messageInput.focus();
  }, [messageInput, conversationId]);

  return (
    <Box
      px={4}
      py={2}
      width="100%"
    >
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          ref={(input) => (messageInput = input)}
          placeholder="Enter your message"
          resize="none"
          onChange={(event) => setMessageBody(event.target.value)}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
