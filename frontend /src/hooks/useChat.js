import { useState } from "react";
import { apiService } from "@/api/apiService";

export function useChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  const ask = async (question, fileId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");

      const res = await apiService.chat(question, fileId, token);

      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        {
          role: "assistant",
          content: res.answer,
          sources: res.sources || [],
        },
      ]);

      return res;
    } catch (err) {
      setError(err?.message || "Chat failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return { ask, messages, clearChat, loading, error };
}
