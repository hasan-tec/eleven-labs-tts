import React, { useState, useRef, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import VoiceSelector from './VoiceSelector';
import type { Voice, TextToSpeechRequest } from '../types';

const TextToSpeech: React.FC = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      setVoices(data.voices);
    } catch (error) {
      console.error('Error fetching voices:', error);
      toast.error('Failed to load voices');
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const generateSpeech = async () => {
    if (!selectedVoice || !text.trim()) return;

    setIsGenerating(true);
    try {
      const request: TextToSpeechRequest = {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      };

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice.voice_id}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
          },
          body: JSON.stringify(request)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Speech generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate speech');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <VoiceSelector
        voices={voices}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        isLoading={isLoadingVoices}
      />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        disabled={isGenerating}
        className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      
      <div className="flex items-center gap-4">
        <button
          onClick={generateSpeech}
          disabled={!selectedVoice || !text.trim() || isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Generate Speech
            </>
          )}
        </button>
      </div>
      
      <audio ref={audioRef} className="w-full mt-4" controls />
    </div>
  );
};

export default TextToSpeech;