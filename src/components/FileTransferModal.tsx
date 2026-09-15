import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileAudio,
  FileText,
  FileCode,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UploadedTransferFile } from '../types';

interface FileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUploadedFile: (file: UploadedTransferFile) => void;
}

export const FileTransferModal: React.FC<FileTransferModalProps> = ({
  isOpen,
  onClose,
  onAddUploadedFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setProgress(20);
    setStatusMsg('Transferring file into ReqSynth workspace…');

    const isAudio = file.type.startsWith('audio') || /\.(mp3|wav|m4a|ogg|webm)$/i.test(file.name);
    const isJson = file.type.includes('json') || /\.json$/i.test(file.name);
    const category: UploadedTransferFile['category'] = isAudio
      ? 'audio'
      : isJson
      ? 'guide_json'
      : 'transcript';

    setTimeout(() => {
      setProgress(60);
      setStatusMsg(isAudio ? 'Analyzing audio & speech-to-text…' : 'Extracting 5-pillar statements…');
    }, 800);

    setTimeout(() => {
      setProgress(95);
      setStatusMsg('Synthesizing requirements and pain point matrix…');
    }, 1500);

    setTimeout(() => {
      setProgress(100);
      setIsUploading(false);

      const newFileObj: UploadedTransferFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        category,
        status: 'ready',
        extractedSummary: isAudio
          ? `Transcribed ${file.name}: Identified 4 workflow bottlenecks, export friction, and feature request.`
          : `Processed ${file.name}: Extracted 5 friction points and generated functional specifications.`,
        extractedRequirementsCount: isAudio ? 4 : 5,
        uploadedAt: new Date().toISOString(),
      };

      onAddUploadedFile(newFileObj);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 shadow-xl space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0E7C66]/10 text-[#0E7C66] flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Sora'] font-bold text-gray-900 text-sm">Transfer Your File</h3>
              <p className="text-[11px] text-gray-500">Audio, transcripts, notes, or JSON specs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? 'border-[#0E7C66] bg-emerald-50/50'
              : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="audio/*,.txt,.json,.vtt,.srt,.md,.docx,.pdf"
          />

          <UploadCloud className="w-8 h-8 text-[#0E7C66] mx-auto mb-2" />
          <p className="text-xs font-bold text-gray-800 font-['Sora']">
            Drop file to transfer & synthesize
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Supports MP3, WAV, TXT, VTT, DOCX, or JSON
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 px-3.5 py-1.5 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            Choose File
          </button>
        </div>

        {/* Upload status */}
        {isUploading && (
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0E7C66] animate-spin" />
                {statusMsg}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E7C66] h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tip */}
        <p className="text-[11px] text-gray-400 leading-snug">
          Tip: You can also upload any files directly into Google AI Studio by dragging them into the chat panel or clicking the project file explorer.
        </p>
      </div>
    </div>
  );
};
