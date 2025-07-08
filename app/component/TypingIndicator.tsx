
import { Bot } from 'lucide-react';

const TypingIndicator = () => (
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
);

export default TypingIndicator;
