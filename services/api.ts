import { ChatHistoryItem } from '../types';

const API_HOST = process.env.NEXT_PUBLIC_API_URL!;

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
  console.log("API response status:", response.status);

  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData?.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response;
};
