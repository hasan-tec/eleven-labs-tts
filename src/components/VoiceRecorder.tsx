import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => Promise<void>;
  isCloning: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isCloning }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          await onRecordingComplete(audioBlob);
        } catch (error) {
          toast.error('Failed to process recording');
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Failed to access microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={isCloning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mic className="w-5 h-5" />
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          disabled={isCloning}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square className="w-5 h-5" />
          Stop Recording
        </button>
      )}
      
      {isCloning && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Cloning voice...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;