'use client';

import { useChat } from '../hooks/useChat';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import PrismLoader from './components/prism-loader';

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
