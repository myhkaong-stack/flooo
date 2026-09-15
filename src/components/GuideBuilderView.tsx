import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle,
  Play,
  Save,
  ArrowRight,
  RefreshCw,
  GitBranch,
  Target,
  FileCheck,
  FileSpreadsheet,
} from 'lucide-react';
import {
  InterviewGuide,
  InterviewQuestion,
  InterviewType,
  PillarKey,
  SystemType,
} from '../types';
import {
  INTERVIEW_TYPES,
  PILLARS,
  SYSTEM_OPTIONS,
  SYSTEM_ROLES,
  generateQuestionsForGuide,
} from '../data/questionTemplates';

interface GuideBuilderViewProps {
  onSaveGuide: (guide: InterviewGuide) => void;
  onLaunchSession: (guide: InterviewGuide) => void;
}

export const GuideBuilderView: React.FC<GuideBuilderViewProps> = ({
  onSaveGuide,
  onLaunchSession,
}) => {
  const [title, setTitle] = useState('');
  const [system, setSystem] = useState<SystemType>('Web App');
  const [customRole, setCustomRole] = useState('');
  const [selectedRolePreset, setSelectedRolePreset] = useState<string>('Product Manager');
  const [interviewType, setInterviewType] = useState<InterviewType>('structured');
  const [objective, setObjective] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() =>
    generateQuestionsForGuide('Web App', 'Product Manager', 'structured', '')
  );
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionPillar, setNewQuestionPillar] = useState<PillarKey>('Current Workflow');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const activeRole = customRole.trim() || selectedRolePreset;

  const handleSystemChange = (newSys: SystemType) => {
    setSystem(newSys);
    const presets = SYSTEM_ROLES[newSys];
    if (presets && presets.length > 0) {
      setSelectedRolePreset(presets[0]);
    }
  };

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateQuestionsForGuide(
        system,
        activeRole,
        interviewType,
        objective
      );
      setQuestions(generated);
      if (!title) {
        setTitle(`${system} ${activeRole} Requirements Elicitation`);
      }
      setIsGenerating(false);
      showNotice('Generated tailored 5-pillar question bank!');
    }, 400);
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ: InterviewQuestion = {
      id: `q-${Date.now()}`,
      pillar: newQuestionPillar,
      text: newQuestionText.trim(),
    };
    setQuestions([...questions, newQ]);
    setNewQuestionText('');
    showNotice('Custom question added to pillar bank.');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    const finalTitle = title.trim() || `${system} ${activeRole} Elicitation Guide`;
    const newGuide: InterviewGuide = {
      id: `guide-${Date.now()}`,
      title: finalTitle,
      system,
      role: activeRole,
      interviewType,
      objective: objective.trim() || 'Elicit user workflow, friction, and software requirements.',
      status: 'active',
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseCount: 0,
    };
    onSaveGuide(newGuide);
  };

  const handleLaunchNow = () => {
    const finalTitle = title.trim() || `${system} ${activeRole} Elicitation Guide`;
    const newGuide: InterviewGuide = {
      id: `guide-${Date.now()}`,
      title: finalTitle,
      system,
      role: activeRole,
      interviewType,
      objective: objective.trim() || 'Elicit user workflow, friction, and software requirements.',
      status: 'active',
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseCount: 0,
    };
    onLaunchSession(newGuide);
  };

  // Group questions by pillar
  const groupedQuestions = questions.reduce<Record<string, InterviewQuestion[]>>((acc, q) => {
    acc[q.pillar] = acc[q.pillar] || [];
    acc[q.pillar].push(q);
    return acc;
  }, {});

  return (
    <div id="guide-builder-view" className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Banner Notice */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#0E7C66]" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900">&times;</button>
        </div>
      )}

      {/* Guide Metadata / Setup Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
        <div>
          <h2 className="text-lg font-bold font-['Sora'] text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0E7C66]" />
            <span>Interview Setup & System Classification</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Pick the information system, role, and conversation structure to construct an automated question bank.
          </p>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Guide Title
          </label>
          <input
            id="guide-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`e.g. ${system} ${activeRole} Operational Audit`}
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66] focus:ring-1 focus:ring-[#0E7C66]"
          />
        </div>

        {/* System Classification Options */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            1. Information System Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SYSTEM_OPTIONS.map((opt) => {
              const isSelected = system === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  id={`sys-opt-${opt.value}`}
                  onClick={() => handleSystemChange(opt.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-[#0E7C66] bg-[#0E7C66]/5 ring-1 ring-[#0E7C66]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-900">{opt.label}</p>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-tight">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Role & Interview Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          {/* Interviewee Role */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              2. Interviewee Role
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {(SYSTEM_ROLES[system] || []).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSelectedRolePreset(preset);
                    setCustomRole('');
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    selectedRolePreset === preset && !customRole
                      ? 'bg-[#0E7C66] text-white font-medium shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              id="guide-role-input"
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Or enter custom role (e.g. Inventory Analyst)"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
            />
          </div>

          {/* Interview Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              3. Conversation Protocol
            </label>
            <div className="space-y-1.5">
              {INTERVIEW_TYPES.map((type) => {
                const isSelected = interviewType === type.value;
                return (
                  <label
                    key={type.value}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0E7C66] bg-emerald-50/40 ring-1 ring-[#0E7C66]'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interviewType"
                      value={type.value}
                      checked={isSelected}
                      onChange={() => setInterviewType(type.value)}
                      className="mt-0.5 text-[#0E7C66] focus:ring-[#0E7C66]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{type.label}</span>
                        <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded">
                          {type.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{type.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Objective & Generate CTA */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            4. Core Research Objective / Goal (Optional)
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              id="guide-objective-input"
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. Uncover inventory sync delays, data loss during shift handoffs, and report export needs"
              className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
            />
            <button
              id="generate-guide-btn"
              type="button"
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="px-4 py-2 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#0E7C66]/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Questions…' : 'Generate 5-Pillar Bank'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question Bank Display Across the 5 Pillars */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-['Sora'] font-bold text-gray-900 text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0E7C66]" />
              <span>Tailored Question Bank ({questions.length} Questions)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Structured across workflow, pain points, expectations, limitations, and desired features.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="save-guide-action-btn"
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-gray-500" />
              <span>Save Guide</span>
            </button>
            <button
              id="launch-guide-session-btn"
              onClick={handleLaunchNow}
              className="px-4 py-1.5 rounded-lg bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Session</span>
            </button>
          </div>
        </div>

        {/* Questions grouped by pillar */}
        <div className="space-y-6">
          {(Object.entries(groupedQuestions) as [string, InterviewQuestion[]][]).map(([pillarName, qList]) => {
            const pillarMeta = PILLARS.find((p) => p.key === pillarName);
            return (
              <div key={pillarName} className="rounded-xl border border-gray-200/80 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 font-['Sora']">
                      {pillarName}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-white border border-gray-200 px-2 py-0.2 rounded-full">
                      {qList.length} questions
                    </span>
                  </div>
                  {pillarMeta && (
                    <span className="text-[11px] text-gray-400 italic hidden md:inline">
                      {pillarMeta.hint}
                    </span>
                  )}
                </div>

                <div className="divide-y divide-gray-100 bg-white">
                  {qList.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 flex items-start justify-between gap-3 hover:bg-gray-50/60 transition-colors group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-gray-800 leading-relaxed font-medium">
                          {q.text}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        title="Remove question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom question inline */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-800 mb-2">Add Custom Question to Pillar</p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <select
              value={newQuestionPillar}
              onChange={(e) => setNewQuestionPillar(e.target.value as PillarKey)}
              className="px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white focus:outline-hidden focus:border-[#0E7C66]"
            >
              {PILLARS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.key}
                </option>
              ))}
              <option value="Follow-Up Probes">Follow-Up Probes</option>
              <option value="Open Exploration">Open Exploration</option>
            </select>
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Type your question prompt..."
              className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddQuestion();
              }}
            />
            <button
              onClick={handleAddQuestion}
              className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
