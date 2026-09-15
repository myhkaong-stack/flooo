import React, { useState } from 'react';
import {
  X,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Volume2,
} from 'lucide-react';
import { FeedbackLink, InterviewGuide } from '../types';

interface PublicInterviewModalProps {
  link: FeedbackLink | null;
  guide: InterviewGuide | null;
  onClose: () => void;
  onSubmitResponses: () => void;
}

export const PublicInterviewModal: React.FC<PublicInterviewModalProps> = ({
  link,
  guide,
  onClose,
  onSubmitResponses,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [participantName, setParticipantName] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!link || !guide) return null;

  const questions = guide.questions;
  const currentQ = questions[currentIdx];

  const handleVoiceRecordSim = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]:
          'I use this workflow daily. The main issue is that data updates do not synchronize across our mobile devices immediately, causing duplicated efforts.',
      }));
    }, 2000);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setSubmitted(true);
      onSubmitResponses();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-['Sora'] font-bold text-xs text-gray-900">
              ReqSynth Shared Interview &bull; /f/{link.token}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            {/* Guide Info */}
            <div className="bg-[#FBFDFB] p-3.5 rounded-xl border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {guide.system} &bull; {guide.role}
              </span>
              <h3 className="font-['Sora'] font-bold text-gray-900 text-sm">{guide.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{guide.objective}</p>
            </div>

            {/* Respondent Name (first question only) */}
            {currentIdx === 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
                />
              </div>
            )}

            {/* Current Question */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                <span>Pillar: {currentQ?.pillar}</span>
                <span>Question {currentIdx + 1} of {questions.length}</span>
              </div>
              <h4 className="font-['Sora'] font-bold text-gray-900 text-sm leading-relaxed">
                {currentQ?.text}
              </h4>
            </div>

            {/* Answer Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">Answer your way: Type or Speak</span>
                <button
                  type="button"
                  onClick={handleVoiceRecordSim}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-50 text-[#0E7C66] hover:bg-emerald-100'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? 'Listening…' : 'Record Voice'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={answers[currentQ?.id] || ''}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [currentQ.id]: e.target.value,
                  })
                }
                placeholder="Type your response here..."
                className="w-full p-3 text-xs rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#0E7C66] bg-gray-50/50"
              />
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <span>{currentIdx === questions.length - 1 ? 'Submit Responses' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-['Sora'] font-bold text-gray-900 text-base">Thank you!</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Your responses have been recorded and delivered directly to the requirements synthesis workspace.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
