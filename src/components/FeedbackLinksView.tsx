import React, { useState } from 'react';
import {
  Link2,
  Copy,
  CheckCircle,
  ExternalLink,
  Plus,
  Clock,
  Users,
  QrCode,
  ToggleLeft,
  ToggleRight,
  Shield,
} from 'lucide-react';
import { FeedbackLink, InterviewGuide } from '../types';

interface FeedbackLinksViewProps {
  links: FeedbackLink[];
  guides: InterviewGuide[];
  onCreateLink: (guideId: string, expiry: 'Never expires' | 'Expires in 7 days' | 'Expires in 30 days') => void;
  onToggleStatus: (id: string) => void;
  onOpenRespondentModal: (link: FeedbackLink) => void;
}

export const FeedbackLinksView: React.FC<FeedbackLinksViewProps> = ({
  links,
  guides,
  onCreateLink,
  onToggleStatus,
  onOpenRespondentModal,
}) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(guides[0]?.id || '');
  const [expiryOption, setExpiryOption] = useState<'Never expires' | 'Expires in 7 days' | 'Expires in 30 days'>('Expires in 30 days');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (link: FeedbackLink) => {
    const url = `${window.location.origin}/f/${link.token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div id="feedback-links-view" className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Creation Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg font-bold font-['Sora'] text-gray-900 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#0E7C66]" />
            <span>Generate Public Feedback Link</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Allow participants to answer your 5-pillar interview guide on their own schedule via voice or text.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Guide</label>
            <select
              value={selectedGuideId}
              onChange={(e) => setSelectedGuideId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-hidden focus:border-[#0E7C66]"
            >
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.system})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Link Expiration</label>
            <select
              value={expiryOption}
              onChange={(e) => setExpiryOption(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-hidden focus:border-[#0E7C66]"
            >
              <option value="Expires in 7 days">Expires in 7 days</option>
              <option value="Expires in 30 days">Expires in 30 days</option>
              <option value="Never expires">Never expires</option>
            </select>
          </div>

          <button
            onClick={() => onCreateLink(selectedGuideId, expiryOption)}
            className="w-full py-2 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#0E7C66]/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Shareable Link</span>
          </button>
        </div>
      </div>

      {/* Active Links Grid */}
      <div className="space-y-4">
        <h3 className="font-['Sora'] font-bold text-gray-900 text-base">Active Feedback Links ({links.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const isLive = link.status === 'live';
            return (
              <div
                key={link.id}
                className={`bg-white rounded-xl border p-5 shadow-2xs transition-all flex flex-col justify-between ${
                  isLive ? 'border-gray-200 hover:border-[#0E7C66]/50' : 'border-gray-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isLive ? '● LIVE' : 'TURNED OFF'}
                    </span>
                    <button
                      onClick={() => onToggleStatus(link.id)}
                      className="text-gray-400 hover:text-gray-700"
                      title="Toggle link active status"
                    >
                      {isLive ? (
                        <ToggleRight className="w-6 h-6 text-[#0E7C66]" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm font-['Sora'] line-clamp-1">
                    {link.guideTitle}
                  </h4>

                  <div className="mt-3 p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs font-mono text-gray-600">
                    <span className="truncate mr-2">/f/{link.token}</span>
                    <button
                      onClick={() => handleCopy(link)}
                      className="text-gray-500 hover:text-[#0E7C66] p-1"
                      title="Copy URL"
                    >
                      {copiedId === link.id ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" /> Submissions:
                      </span>
                      <span className="font-bold text-gray-800">{link.submissionsCount} responses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" /> Policy:
                      </span>
                      <span className="text-gray-700">{link.expiryOption}</span>
                    </div>
                  </div>
                </div>

                {/* Footer preview action */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenRespondentModal(link)}
                    className="w-full py-1.5 px-3 rounded-lg border border-[#0E7C66] text-[#0E7C66] hover:bg-emerald-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Test Respondent View</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
