import React, { useRef, useEffect } from 'react';
import { useFile } from '@/contexts/FileContext';
import { Card } from '@/components/ui/card';

const MediaPlayer = ({ seekTo }) => {
  const { uploadedFile } = useFile();
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (seekTo !== undefined) {
      const mediaElement = uploadedFile?.type === 'video' ? videoRef.current : audioRef.current;
      if (mediaElement) {
        mediaElement.currentTime = seekTo;
        mediaElement.play();
      }
    }
  }, [seekTo, uploadedFile?.type]);

  if (!uploadedFile || uploadedFile.type === 'pdf') {
    return null;
  }

  const seekToTime = (time) => {
    const mediaElement = uploadedFile.type === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      mediaElement.currentTime = time;
      mediaElement.play();
    }
  };

  return (
    <Card className="overflow-hidden">
      {uploadedFile.type === 'audio' && (
        <div className="p-4 bg-muted/30">
          <audio
            ref={audioRef}
            src={uploadedFile.url}
            controls
            className="w-full"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {uploadedFile.type === 'video' && (
        <video
          ref={videoRef}
          src={uploadedFile.url}
          controls
          className="w-full max-h-[400px]"
        >
          Your browser does not support the video element.
        </video>
      )}
    </Card>
  );
};

export default MediaPlayer;
