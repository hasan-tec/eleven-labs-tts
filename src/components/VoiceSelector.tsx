import React from 'react';
import { Loader2 } from 'lucide-react';
import type { Voice } from '../types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  onSelectVoice: (voice: Voice) => void;
  isLoading: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  onSelectVoice,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading voices...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
        Select a Voice
      </label>
      <select
        id="voice"
        value={selectedVoice?.voice_id || ''}
        onChange={(e) => {
          const voice = voices.find(v => v.voice_id === e.target.value);
          if (voice) onSelectVoice(voice);
        }}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Choose a voice...</option>
        {voices.map((voice) => (
          <option key={voice.voice_id} value={voice.voice_id}>
            {voice.name}
          </option>
        ))}
      </select>
      
      {selectedVoice?.preview_url && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-1">Preview this voice:</p>
          <audio src={selectedVoice.preview_url} className="w-full" controls />
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;