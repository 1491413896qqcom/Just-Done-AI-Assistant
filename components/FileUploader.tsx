
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, File as FileIcon } from 'lucide-react';
import { FileUpload } from '../types';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const SUPPORTED_FORMATS = ['.docx', '.pdf', '.txt', '.md', '.html', '.epub'];
const MAX_SIZE_MB = 50;

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!SUPPORTED_FORMATS.includes(extension)) {
      setError(`Unsupported format. Use: ${SUPPORTED_FORMATS.join(', ')}`);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    // Don't call onFileSelect yet, wait for privacy consent
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const confirmUpload = () => {
    if (selectedFile && privacyConsent) {
      onFileSelect(selectedFile);
      setSelectedFile(null); // Reset local state after handing off
      setPrivacyConsent(false);
    }
  };

  return (
    <div className="w-full mb-4">
      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={SUPPORTED_FORMATS.join(',')}
        onChange={handleChange}
      />

      {/* Selected File State */}
      {selectedFile ? (
        <div className="bg-white border border-teal rounded-xl p-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center text-teal">
                <FileIcon size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">{selectedFile.name}</div>
                <div className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>

          {/* Privacy Consent */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="mt-1"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
              />
              <span className="text-xs text-gray-600">
                I agree to the <a href="#" className="underline text-primary">Privacy Policy</a>. 
                I understand this file will be processed by AI and I have the right to use this content.
              </span>
            </label>
          </div>

          <button
            onClick={confirmUpload}
            disabled={!privacyConsent}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
              privacyConsent 
                ? 'bg-teal text-white shadow-md hover:shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Upload & Process
          </button>
        </div>
      ) : (
        /* Drop Zone */
        <div 
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
            ${dragActive ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-teal/50 hover:bg-gray-50'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <UploadCloud size={32} />
            <p className="text-sm font-medium text-gray-600">
              Drag & Drop or <span className="text-teal underline">Browse</span>
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              DOCX, PDF, TXT, MD up to 50MB
            </p>
          </div>
          
          {error && (
            <div className="absolute inset-x-0 -bottom-8 text-center">
              <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
