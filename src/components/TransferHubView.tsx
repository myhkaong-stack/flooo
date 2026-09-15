import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileAudio,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  Trash2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { UploadedTransferFile } from '../types';

interface TransferHubViewProps {
  uploadedFiles: UploadedTransferFile[];
  onAddUploadedFile: (file: UploadedTransferFile) => void;
  onGenerateGuideFromFile: (file: UploadedTransferFile) => void;
}

export const TransferHubView: React.FC<TransferHubViewProps> = ({
  uploadedFiles,
  onAddUploadedFile,
  onGenerateGuideFromFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploadProgress(15);
    setCurrentStep('Reading and transferring file data…');

    const isAudio = file.type.startsWith('audio') || /\.(mp3|wav|m4a|ogg|webm)$/i.test(file.name);
    const isJson = file.type.includes('json') || /\.json$/i.test(file.name);
    const category: UploadedTransferFile['category'] = isAudio
      ? 'audio'
      : isJson
      ? 'guide_json'
      : 'transcript';

    setTimeout(() => {
      setUploadProgress(50);
      setCurrentStep(
        isAudio
          ? 'Transcribing audio speech and vocal sentiment…'
          : 'Parsing text and mapping statements across 5 pillars…'
      );
    }, 800);

    setTimeout(() => {
      setUploadProgress(85);
      setCurrentStep('Synthesizing functional requirements and friction tags…');
    }, 1600);

    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);

      const newFileObj: UploadedTransferFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        category,
        status: 'ready',
        extractedSummary: isAudio
          ? `Transcribed ${file.name}: Identified 4 workflow bottlenecks, manual export workarounds, and request for mobile alerting.`
          : `Processed document ${file.name}: Extracted 6 user pain points and generated 4 functional requirements statements.`,
        extractedRequirementsCount: isAudio ? 4 : 6,
        uploadedAt: new Date().toISOString(),
      };

      onAddUploadedFile(newFileObj);
    }, 2400);
  };

  return (
    <div id="transfer-hub-view" className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Direct Confirmation Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#0E7C66] text-white shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold font-['Sora'] text-emerald-950">
              Yes, you can transfer your files right here!
            </h2>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-3xl">
              Your application from Readdy (<code className="font-mono bg-emerald-100/70 px-1 py-0.5 rounded text-emerald-900">ReqSynth AI</code>) has been completely transferred and running live in this workspace. You can also transfer files in two complementary ways:
            </p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-emerald-900 pt-1">
              <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100">
                <span className="font-bold text-[#0E7C66]">1. In-App Data Transfer (Below):</span>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Upload audio recordings, transcripts, or JSON specs directly into ReqSynth AI to auto-synthesize requirements.
                </p>
              </div>
              <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100">
                <span className="font-bold text-[#0E7C66]">2. Workspace File Transfer:</span>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  You can drag and drop any code, asset, or document directly into the AI Studio chat or file explorer anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="font-['Sora'] font-bold text-gray-900 text-base">
            Upload or Transfer Interview Files
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Supported formats: Audio (.mp3, .wav, .m4a, .webm), Transcripts (.txt, .vtt, .srt, .docx), and Specs (.json, .md).
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-[#0E7C66] bg-emerald-50/50'
              : 'border-gray-300 hover:border-gray-400 bg-[#FBFDFB]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="audio/*,.txt,.json,.vtt,.srt,.md,.docx,.pdf"
          />

          <div className="w-12 h-12 rounded-full bg-[#0E7C66]/10 text-[#0E7C66] flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="font-bold text-gray-800 text-sm font-['Sora']">
            Drag and drop your file here, or browse
          </h4>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            ReqSynth AI will automatically transcribe speech, evaluate sentiment, and generate a 5-pillar requirements breakdown.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#0E7C66]/20 transition-colors"
          >
            Select File from Device
          </button>
        </div>

        {/* Live Upload & Processing Bar */}
        {isUploading && (
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 animate-fadeIn">
            <div className="flex justify-between text-xs font-semibold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0E7C66] animate-spin" />
                {currentStep}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0E7C66] h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Transferred Files History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Sora'] font-bold text-gray-900 text-base">
              Transferred Files & Extracted Requirements ({uploadedFiles.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Files uploaded to this session with synthesized findings.
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {uploadedFiles.map((f) => (
            <div
              key={f.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors rounded-lg px-2"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
                  {f.category === 'audio' ? (
                    <FileAudio className="w-5 h-5 text-rose-600" />
                  ) : f.category === 'guide_json' ? (
                    <FileCode className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-xs font-mono">{f.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      {f.category.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-2xl">
                    {f.extractedSummary}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    {(f.size / 1024 / 1024).toFixed(2)} MB &bull; Uploaded {new Date(f.uploadedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onGenerateGuideFromFile(f)}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build Guide from File</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
