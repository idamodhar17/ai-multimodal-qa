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
import { Send, Loader2, MessageSquare, Mic, MicOff, Bot, User } from "lucide-react";

const ChatWindow = ({ onSeekTo }) => {
  const { uploadedFile } = useFile();
  const { ask, messages, loading, error, clearChat } = useChat();

  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const previousFileId = useRef(null);
  const recognitionRef = useRef(null);

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // Clear chat when file changes
  useEffect(() => {
    if (uploadedFile?.fileId !== previousFileId.current) {
      clearChat();
      previousFileId.current = uploadedFile?.fileId || null;
    }
  }, [uploadedFile?.fileId]);

  // Auto-scroll with better mobile support
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        const scrollHeight = messagesContainerRef.current.scrollHeight;
        const clientHeight = messagesContainerRef.current.clientHeight;
        messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
      }
    };
    
    // Small delay to ensure DOM is updated
    setTimeout(scrollToBottom, 50);
  }, [messages, loading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !uploadedFile) return;

    const question = inputValue.trim();
    setInputValue("");

    await ask(question, uploadedFile.fileId);
    
    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (!isSpeechSupported || !recognitionRef.current) return;
    
    if (!isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsRecording(false);
      }
    } else {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Quick questions based on file type
  const getQuickQuestions = () => {
    if (!uploadedFile) return [];
    
    const baseQuestions = [
      "What is this about?",
      "Summarize main points",
      "Key takeaways?",
    ];
    
    if (uploadedFile.fileType === 'audio' || uploadedFile.fileType === 'video') {
      return [
        "What's discussed first?",
        "Main topics summary",
        "Important timestamps?",
        "Who are speakers?",
      ];
    }
    
    return baseQuestions;
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  if (!uploadedFile) {
    return (
      <Card className="h-full border-0 rounded-lg bg-background">
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className="mb-5">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-center">Start Chatting</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
            Upload a file to chat with AI
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <div className="px-2 py-1 bg-primary/10 rounded-md">PDF</div>
            <div className="px-2 py-1 bg-blue-500/10 rounded-md">Audio</div>
            <div className="px-2 py-1 bg-purple-500/10 rounded-md">Video</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col border-0 rounded-lg overflow-hidden bg-background">
      <CardHeader className="border-b py-3 px-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold truncate">
                Chat Assistant
              </CardTitle>
              <p className="text-xs text-muted-foreground truncate">
                {uploadedFile.filename}
              </p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-7 px-2 text-xs hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="text-center space-y-4 w-full">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2">Ready to assist!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask about your {uploadedFile.fileType} file
                  </p>
                </div>
                
                {/* Quick Questions */}
                <div className="grid grid-cols-1 gap-2">
                  {getQuickQuestions().slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg border hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm font-medium truncate">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-muted rounded-lg rounded-tl-none px-3 py-2">
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                          <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse delay-150" />
                          <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse delay-300" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Thinking...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-2 mb-2">
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          </div>
        )}

        {/* Input Area - Mobile Optimized */}
        <div className="p-3 border-t bg-card">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder={`Ask about ${uploadedFile.filename}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                className="min-h-[44px] pl-3 pr-10 rounded-lg text-sm"
              />
              
              {/* Voice Input Button */}
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center ${
                    isRecording 
                      ? "text-white bg-red-500 animate-pulse" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                  onClick={toggleRecording}
                  disabled={loading}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              size="default"
              className="h-[44px] px-4 rounded-lg min-w-[44px]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Input Helper Text */}
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="text-xs text-muted-foreground truncate">
              {isSpeechSupported && (
                <span className="inline-flex items-center gap-1 mr-2">
                  <Mic className="h-3 w-3" />
                  Voice
                </span>
              )}
              <span>Enter to send</span>
            </div>
            {messages.length > 0 && (
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                {messages.length}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;