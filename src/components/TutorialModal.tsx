import React from 'react';
import {
  X,
  Layers,
  Sparkles,
  Radio,
  FileCheck,
  UploadCloud,
  CheckCircle,
} from 'lucide-react';
import { PILLARS } from '../data/questionTemplates';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToBuilder: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onGoToBuilder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0E7C66] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Sora'] font-bold text-gray-900 text-sm">
                ReqSynth AI Methodology
              </h3>
              <p className="text-[11px] text-gray-500">The 5 Core Pillars of Software Elicitation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
          <p>
            ReqSynth AI automates the transition from open stakeholder conversations into rigorous, IEEE-compliant functional (FR) and non-functional (NFR) requirements using 5 structured elicitation pillars:
          </p>

          <div className="space-y-2.5">
            {PILLARS.map((p, idx) => (
              <div key={p.key} className="p-3 rounded-lg border border-gray-100 bg-[#FBFDFB] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0E7C66]/10 text-[#0E7C66] font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs font-['Sora']">{p.key}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{p.hint}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
            <h4 className="font-bold text-xs">File Transfer & Import Support</h4>
            <p className="text-[11px] leading-snug">
              Have existing stakeholder recordings or meeting transcripts? Drop them into the Transfer Hub to automatically parse statements and map them into the 5 pillars without manual re-typing.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
          >
            Close Guide
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToBuilder();
            }}
            className="px-4 py-2 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg shadow-sm"
          >
            Start Building Guide
          </button>
        </div>
      </div>
    </div>
  );
};
