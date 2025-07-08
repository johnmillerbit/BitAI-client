
export interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}
