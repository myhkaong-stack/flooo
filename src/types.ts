export type PillarKey =
  | 'Current Workflow'
  | 'Pain Points'
  | 'User Expectations'
  | 'System Limitations'
  | 'Desired Features'
  | 'Follow-Up Probes'
  | 'Open Exploration';

export type SystemType =
  | 'CRM'
  | 'ERP'
  | 'Web App'
  | 'Healthcare'
  | 'E-Learning'
  | 'Generic';

export type InterviewType = 'structured' | 'semi_structured' | 'unstructured';

export type GuideStatus = 'active' | 'draft' | 'archived';

export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface InterviewQuestion {
  id: string;
  pillar: PillarKey | string;
  text: string;
  hint?: string;
}

export interface InterviewGuide {
  id: string;
  title: string;
  system: SystemType;
  role: string;
  interviewType: InterviewType;
  objective: string;
  status: GuideStatus;
  questions: InterviewQuestion[];
  createdAt: string;
  updatedAt: string;
  responseCount: number;
}

export interface Campaign {
  id: string;
  title: string;
  system: SystemType;
  progress: number;
  target: number;
  sentiment: SentimentType;
  status: 'Active' | 'Draft' | 'Completed';
  updatedAt: string;
}

export interface InterviewAnswer {
  questionId: string;
  questionText: string;
  pillar: string;
  audioUrl?: string;
  transcript: string;
  sentiment: SentimentType;
  painPoints: string[];
  keyInsight?: string;
  requirementCandidate?: string;
}

export interface CompletedSession {
  id: string;
  guideId: string;
  guideTitle: string;
  participantName: string;
  participantRole: string;
  conductedAt: string;
  durationSeconds: number;
  answers: InterviewAnswer[];
  overallSentiment: SentimentType;
  executiveSummary: string;
  painPoints: { point: string; severity: 'High' | 'Medium' | 'Low'; pillar: string }[];
  functionalRequirements: { code: string; title: string; description: string; priority: 'Must' | 'Should' | 'Could' }[];
  nonFunctionalRequirements: { code: string; title: string; category: string; description: string }[];
}

export interface FeedbackLink {
  id: string;
  guideId: string;
  guideTitle: string;
  token: string;
  status: 'live' | 'off';
  expiryOption: 'Never expires' | 'Expires in 7 days' | 'Expires in 30 days';
  submissionsCount: number;
  createdAt: string;
}

export interface UploadedTransferFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'audio' | 'transcript' | 'document' | 'guide_json';
  status: 'processing' | 'ready' | 'error';
  extractedSummary?: string;
  extractedRequirementsCount?: number;
  uploadedAt: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'interviews'
  | 'guide-builder'
  | 'live-session'
  | 'reports'
  | 'feedback-links'
  | 'transfer-hub'
  | 'settings'
  | 'tutorial';
