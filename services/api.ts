
import { ChatHistoryItem } from '../types';

const API_HOST = "https://bitai.millerbit.biz/api/chat";

export const callRagApi = async (query: string, history: ChatHistoryItem[]) => {
  const response = await fetch(API_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
