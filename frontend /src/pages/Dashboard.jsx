import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FileUpload from '@/components/FileUpload';
import MediaPlayer from '@/components/MediaPlayer';
import ChatWindow from '@/components/ChatWindow';
// import SummaryCard from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { LogOut, User, Upload, MessageSquare } from 'lucide-react';
import { useFile } from '@/contexts/FileContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { uploadedFile } = useFile();
  const [seekTime, setSeekTime] = useState(undefined);
  const [activeTab, setActiveTab] = useState('chat');

  const handleSeekTo = (time) => {
    setSeekTime(time);
    setTimeout(() => setSeekTime(undefined), 100);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Helper function to safely get file type
  const getFileType = () => {
    if (!uploadedFile || !uploadedFile.type) return '';
    return uploadedFile.type.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground hidden sm:block">
                DocuChat AI
              </h1>
              <h1 className="text-lg font-bold text-foreground sm:hidden">
                DocuChat
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Desktop User Info */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                <User className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate max-w-[140px]">{user?.email}</span>
              </div>
              
              {/* Mobile User Icon */}
              <div className="sm:hidden">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center border shadow-sm">
                  <User className="h-3.5 w-3.5" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="h-8 px-3 text-xs sm:text-sm"
              >
                <LogOut className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Logout</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Tabs */}
        <div className="sm:hidden border-t">
          <div className="container mx-auto px-4">
            <div className="flex">
              <button
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors relative ${
                  activeTab === 'chat'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
                {activeTab === 'chat' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
              <button
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors relative ${
                  activeTab === 'upload'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
                {activeTab === 'upload' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-6">
              <FileUpload />
              {/* {uploadedFile && <SummaryCard />} */}
            </div>

            <div className="col-span-2 space-y-6">
              {uploadedFile && uploadedFile.type && (uploadedFile.type === 'audio' || uploadedFile.type === 'video') && (
                <MediaPlayer seekTo={seekTime} />
              )}

              {/* Chat Window */}
              <div className="h-[600px]">
                <ChatWindow onSeekTo={handleSeekTo} />
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <FileUpload />
              {/* {uploadedFile && <SummaryCard />} */}
            </div>

            <div className="space-y-4">
              {uploadedFile && uploadedFile.type && (uploadedFile.type === 'audio' || uploadedFile.type === 'video') && (
                <MediaPlayer seekTo={seekTime} />
              )}

              {/* Chat Window */}
              <div className="h-[500px]">
                <ChatWindow onSeekTo={handleSeekTo} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {activeTab === 'chat' ? (
            <div className="space-y-4">
              {uploadedFile && uploadedFile.type && (uploadedFile.type === 'audio' || uploadedFile.type === 'video') && (
                <div className="sticky top-20 z-30 bg-background pb-2 -mx-4 px-4">
                  <MediaPlayer seekTo={seekTime} />
                </div>
              )}
              
              {/* Chat Window */}
              <div className="h-[calc(100vh-160px)]">
                <ChatWindow onSeekTo={handleSeekTo} />
              </div>
            </div>
          ) : (
            /* Upload Tab Content */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Upload File</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('chat')}
                  className="text-primary"
                >
                  ← Back to Chat
                </Button>
              </div>
              
              <FileUpload />
              
              {uploadedFile && (
                <div className="space-y-4">
                  {/* <SummaryCard /> */}
                  
                  {/* Quick Action Button */}
                  <Button
                    className="w-full"
                    onClick={() => setActiveTab('chat')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chatting
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Footer Status Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t py-2 px-4 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-medium">Online</span>
        </div>
        <div className="flex items-center gap-2">
          {uploadedFile && uploadedFile.type && (
            <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
              {getFileType()}
            </div>
          )}
          <span className="truncate max-w-[100px]">{user?.email.split('@')[0]}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;