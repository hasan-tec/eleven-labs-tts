export interface Voice {
  voice_id: string;
  name: string;
  preview_url?: string;
  labels?: Record<string, string>;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

export interface TextToSpeechRequest {
  text: string;
  model_id: string;
  voice_settings: VoiceSettings;
}

export interface ApiError {
  detail?: string;
  message?: string;
}