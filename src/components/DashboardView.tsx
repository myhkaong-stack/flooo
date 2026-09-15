import React from 'react';
import {
  Users,
  FileQuestion,
  FileCheck2,
  TrendingUp,
  ArrowUpRight,
  Play,
  UploadCloud,
  Share2,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab, Campaign, InterviewGuide } from '../types';

interface DashboardViewProps {
  campaigns: Campaign[];
  guides: InterviewGuide[];
  onSelectTab: (tab: ActiveTab) => void;
  openFileTransfer: () => void;
  onLaunchGuideSession: (guide: InterviewGuide) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  campaigns,
  guides,
  onSelectTab,
  openFileTransfer,
  onLaunchGuideSession,
}) => {
  const telemetryStats = [
    {
      id: 'telemetry-responses',
      label: 'Responses Collected',
      value: '142',
      change: '+18% this week',
      icon: Users,
      trend: 'up',
      tone: 'emerald',
    },
    {
      id: 'telemetry-guides',
      label: 'Active Guides',
      value: guides.filter((g) => g.status === 'active').length.toString(),
      change: '5 Core Pillars',
      icon: FileQuestion,
      trend: 'neutral',
      tone: 'teal',
    },
    {
      id: 'telemetry-reports',
      label: 'Requirements Reports',
      value: '9',
      change: '38 FRs generated',
      icon: FileCheck2,
      trend: 'up',
      tone: 'blue',
    },
    {
      id: 'telemetry-sentiment',
      label: 'Positive Sentiment Mix',
      value: '71%',
      change: '14% Friction / Pain',
      icon: TrendingUp,
      trend: 'up',
      tone: 'amber',
    },
  ];

  return (
    <div id="dashboard-view" className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* File Transfer Quick Notification Banner */}
      <div className="bg-gradient-to-r from-[#0E7C66] via-[#0B6654] to-teal-900 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold tracking-wide backdrop-blur-xs">
            <Sparkles className="w-3 h-3" /> ReqSynth AI Transferred Successfully
          </div>
          <h2 className="text-xl font-bold font-['Sora'] tracking-tight">
            Turn every stakeholder conversation into structured requirements
          </h2>
          <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
            Your project preview from Readdy is active here. You can also transfer files (audio recordings, meeting transcripts, or JSON guides) directly into this app for instant analysis!
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="dashboard-banner-transfer-btn"
            onClick={openFileTransfer}
            className="px-3.5 py-2 rounded-lg bg-white text-[#0E7C66] hover:bg-white/90 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Transfer My File</span>
          </button>
          <button
            id="dashboard-banner-builder-btn"
            onClick={() => onSelectTab('guide-builder')}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20"
          >
            Create Guide
          </button>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {telemetryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              id={stat.id}
              className="p-5 bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg bg-[#0E7C66]/10 text-[#0E7C66] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-['Sora'] text-gray-900">{stat.value}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Campaign Pipeline & Sentiment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Pipeline (2 Columns on large) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-['Sora'] font-bold text-gray-900 text-base">Campaign Pipeline</h3>
                <p className="text-xs text-gray-500">Live stakeholder studies and completion quota.</p>
              </div>
              <button
                onClick={() => onSelectTab('interviews')}
                className="text-xs font-semibold text-[#0E7C66] hover:text-[#0B6654] flex items-center gap-1"
              >
                <span>View All Guides</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-1 font-semibold">Campaign</th>
                    <th className="pb-3 font-semibold">System</th>
                    <th className="pb-3 font-semibold">Progress</th>
                    <th className="pb-3 font-semibold">Sentiment</th>
                    <th className="pb-3 pr-1 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaigns.map((camp) => {
                    const pct = Math.round((camp.progress / camp.target) * 100);
                    return (
                      <tr key={camp.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 pl-1">
                          <p className="font-semibold text-gray-900">{camp.title}</p>
                          <span className="text-[11px] text-gray-400">Target: {camp.target} participants</span>
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                            {camp.system}
                          </span>
                        </td>
                        <td className="py-3.5 w-40">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0E7C66] h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-gray-700">{pct}%</span>
                          </div>
                          <span className="text-[10px] text-gray-400">{camp.progress} of {camp.target} interviews</span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              camp.sentiment === 'positive'
                                ? 'bg-emerald-50 text-emerald-700'
                                : camp.sentiment === 'negative'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                camp.sentiment === 'positive'
                                  ? 'bg-emerald-500'
                                  : camp.sentiment === 'negative'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500'
                              }`}
                            />
                            <span className="capitalize">{camp.sentiment}</span>
                          </span>
                        </td>
                        <td className="py-3.5 pr-1 text-right">
                          <button
                            onClick={() => onSelectTab('live-session')}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#0E7C66] hover:bg-[#0E7C66]/10 transition-colors"
                            title="Start interview for this campaign"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sentiment Mix & Quick Actions */}
        <div className="space-y-6">
          {/* Sentiment Mix Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
            <h3 className="font-['Sora'] font-bold text-gray-900 text-base">Sentiment Mix</h3>
            <p className="text-xs text-gray-500 mb-4">Across all 142 collected participant responses.</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Positive
                  </span>
                  <span>71% (101 responses)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '71%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                  <span className="text-amber-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Neutral
                  </span>
                  <span>15% (21 responses)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-700">
                  <span className="text-rose-700 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Friction / Pain Points
                  </span>
                  <span>14% (20 responses)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Core Workflows Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
            <h3 className="font-['Sora'] font-bold text-gray-900 text-base">Quick Actions</h3>
            <p className="text-xs text-gray-500 mb-3">Jump into the core elicitation workflows.</p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="qa-new-guide"
                onClick={() => onSelectTab('guide-builder')}
                className="p-3 text-left rounded-lg border border-gray-200 hover:border-[#0E7C66] hover:bg-emerald-50/30 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-[#0E7C66] mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-gray-900">New AI Guide</p>
                <p className="text-[10px] text-gray-500">5-pillar generator</p>
              </button>

              <button
                id="qa-live-session"
                onClick={() => onSelectTab('live-session')}
                className="p-3 text-left rounded-lg border border-gray-200 hover:border-[#0E7C66] hover:bg-emerald-50/30 transition-all group"
              >
                <Play className="w-4 h-4 text-rose-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-gray-900">Live Room</p>
                <p className="text-[10px] text-gray-500">Audio & transcription</p>
              </button>

              <button
                id="qa-transfer-file"
                onClick={openFileTransfer}
                className="p-3 text-left rounded-lg border border-gray-200 hover:border-[#0E7C66] hover:bg-emerald-50/30 transition-all group"
              >
                <UploadCloud className="w-4 h-4 text-teal-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-gray-900">Transfer Files</p>
                <p className="text-[10px] text-gray-500">Import audio/notes</p>
              </button>

              <button
                id="qa-export-reports"
                onClick={() => onSelectTab('reports')}
                className="p-3 text-left rounded-lg border border-gray-200 hover:border-[#0E7C66] hover:bg-emerald-50/30 transition-all group"
              >
                <Download className="w-4 h-4 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-gray-900">Requirements</p>
                <p className="text-[10px] text-gray-500">FR / NFR matrix</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interview Guides */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-['Sora'] font-bold text-gray-900 text-base">Recent Guides & Studies</h3>
            <p className="text-xs text-gray-500">Guides built to elicit workflow, friction, and feature desires.</p>
          </div>
          <button
            onClick={() => onSelectTab('interviews')}
            className="text-xs font-semibold text-[#0E7C66] hover:text-[#0B6654]"
          >
            Manage All ({guides.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guides.slice(0, 3).map((guide) => (
            <div
              key={guide.id}
              className="p-4 rounded-xl border border-gray-200/90 hover:border-[#0E7C66]/50 bg-[#FBFDFB] flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded bg-white text-gray-700 font-semibold border border-gray-200 text-[11px]">
                    {guide.system} &bull; {guide.role}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      guide.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {guide.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm group-hover:text-[#0E7C66] transition-colors line-clamp-1">
                  {guide.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {guide.objective}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">
                  {guide.questions.length} questions across pillars
                </span>
                <button
                  onClick={() => onLaunchGuideSession(guide)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0E7C66] hover:text-[#0B6654]"
                >
                  <span>Launch</span>
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
