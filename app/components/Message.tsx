
import { Message } from '../../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Copy } from 'lucide-react';
import '../css/Message.css';

interface MessageProps {
  message: Message;
}

const MessageComponent = ({ message }: MessageProps) => {
  const { type, content, timestamp } = message;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex gap-4 ${type === "user" ? "user-message" : "bot-message"}`}>
      <div className={`max-w-full ${type === "user" ? "message-content" : ""}`}>
        <div className={`p-4 rounded-2xl message-bubble`}>
          <div className="text-gray-100 break-words">
            <MarkdownRenderer markdown={content} />
          </div>
        </div>

        <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 time`}>
          <span>{formatTime(timestamp)}</span>

          {type === "bot" && (
            <div className="flex gap-1">
              <button
                onClick={() => copyToClipboard(content)}
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
  );
};

export default MessageComponent;
