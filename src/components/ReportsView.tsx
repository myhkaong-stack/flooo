import React, { useState } from 'react';
import {
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Share2,
  Calendar,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Code,
  Sparkles,
} from 'lucide-react';
import { CompletedSession } from '../types';

interface ReportsViewProps {
  sessions: CompletedSession[];
  activeSession: CompletedSession | null;
  onSelectSession: (session: CompletedSession) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  sessions,
  activeSession: propActiveSession,
  onSelectSession,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    propActiveSession?.id || sessions[0]?.id || ''
  );
  const [showRawTranscripts, setShowRawTranscripts] = useState(false);

  const activeSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0] || null;

  if (!activeSession) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 p-8 max-w-4xl mx-auto">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-gray-800">No synthesized reports available</p>
        <p className="text-xs text-gray-500 mt-1">
          Complete an interview in the Live Session room or import transcripts to generate a requirements synthesis.
        </p>
      </div>
    );
  }

  const exportMarkdown = () => {
    const md = `# Requirements Synthesis Report: ${activeSession.guideTitle}
**Participant:** ${activeSession.participantName} (${activeSession.participantRole})  
**Conducted:** ${new Date(activeSession.conductedAt).toLocaleDateString()}  
**Overall Sentiment:** ${activeSession.overallSentiment}

## Executive Summary
${activeSession.executiveSummary}

## Extracted Pain Points & Friction
${activeSession.painPoints.map((p) => `- [${p.severity}] ${p.point} (${p.pillar})`).join('\n')}

## Functional Requirements (FR)
${activeSession.functionalRequirements
  .map((fr) => `### ${fr.code}: ${fr.title} [Priority: ${fr.priority}]\n${fr.description}\n`)
  .join('\n')}

## Non-Functional Requirements (NFR)
${activeSession.nonFunctionalRequirements
  .map((nfr) => `### ${nfr.code}: ${nfr.title} [${nfr.category}]\n${nfr.description}\n`)
  .join('\n')}
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Requirements_Synthesis_${activeSession.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = 'Code,Title,Type,Priority/Category,Description\n';
    const frRows = activeSession.functionalRequirements
      .map(
        (fr) =>
          `"${fr.code}","${fr.title}","Functional","${fr.priority}","${fr.description.replace(/"/g, '""')}"`
      )
      .join('\n');
    const nfrRows = activeSession.nonFunctionalRequirements
      .map(
        (nfr) =>
          `"${nfr.code}","${nfr.title}","Non-Functional","${nfr.category}","${nfr.description.replace(/"/g, '""')}"`
      )
      .join('\n');
    const csvContent = header + frRows + '\n' + nfrRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Requirements_Matrix_${activeSession.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(activeSession, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ReqSynth_Report_${activeSession.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reports-view" className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Session Switcher & Export Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0E7C66] border border-emerald-200 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <select
              value={activeSession.id}
              onChange={(e) => {
                setSelectedSessionId(e.target.value);
                const s = sessions.find((item) => item.id === e.target.value);
                if (s) onSelectSession(s);
              }}
              className="font-['Sora'] font-bold text-gray-900 text-base bg-transparent border-0 cursor-pointer focus:outline-hidden pr-2"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.guideTitle} ({s.participantName})
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {activeSession.participantName} ({activeSession.participantRole})
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(activeSession.conductedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportMarkdown}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            <span>Markdown</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV Matrix</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3.5 py-1.5 rounded-lg bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-3">
        <h3 className="font-['Sora'] font-bold text-gray-900 text-sm uppercase tracking-wider text-xs">
          Executive Synthesis & Stakeholder Findings
        </h3>
        <p className="text-xs text-gray-700 leading-relaxed bg-[#FBFDFB] p-4 rounded-lg border border-gray-100 font-medium">
          {activeSession.executiveSummary}
        </p>
      </div>

      {/* Pain Points & Friction Extracted */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-['Sora'] font-bold text-gray-900 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Identified Pain Points ({activeSession.painPoints.length})</span>
          </h3>
          <span className="text-[11px] text-gray-400">Classified by elicitation pillar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeSession.painPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-gray-200 bg-[#FBFDFB] flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {item.pillar}
                </span>
                <p className="text-xs text-gray-800 font-medium leading-relaxed">
                  {item.point}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  item.severity === 'High'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Functional Requirements (FR) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Sora'] font-bold text-gray-900 text-sm">
              Functional Requirements Specification (FR)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated translation of user friction and workflow wishes into IEEE-compliant requirements.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0E7C66]">
            {activeSession.functionalRequirements.length} Specifications
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-1 font-semibold w-24">Req ID</th>
                <th className="pb-3 font-semibold w-48">Feature Title</th>
                <th className="pb-3 font-semibold w-24">Priority</th>
                <th className="pb-3 font-semibold">Specification Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeSession.functionalRequirements.map((fr) => (
                <tr key={fr.code} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 pl-1 font-mono font-bold text-[#0E7C66]">
                    {fr.code}
                  </td>
                  <td className="py-3 font-semibold text-gray-900">{fr.title}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        fr.priority === 'Must'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {fr.priority} Have
                    </span>
                  </td>
                  <td className="py-3 text-gray-600 leading-relaxed font-medium">
                    {fr.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Non-Functional Requirements (NFR) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <h3 className="font-['Sora'] font-bold text-gray-900 text-sm">
          Non-Functional Requirements (NFR)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeSession.nonFunctionalRequirements.map((nfr) => (
            <div
              key={nfr.code}
              className="p-4 rounded-lg border border-gray-200 bg-[#FBFDFB] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-indigo-600">{nfr.code}</span>
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  {nfr.category}
                </span>
              </div>
              <h4 className="text-xs font-bold text-gray-900">{nfr.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{nfr.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Transcripts Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
        <button
          onClick={() => setShowRawTranscripts(!showRawTranscripts)}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-800"
        >
          <span>Audited Participant Transcripts ({activeSession.answers.length} Answers)</span>
          {showRawTranscripts ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {showRawTranscripts && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            {activeSession.answers.map((ans, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-gray-500 font-semibold text-[11px]">
                  <span>Pillar: {ans.pillar}</span>
                  <span className="capitalize text-emerald-700 font-bold">{ans.sentiment} sentiment</span>
                </div>
                <p className="font-bold text-gray-900">{ans.questionText}</p>
                <p className="text-gray-700 leading-relaxed font-mono text-[11px] bg-white p-2.5 rounded border border-gray-200/70">
                  &ldquo;{ans.transcript}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
