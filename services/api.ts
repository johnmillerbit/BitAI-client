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

export const getDocuments = async () => {
  const response = await fetch(`${API_HOST}add-document`, {
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY!,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }
  return response.json();
};

export const getUnallowedDonators = async () => {
  const response = await fetch(`${API_HOST}donate/unallowed`, {
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY!,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch donators");
  }
  return response.json();
};

export const deleteDonator = async (id: string) => {
  const response = await fetch(`${API_HOST}donate/${id}`, {
    method: "DELETE",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY!,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete donator");
  }
  return response.json();
};

export const allowDonator = async (id: string) => {
  const response = await fetch(`${API_HOST}donate/${id}`, {
    method: "PUT",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY!,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to allow donator");
  }
  return response.json();
};

export const updateDocument = async (id: string, content: string) => {
  const response = await fetch(`${API_HOST}/document/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY!,
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("Failed to update document");
  }
  return response.json();
};

export const deleteDocument = async (id: string) => {
  const response = await fetch(`${API_HOST}add-document/${id}`, {
    method: "DELETE",
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY!,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete document");
  }
  return response.json();
};
