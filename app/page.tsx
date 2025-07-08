'use client';
import ChatInput from './component/ChatInput';
import ChatMessages from './component/ChatMessages';
import { useChat } from '../hooks/useChat';
import PrismLoader from './component/prism-loader';

export default function ChatInterface() {
  const { messages, isTyping, handleSendMessage } = useChat();

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <PrismLoader />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
}