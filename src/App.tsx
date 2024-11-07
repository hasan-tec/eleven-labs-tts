import React from 'react';
import { Sparkles } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import TextToSpeech from './components/TextToSpeech';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-500" />
            AI Text to Speech
          </h1>
          <p className="text-lg text-gray-600">
            Convert text to lifelike speech using AI voices
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <TextToSpeech />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}


export default App;
