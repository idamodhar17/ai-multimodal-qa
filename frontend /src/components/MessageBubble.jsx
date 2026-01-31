import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MessageBubble = ({
  content,
  isUser,
  timestamps,
  onPlayTimestamp,
}) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        
        {timestamps && timestamps.length > 0 && (
          <div className="mt-3 pt-3 border-t border-current/10 space-y-2">
            <p className="text-xs opacity-70 font-medium">Timestamps:</p>
            <div className="flex flex-wrap gap-2">
              {timestamps.map((ts, index) => (
                <Button
                  key={index}
                  variant={isUser ? 'secondary' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onPlayTimestamp?.(ts.start)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  {formatTime(ts.start)} - {formatTime(ts.end)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
