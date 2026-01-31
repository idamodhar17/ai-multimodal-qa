import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FileUpload from '@/components/FileUpload';
import MediaPlayer from '@/components/MediaPlayer';
import ChatWindow from '@/components/ChatWindow';
import SummaryCard from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useFile } from '@/contexts/FileContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { uploadedFile } = useFile();
  const [seekTime, setSeekTime] = useState(undefined);

  const handleSeekTo = (time) => {
    setSeekTime(time);
    setTimeout(() => setSeekTime(undefined), 100);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">DocuChat AI</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload />
            {/* {uploadedFile && <SummaryCard />} */}
          </div>

          {/* Right Column - Media Player & Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Player */}
            {uploadedFile && (uploadedFile.type === 'audio' || uploadedFile.type === 'video') && (
              <MediaPlayer seekTo={seekTime} />
            )}

            {/* Chat Window */}
            <div className="h-[500px]">
              <ChatWindow onSeekTo={handleSeekTo} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
