import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { FileText, Mic, Video } from 'lucide-react';

const Auth = () => {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">DocuChat AI</h1>
          <p className="text-primary-foreground/80 mt-2">
            AI-powered Document, Audio & Video Q&A
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-foreground/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Document Analysis</h3>
              <p className="text-sm text-primary-foreground/70">
                Upload PDFs and get instant answers to your questions
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-foreground/10 rounded-lg">
              <Mic className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Audio Transcription</h3>
              <p className="text-sm text-primary-foreground/70">
                Ask questions about audio content with timestamp navigation
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-foreground/10 rounded-lg">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Video Intelligence</h3>
              <p className="text-sm text-primary-foreground/70">
                Navigate videos using AI-powered Q&A
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-primary-foreground/50">
          © 2024 DocuChat AI. All rights reserved.
        </p>
      </div>
      
      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">DocuChat AI</h1>
            <p className="text-muted-foreground">AI-powered Q&A Platform</p>
          </div>
          <AuthForm mode={mode} onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
