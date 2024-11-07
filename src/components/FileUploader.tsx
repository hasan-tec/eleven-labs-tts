import React, { useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => Promise<void>;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onFileSelect(file);
    } catch (error) {
      toast.error('Failed to process audio file');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <Upload className="w-5 h-5" />
        Upload Audio
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
      </label>
      
      {isProcessing && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Cloning voice...
        </div>
      )}
    </div>
  );
};

export default FileUploader;