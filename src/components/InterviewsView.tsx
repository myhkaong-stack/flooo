import React, { useState } from 'react';
import {
  FileQuestion,
  Search,
  Filter,
  Plus,
  Play,
  Share2,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { InterviewGuide, SystemType } from '../types';

interface InterviewsViewProps {
  guides: InterviewGuide[];
  onSelectGuide: (guide: InterviewGuide) => void;
  onLaunchSession: (guide: InterviewGuide) => void;
  onCreateNew: () => void;
  onDeleteGuide: (id: string) => void;
  onDuplicateGuide: (guide: InterviewGuide) => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  guides,
  onLaunchSession,
  onCreateNew,
  onDeleteGuide,
  onDuplicateGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredGuides = guides.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.objective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSystem = selectedSystem === 'all' || g.system === selectedSystem;
    const matchesStatus = selectedStatus === 'all' || g.status === selectedStatus;
    return matchesSearch && matchesSystem && matchesStatus;
  });

  const handleCopyLink = (guide: InterviewGuide) => {
    const url = `${window.location.origin}#share-${guide.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(guide.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div id="interviews-view" className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Header with Search and New Guide CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Sora'] text-gray-900">
            Interview Guides ({guides.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Structured protocols that power live elicitation sessions and asynchronous links.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#0E7C66]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Guide</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by title, role, system, or objective..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#0E7C66] bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-hidden focus:border-[#0E7C66]"
          >
            <option value="all">All Systems</option>
            <option value="CRM">CRM</option>
            <option value="ERP">ERP</option>
            <option value="Web App">Web App</option>
            <option value="Healthcare">Healthcare</option>
            <option value="E-Learning">E-Learning</option>
            <option value="Generic">Generic</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-hidden focus:border-[#0E7C66]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 p-8">
          <FileQuestion className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800">No interview guides found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a fresh 5-pillar interview guide.
          </p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-3.5 py-1.5 bg-[#0E7C66] text-white text-xs font-semibold rounded-lg"
          >
            Create Guide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs hover:shadow-xs hover:border-[#0E7C66]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-[#0E7C66] border border-emerald-200">
                    {guide.system}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      guide.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {guide.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-['Sora'] font-bold text-gray-900 text-sm leading-snug group-hover:text-[#0E7C66] transition-colors">
                  {guide.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {guide.objective}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target Role:</span>
                    <span className="font-semibold text-gray-800">{guide.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pillar Questions:</span>
                    <span className="font-semibold text-gray-800">{guide.questions.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protocol:</span>
                    <span className="font-semibold capitalize text-gray-800">
                      {guide.interviewType.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onLaunchSession(guide)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Session</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyLink(guide)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy share link"
                  >
                    {copiedId === guide.id ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDuplicateGuide(guide)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Duplicate guide"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteGuide(guide.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete guide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
