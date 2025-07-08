
import { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

const ChatInput = ({ onSendMessage, isTyping }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
  };

  return (
    <div className="">
      <div className="max-w-4xl px-5 lg:px-0 mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything"
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 pr-12 text-gray-100 placeholder-gray-400 max-h-32 overflow-y-auto focus:outline-none focus:ring-0"
              style={{
                minHeight: "48px",
                height: "auto",
              }}
              onInput={handleInput}
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
  );
};

export default ChatInput;
