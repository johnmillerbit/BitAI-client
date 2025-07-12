import { useState } from 'react';
import { Message, ChatHistoryItem } from '../types';
import { callRagApi } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm BitAI. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const newUserHistory: ChatHistoryItem = {
      role: "user",
      parts: [{ text: inputValue }],
    };

    setIsTyping(true);

    try {
      const response = await callRagApi(inputValue, chatHistory);
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("No reader available");
      }

      let botResponse = "";
      const botMessageId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          type: "bot",
          content: "",
          timestamp: new Date(),
        },
      ]);

      while (true) {
        setIsTyping(false);
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                botResponse += parsed.text;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, content: botResponse }
                      : msg
                  )
                );
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch {
              continue;
            }
          }
        }
      }

      const newBotHistory: ChatHistoryItem = {
        role: "model",
        parts: [{ text: botResponse }],
      };

      setChatHistory((prev) => [...prev, newUserHistory, newBotHistory]);
    } catch (error) {
      console.error("Error calling RAG API:", error);

      const errorMessage: Message = {
        id: Date.now() + 2,
        type: "bot",
        content:
          "Sorry, there was an error connecting to the server. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) => msg.content !== "" || msg.type !== "bot"
        );
        return [...filtered, errorMessage];
      });
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, handleSendMessage };
};