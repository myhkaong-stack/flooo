import React from 'react';
import {
  Sparkles,
  Radio,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  openFileTransfer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  openFileTransfer,
}) => {
  const getTabDetails = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'System Telemetry & Overview',
          subtitle: 'Structured requirements capture, powered by AI synthesis',
        };
      case 'interviews':
        return {
          title: 'Interview Guides',
          subtitle: 'Build and manage the guides behind every conversation',
        };
      case 'guide-builder':
        return {
          title: 'AI Guide Builder',
          subtitle: 'Generate targeted 5-pillar questions for any system & role',
        };
      case 'live-session':
        return {
          title: 'Live Interview Room',
          subtitle: 'Real-time audio recording, speech transcription & sentiment tagging',
        };
      case 'reports':
        return {
          title: 'Requirements Synthesis & Reports',
          subtitle: 'Extracted pain points, functional requirements (FR) and non-functional specifications',
        };
      case 'feedback-links':
        return {
          title: 'Feedback Links & Sharing',
          subtitle: 'Distribute public interview links for asynchronous participant feedback',
        };
      case 'transfer-hub':
        return {
          title: 'File Transfer & Import Hub',
          subtitle: 'Upload audio, meeting transcripts, or JSON specs for instant AI synthesis',
        };
      case 'settings':
        return {
          title: 'Profile & Organization Settings',
          subtitle: 'Manage interviewer identity, API keys, and workspace preferences',
        };
      case 'tutorial':
        return {
          title: 'ReqSynth Architecture & Guide',
          subtitle: 'Learn the 5 core pillars of software requirement elicitation',
        };
      default:
        return { title: 'ReqSynth AI', subtitle: 'Interview Assistant' };
    }
  };

  const { title, subtitle } = getTabDetails(activeTab);

  return (
    <header
      id="app-header"
      className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20"
    >
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span>ReqSynth</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="capitalize text-gray-800 font-semibold">{activeTab.replace('-', ' ')}</span>
        </div>
        <div className="hidden md:block h-4 w-px bg-gray-200" />
        <div className="hidden lg:block min-w-0">
          <p className="text-xs text-gray-500 truncate max-w-md">{subtitle}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Transfer Files Direct Button */}
        <button
          id="header-transfer-file-btn"
          onClick={openFileTransfer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors shadow-2xs"
          title="Transfer or upload audio recordings, transcripts or specs"
        >
          <UploadCloud className="w-3.5 h-3.5 text-[#0E7C66]" />
          <span>Transfer Files</span>
        </button>

        {/* Live Session Quick Start */}
        <button
          id="header-live-session-btn"
          onClick={() => onSelectTab('live-session')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs ${
            activeTab === 'live-session'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-[#0E7C66] hover:bg-emerald-100/70 border border-emerald-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>Live Session</span>
        </button>

        {/* New Guide CTA */}
        <button
          id="header-new-guide-btn"
          onClick={() => onSelectTab('guide-builder')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0E7C66] hover:bg-[#0B6654] shadow-sm shadow-[#0E7C66]/25 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New AI Guide</span>
        </button>
      </div>
    </header>
  );
};
