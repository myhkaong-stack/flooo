import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Square,
  Pause,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Volume2,
  FileCheck2,
  Tag,
  Clock,
  User,
  Building,
} from 'lucide-react';
import {
  CompletedSession,
  InterviewAnswer,
  InterviewGuide,
  SentimentType,
} from '../types';

interface LiveSessionViewProps {
  guides: InterviewGuide[];
  selectedGuide: InterviewGuide | null;
  onCompleteSession: (session: CompletedSession) => void;
}

export const LiveSessionView: React.FC<LiveSessionViewProps> = ({
  guides,
  selectedGuide: initialGuide,
  onCompleteSession,
}) => {
  const [guide, setGuide] = useState<InterviewGuide>(
    initialGuide || guides[0] || null
  );

  useEffect(() => {
    if (initialGuide) {
      setGuide(initialGuide);
    }
  }, [initialGuide]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [participantName, setParticipantName] = useState('Alex Rivera');
  const [participantRole, setParticipantRole] = useState(guide ? guide.role : 'Operations Lead');
  const [participantCompany, setParticipantCompany] = useState('Apex Global Logistics');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(15);
  const [transcriptText, setTranscriptText] = useState('');
  const [answers, setAnswers] = useState<Record<string, InterviewAnswer>>({});
  const [currentSentiment, setCurrentSentiment] = useState<SentimentType>('neutral');
  const [detectedPainPoints, setDetectedPainPoints] = useState<string[]>([]);
  const [customPainPoint, setCustomPainPoint] = useState('');

  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const questions = guide?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        // Animate audio waveform bar
        setAudioLevel(Math.floor(Math.random() * 60) + 20);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Load existing answer when switching question
  useEffect(() => {
    if (currentQuestion) {
      const existing = answers[currentQuestion.id];
      if (existing) {
        setTranscriptText(existing.transcript);
        setCurrentSentiment(existing.sentiment);
        setDetectedPainPoints(existing.painPoints || []);
      } else {
        setTranscriptText('');
        setCurrentSentiment('neutral');
        setDetectedPainPoints([]);
      }
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Handle Speech Recognition setup if available
  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscriptText((prev) => (prev ? `${prev} ${text}` : text));
        };

        recognition.onerror = () => {
          // Fallback gracefully
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition not available in this container environment');
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    startSpeechRecognition();
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    stopSpeechRecognition();
  };

  const handleSaveCurrentAnswer = () => {
    if (!currentQuestion) return;
    const answerObj: InterviewAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      pillar: currentQuestion.pillar,
      transcript: transcriptText,
      sentiment: currentSentiment,
      painPoints: detectedPainPoints,
      keyInsight: transcriptText.length > 20 ? transcriptText.slice(0, 90) + '…' : undefined,
    };
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerObj,
    }));
  };

  const handleNext = () => {
    handleSaveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    handleSaveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAddPainPoint = () => {
    if (!customPainPoint.trim()) return;
    setDetectedPainPoints([...detectedPainPoints, customPainPoint.trim()]);
    setCustomPainPoint('');
  };

  const handleSimulateAudioResponse = () => {
    setIsRecording(true);
    let sample = '';
    if (currentQuestion.pillar === 'Pain Points') {
      sample =
        "The inventory reconciliation takes almost two hours every evening. If someone updates a sku on the desktop client, the mobile scanner doesn't pick it up until the midnight cron job runs, which leads to double-shipping.";
      setCurrentSentiment('negative');
      setDetectedPainPoints(['Slow reconciliation (2 hours daily)', 'Mobile scanner sync delay']);
    } else if (currentQuestion.pillar === 'Current Workflow') {
      sample =
        "We log into the system every morning at 8:00 AM, export the daily orders into CSV, and then manually sort them by priority before printing shipping tags.";
      setCurrentSentiment('neutral');
    } else if (currentQuestion.pillar === 'Desired Features') {
      sample =
        "We really need an instant alert on the mobile app when inventory levels drop below threshold, plus one-click barcode batch verification.";
      setCurrentSentiment('positive');
      setDetectedPainPoints([]);
    } else {
      sample =
        "Overall the system works well for standard entry, but we need tighter integration with our third-party warehouse logistics tools.";
      setCurrentSentiment('neutral');
    }
    setTranscriptText(sample);
  };

  const handleCompleteInterview = () => {
    handleSaveCurrentAnswer();

    const answerList: InterviewAnswer[] = Object.values(answers);
    const painPointsGathered = answerList.flatMap((a) =>
      a.painPoints.map((p) => ({
        point: p,
        severity: 'High' as const,
        pillar: a.pillar,
      }))
    );

    const completedSession: CompletedSession = {
      id: `session-${Date.now()}`,
      guideId: guide.id,
      guideTitle: guide.title,
      participantName,
      participantRole,
      conductedAt: new Date().toISOString(),
      durationSeconds: recordingSeconds > 0 ? recordingSeconds : 480,
      overallSentiment: currentSentiment,
      answers: answerList,
      executiveSummary: `Stakeholder interview conducted with ${participantName} (${participantRole} at ${participantCompany}). Participant detailed core operational friction in ${guide.system}, highlighting automated sync and batch validation as critical priorities.`,
      painPoints:
        painPointsGathered.length > 0
          ? painPointsGathered
          : [
              {
                point: 'Manual data re-entry and verification delays',
                severity: 'High',
                pillar: 'Pain Points',
              },
              {
                point: 'Lack of real-time mobile push notifications',
                severity: 'Medium',
                pillar: 'System Limitations',
              },
            ],
      functionalRequirements: [
        {
          code: 'FR-01',
          title: 'Automated Sync & Event Broadcasting',
          description: `The ${guide.system} shall push state updates to mobile clients within 2 seconds.`,
          priority: 'Must',
        },
        {
          code: 'FR-02',
          title: 'Batch Discrepancy Reporting',
          description: `The system shall flag mismatched records automatically before shift signoff.`,
          priority: 'Must',
        },
      ],
      nonFunctionalRequirements: [
        {
          code: 'NFR-01',
          title: 'Transaction Response Latency',
          category: 'Performance',
          description: 'Record lookups must render in under 800ms over cellular/Wi-Fi.',
        },
      ],
    };

    onCompleteSession(completedSession);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  if (!guide) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-sm font-bold text-gray-800">No guide selected for live session</p>
        <p className="text-xs text-gray-500 mt-1">Please select an interview guide first.</p>
      </div>
    );
  }

  return (
    <div id="live-session-view" className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Session Top Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-['Sora'] text-gray-900">{guide.title}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {guide.system}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Target: {guide.role} &bull; {questions.length} questions across 5 pillars
            </p>
          </div>
        </div>

        {/* Participant & Timer metadata */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-mono font-bold text-gray-800">{formatTime(recordingSeconds)}</span>
          </div>

          <button
            id="finish-session-btn"
            onClick={handleCompleteInterview}
            className="px-4 py-2 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#0E7C66]/20 transition-all flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Complete & Synthesize Requirements</span>
          </button>
        </div>
      </div>

      {/* Participant Info Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-gray-200 text-xs">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Participant Name"
            className="w-full bg-transparent font-semibold text-gray-800 focus:outline-hidden"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={participantRole}
            onChange={(e) => setParticipantRole(e.target.value)}
            placeholder="Job Role / Title"
            className="w-full bg-transparent text-gray-700 focus:outline-hidden"
          />
        </div>
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={participantCompany}
            onChange={(e) => setParticipantCompany(e.target.value)}
            placeholder="Organization / Department"
            className="w-full bg-transparent text-gray-700 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Current Question & Recorder Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question Prompt & Live Transcript */}
        <div className="lg:col-span-2 space-y-4">
          {/* Question Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0E7C66]/10 text-[#0E7C66] border border-[#0E7C66]/20">
                Pillar: {currentQuestion?.pillar || 'General'}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            <h3 className="text-lg font-bold font-['Sora'] text-gray-900 leading-snug">
              {currentQuestion?.text || 'No question found'}
            </h3>

            {/* Audio Recording Controls */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    id="record-start-btn"
                    onClick={handleStartRecording}
                    className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-rose-600/25"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Record Audio</span>
                  </button>
                ) : (
                  <>
                    <button
                      id="record-pause-btn"
                      onClick={handlePauseResume}
                      className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      id="record-stop-btn"
                      onClick={handleStopRecording}
                      className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </button>
                  </>
                )}

                {/* Simulated Audio Waveform */}
                {isRecording && !isPaused && (
                  <div className="flex items-center gap-1 ml-2">
                    <span className="w-1 bg-rose-500 rounded-full animate-pulse h-4" />
                    <span className="w-1 bg-rose-500 rounded-full animate-pulse h-6" />
                    <span className="w-1 bg-rose-500 rounded-full animate-pulse h-3" />
                    <span className="w-1 bg-rose-500 rounded-full animate-pulse h-5" />
                    <span className="text-[11px] font-mono text-rose-600 font-bold ml-1">Live Audio</span>
                  </div>
                )}
              </div>

              {/* Sample audio filler button for test demo */}
              <button
                onClick={handleSimulateAudioResponse}
                className="text-[11px] font-semibold text-[#0E7C66] hover:underline flex items-center gap-1"
                title="Fill sample response for instant testing"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Stakeholder Response</span>
              </button>
            </div>
          </div>

          {/* Live Transcript Box */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#0E7C66]" />
                <span>Participant Response / Live Transcript</span>
              </label>
              <span className="text-[11px] text-gray-400">
                {transcriptText ? `${transcriptText.split(' ').length} words` : 'Waiting for voice or text'}
              </span>
            </div>

            <textarea
              id="live-transcript-input"
              rows={5}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Speak using the microphone above, or type participant notes directly here..."
              className="w-full p-3.5 text-xs text-gray-800 rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#0E7C66] leading-relaxed bg-gray-50/40"
            />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Save Answer' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Sentiment & Pain Point Extraction */}
        <div className="space-y-4">
          {/* Sentiment Tagger */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Response Sentiment
            </h4>
            <p className="text-[11px] text-gray-500">
              Classify interviewee emotion regarding this workflow item.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCurrentSentiment('positive')}
                className={`py-2 px-1 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  currentSentiment === 'positive'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Positive</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentSentiment('neutral')}
                className={`py-2 px-1 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  currentSentiment === 'neutral'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Meh className="w-4 h-4 text-amber-600" />
                <span>Neutral</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentSentiment('negative')}
                className={`py-2 px-1 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  currentSentiment === 'negative'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ThumbsDown className="w-4 h-4 text-rose-600" />
                <span>Friction</span>
              </button>
            </div>
          </div>

          {/* Pain Points Extractor */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Tagged Pain Points</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <p className="text-[11px] text-gray-500">
              Extracted friction items will be synthesized into functional requirements.
            </p>

            <div className="space-y-1.5">
              {detectedPainPoints.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No friction points tagged yet.</p>
              ) : (
                detectedPainPoints.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between"
                  >
                    <span>{p}</span>
                    <button
                      onClick={() =>
                        setDetectedPainPoints(detectedPainPoints.filter((_, i) => i !== idx))
                      }
                      className="text-rose-500 hover:text-rose-800 font-bold ml-2"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex gap-1.5">
              <input
                type="text"
                value={customPainPoint}
                onChange={(e) => setCustomPainPoint(e.target.value)}
                placeholder="Tag a pain point..."
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddPainPoint();
                }}
              />
              <button
                onClick={handleAddPainPoint}
                className="px-2.5 py-1.5 bg-gray-800 hover:bg-black text-white text-xs font-semibold rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* Pillar Roadmap tracker */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-2">
            <p className="text-xs font-bold text-gray-800">Interview Progress</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const hasAnswer = Boolean(answers[q.id]?.transcript);
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      handleSaveCurrentAnswer();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-[#0E7C66] text-white font-semibold'
                        : hasAnswer
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="truncate flex-1 mr-2">
                      {idx + 1}. {q.text}
                    </span>
                    {hasAnswer && <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
