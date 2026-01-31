import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Copy, Check, User, Bot, Volume2, Clock, ExternalLink } from 'lucide-react';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getRelativeTime = (seconds) => {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
};

const MessageBubble = ({
  content,
  isUser,
  timestamps,
  onPlayTimestamp,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTimestampClick = (time) => {
    if (onPlayTimestamp) {
      onPlayTimestamp(time);
    }
  };

  return (
    <div className={`flex gap-3 mb-5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm">
            <Bot className="h-4.5 w-4.5 text-primary" />
          </div>
        </div>
      )}

      {/* Message Container */}
      <div className={`max-w-[85%] min-w-[120px] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`relative group rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md shadow-sm'
              : 'bg-gradient-to-br from-card to-card/80 text-foreground border border-border/30 rounded-bl-md shadow-sm'
          }`}
        >
          {/* Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          
          {/* Copy Button (hover) */}
          <button
            onClick={handleCopy}
            className={`absolute -top-2 ${
              isUser ? '-left-8' : '-right-8'
            } h-6 w-6 rounded-full bg-background border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110`}
            title="Copy message"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Timestamps */}
        {timestamps && timestamps.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 w-full">
              <Clock className="h-3 w-3" />
              <span>Relevant sections:</span>
            </div>
            {timestamps.map((ts, index) => {
              const duration = ts.end - ts.start;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`h-8 text-xs rounded-lg gap-1.5 transition-all hover:scale-[1.02] active:scale-95 ${
                    isUser
                      ? 'bg-primary/10 border-primary/20 text-primary-foreground hover:bg-primary/20 hover:border-primary/30'
                      : 'border-muted-foreground/20 hover:border-primary/30 hover:bg-primary/5'
                  }`}
                  onClick={() => handleTimestampClick(ts.start)}
                >
                  <Play className="h-3 w-3" />
                  <span className="font-mono">{formatTime(ts.start)}</span>
                  <span className="opacity-50">→</span>
                  <span className="font-mono">{formatTime(ts.end)}</span>
                  <span className="ml-1 text-[10px] opacity-60">
                    ({getRelativeTime(duration)})
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center shadow-sm border border-blue-500/10">
            <User className="h-4.5 w-4.5 text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;