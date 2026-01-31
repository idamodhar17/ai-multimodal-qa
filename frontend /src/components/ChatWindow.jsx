import React, { useState, useRef, useEffect } from "react";
import { useFile } from "../contexts/FileContext";
import { useChat } from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, Loader2, MessageSquare } from "lucide-react";

const ChatWindow = ({ onSeekTo }) => {
  const { uploadedFile } = useFile();
  const { ask, messages, loading, error, clearChat } = useChat();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const previousFileId = useRef(null);

  // Clear chat when file changes
  useEffect(() => {
    if (uploadedFile?.fileId !== previousFileId.current) {
      clearChat();
      previousFileId.current = uploadedFile?.fileId || null;
    }
  }, [uploadedFile?.fileId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !uploadedFile) return;

    const question = inputValue.trim();
    setInputValue("");

    await ask(question, uploadedFile.fileId);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!uploadedFile) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <MessageSquare className="mx-auto h-12 w-12 mb-4" />
          <p className="text-muted-foreground">
            Upload a file to start asking questions
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Ask Questions
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm text-center">
                Ask a question about your file
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, idx) => (
                <MessageBubble
                  key={idx}
                  content={message.content}
                  isUser={message.role === "user"}
                  timestamps={message.sources}
                  onPlayTimestamp={onSeekTo}
                />
              ))}

              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              size="icon"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
