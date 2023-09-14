import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import toast from "react-hot-toast";

type MessageInputProps = {
  session: Session;
  conversationId: string;
};

const MessageInput: React.FC<MessageInputProps> = ({ session, conversationId }) => {
  const [messageBody, setMessageBody] = useState("");

  /**
   * Actually send the message when user submits the form (hits enter in text input).
   * @param event React.FormEvent
   */
  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Call sendMessage mutation
      // ...

      // On success, clear message body
      setMessageBody("");
    } catch (error: any) {
      console.log("onSendMessage error:", error);
      toast.error(error?.message);
    }
  };

  return (
    <Box
      px={4}
      py={2}
      width="100%"
    >
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          placeholder="Enter your message"
          resize="none"
          onChange={(event) => setMessageBody(event.target.value)}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
