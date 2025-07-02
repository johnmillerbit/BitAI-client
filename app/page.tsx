"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Copy } from "lucide-react";
import MarkdownRenderer from "./component/MarkdownRenderer";
import "./css/chat.css";

interface Message {
    id: number;
    type: "user" | "bot";
    content: string;
    timestamp: Date;
}

interface ChatHistoryItem {
    role: "user" | "model";
    parts: Array<{ text: string }>;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: "bot",
            content: "Hello! I'm BitAI. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (): Promise<void> => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            type: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Add user message to chat history
        const newUserHistory: ChatHistoryItem = {
            role: "user",
            parts: [{ text: inputValue }],
        };

        const currentQuery = inputValue;
        setInputValue("");
        setIsTyping(true);

        try {
            // Call the RAG API
            const host = 'https://bitai.millerbit.biz/api/chat'
            // const demo = "http://localhost:3001/chat";
            const response = await fetch(host, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: currentQuery,
                    history: chatHistory,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("No reader available");
            }

            let botResponse = "";
            const botMessageId = Date.now() + 1;

            // Add initial empty bot message
            setMessages((prev) => [
                ...prev,
                {
                    id: botMessageId,
                    type: "bot",
                    content: "",
                    timestamp: new Date(),
                },
            ]);

            // Read the stream
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

                                // Update the bot message in real-time
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
                            // Skip malformed JSON
                            continue;
                        }
                    }
                }
            }

            // Update chat history with both user and bot messages
            const newBotHistory: ChatHistoryItem = {
                role: "model",
                parts: [{ text: botResponse }],
            };

            setChatHistory((prev) => [...prev, newUserHistory, newBotHistory]);
        } catch (error) {
            console.error("Error calling RAG API:", error);

            // Add error message
            const errorMessage: Message = {
                id: Date.now() + 2,
                type: "bot",
                content:
                    "Sorry, there was an error connecting to the server. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => {
                // Remove the empty bot message if it exists
                const filtered = prev.filter(
                    (msg) => msg.content !== "" || msg.type !== "bot"
                );
                return [...filtered, errorMessage];
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ): void => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text);
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-4 ${
                                message.type === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-3xl ${
                                    message.type === "user" ? "order-2" : ""
                                }`}
                            >
                                <div
                                    className={`p-4 rounded-2xl ${
                                        message.type === "user"
                                            ? "bg-blue-600 text-white ml-auto"
                                            : "bg-gray-800 text-gray-100 border border-gray-700"
                                    }`}
                                >
                                    <div className="text-gray-100 break-words">
                                        <MarkdownRenderer
                                            markdown={message.content}
                                        />
                                    </div>
                                </div>

                                <div
                                    className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
                                        message.type === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <span>{formatTime(message.timestamp)}</span>

                                    {message.type === "bot" && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        message.content
                                                    )
                                                }
                                                className="p-1 hover:bg-gray-700 rounded"
                                                title="Copy message"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-4 justify-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="">
                <div className="max-w-4xl mx-auto">
                    <div className="relative flex gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask anything"
                                rows={1}
                                className="w-full resize-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 pr-12 text-gray-100 placeholder-gray-400 max-h-32 overflow-y-auto focus:outline-none focus:ring-0"
                                style={{
                                    minHeight: "48px",
                                    height: "auto",
                                }}
                                onInput={(
                                    e: React.FormEvent<HTMLTextAreaElement>
                                ) => {
                                    const target =
                                        e.target as HTMLTextAreaElement;
                                    target.style.height = "auto";
                                    target.style.height =
                                        Math.min(target.scrollHeight, 128) +
                                        "px";
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="flex-shrink-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors duration-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
