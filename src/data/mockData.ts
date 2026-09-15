import { Campaign, CompletedSession, FeedbackLink, InterviewGuide, UploadedTransferFile } from '../types';
import { generateQuestionsForGuide } from './questionTemplates';

export const INITIAL_GUIDES: InterviewGuide[] = [
  {
    id: 'guide-erp-migration',
    title: 'Legacy ERP Migration Stakeholder Audit',
    system: 'ERP',
    role: 'Operations Manager',
    interviewType: 'structured',
    objective: 'Identify inventory reconciliation bottlenecks and export dependencies before cloud cutover.',
    status: 'active',
    questions: generateQuestionsForGuide(
      'ERP',
      'Operations Manager',
      'structured',
      'Identify inventory bottlenecks before cloud cutover'
    ),
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-14T14:30:00Z',
    responseCount: 18,
  },
  {
    id: 'guide-healthcare-records',
    title: 'Clinical Care EHR Usability Study',
    system: 'Healthcare',
    role: 'Physician',
    interviewType: 'semi_structured',
    objective: 'Evaluate bedside patient chart retrieval delays and medication order confirmation friction.',
    status: 'active',
    questions: generateQuestionsForGuide(
      'Healthcare',
      'Physician',
      'semi_structured',
      'Evaluate bedside patient chart retrieval delays'
    ),
    createdAt: '2026-09-05T09:15:00Z',
    updatedAt: '2026-09-12T11:20:00Z',
    responseCount: 12,
  },
  {
    id: 'guide-crm-support',
    title: 'Customer Success Escalation Workflow',
    system: 'CRM',
    role: 'Customer Support Agent',
    interviewType: 'unstructured',
    objective: 'Uncover disconnects between high-tier ticket dispatching and customer SLA visibility.',
    status: 'draft',
    questions: generateQuestionsForGuide(
      'CRM',
      'Customer Support Agent',
      'unstructured',
      'Uncover disconnects in ticket dispatching'
    ),
    createdAt: '2026-09-10T16:00:00Z',
    updatedAt: '2026-09-15T08:00:00Z',
    responseCount: 4,
  },
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Legacy ERP Migration',
    system: 'ERP',
    progress: 18,
    target: 20,
    sentiment: 'negative',
    status: 'Active',
    updatedAt: '2026-09-15T04:12:00Z',
  },
  {
    id: 'camp-2',
    title: 'Healthcare Info System EHR',
    system: 'Healthcare',
    progress: 12,
    target: 15,
    sentiment: 'neutral',
    status: 'Active',
    updatedAt: '2026-09-14T18:45:00Z',
  },
  {
    id: 'camp-3',
    title: 'CRM Sales Cloud 2.0 Discovery',
    system: 'CRM',
    progress: 28,
    target: 30,
    sentiment: 'positive',
    status: 'Active',
    updatedAt: '2026-09-13T12:00:00Z',
  },
  {
    id: 'camp-4',
    title: 'E-Learning Portal Redesign',
    system: 'E-Learning',
    progress: 5,
    target: 10,
    sentiment: 'neutral',
    status: 'Draft',
    updatedAt: '2026-09-11T09:30:00Z',
  },
];

export const INITIAL_FEEDBACK_LINKS: FeedbackLink[] = [
  {
    id: 'link-1',
    guideId: 'guide-erp-migration',
    guideTitle: 'Legacy ERP Migration Stakeholder Audit',
    token: 'erp-ops-2026',
    status: 'live',
    expiryOption: 'Expires in 30 days',
    submissionsCount: 18,
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'link-2',
    guideId: 'guide-healthcare-records',
    guideTitle: 'Clinical Care EHR Usability Study',
    token: 'ehr-clinical-v1',
    status: 'live',
    expiryOption: 'Never expires',
    submissionsCount: 12,
    createdAt: '2026-09-05T09:15:00Z',
  },
  {
    id: 'link-3',
    guideId: 'guide-crm-support',
    guideTitle: 'Customer Success Escalation Workflow',
    token: 'cs-escalate-draft',
    status: 'off',
    expiryOption: 'Expires in 7 days',
    submissionsCount: 4,
    createdAt: '2026-09-10T16:00:00Z',
  },
];

export const SAMPLE_COMPLETED_SESSION: CompletedSession = {
  id: 'session-sample-1',
  guideId: 'guide-erp-migration',
  guideTitle: 'Legacy ERP Migration Stakeholder Audit',
  participantName: 'Sarah Jenkins',
  participantRole: 'Operations Manager',
  conductedAt: '2026-09-14T14:30:00Z',
  durationSeconds: 940,
  overallSentiment: 'negative',
  executiveSummary:
    'Participant expressed acute frustration regarding manual inventory reconciliations. Current ERP lacks real-time batch validation, requiring staff to maintain parallel shadow spreadsheets. High risk of shipping incorrect SKUs during peak warehouse hours.',
  painPoints: [
    {
      point: 'Inventory sync occurs in nightly batch jobs rather than real-time updates.',
      severity: 'High',
      pillar: 'Pain Points',
    },
    {
      point: 'Manual data re-entry required when reconciling third-party logistics (3PL) manifests.',
      severity: 'High',
      pillar: 'System Limitations',
    },
    {
      point: 'Export format lacks custom column selection, breaking downstream BI pipelines.',
      severity: 'Medium',
      pillar: 'Current Workflow',
    },
  ],
  functionalRequirements: [
    {
      code: 'FR-01',
      title: 'Real-Time Inventory Synchronization',
      description: 'The system shall broadcast stock allocation updates within 2 seconds of warehouse scanning.',
      priority: 'Must',
    },
    {
      code: 'FR-02',
      title: 'Automated 3PL Manifest Ingestion',
      description: 'The system shall parse EDI 945 and CSV shipment manifests automatically with discrepancy alerts.',
      priority: 'Must',
    },
    {
      code: 'FR-03',
      title: 'Configurable Data Export Wizard',
      description: 'Users shall be permitted to choose, filter, and save custom CSV/XLSX export schemas per team.',
      priority: 'Should',
    },
  ],
  nonFunctionalRequirements: [
    {
      code: 'NFR-01',
      title: 'Sub-Second Barcode Processing Latency',
      category: 'Performance',
      description: 'Handheld scanner requests must roundtrip in under 500ms over warehouse Wi-Fi.',
    },
    {
      code: 'NFR-02',
      title: 'Audit Trail Immutability',
      category: 'Compliance',
      description: 'All manual stock adjustments must record operator ID, timestamp, and signed reason code.',
    },
  ],
  answers: [
    {
      questionId: 'q-sample-1',
      questionText: 'Walk me through how you typically use the ERP during a normal working day.',
      pillar: 'Current Workflow',
      transcript:
        'I open the warehouse dispatch module at 7 AM. First thing I do is check for mismatched stock numbers between overnight receiving and our main ledger.',
      sentiment: 'neutral',
      painPoints: ['Manual morning cross-checking'],
      keyInsight: 'Morning routine begins with manual data hygiene.',
    },
    {
      questionId: 'q-sample-2',
      questionText: 'What are the most frustrating parts of using the ERP today as an Operations Manager?',
      pillar: 'Pain Points',
      transcript:
        'The nightly batch sync! If an order is canceled at 2 PM, the floor does not know until tomorrow unless someone screams across the room or sends a Slack message.',
      sentiment: 'negative',
      painPoints: ['Nightly batch delays cause shipping of canceled orders'],
      keyInsight: 'Lack of real-time visibility risks direct customer SLA breaches.',
    },
    {
      questionId: 'q-sample-3',
      questionText: 'If you could add one feature to the ERP, what would it be and what problem would it solve?',
      pillar: 'Desired Features',
      transcript:
        'Instant stock freeze and immediate alert push to mobile scanners whenever a critical item inventory falls below threshold.',
      sentiment: 'positive',
      painPoints: [],
      keyInsight: 'Desire for automated alerting over passive dashboards.',
    },
  ],
};

export const INITIAL_UPLOADED_FILES: UploadedTransferFile[] = [
  {
    id: 'file-1',
    name: 'stakeholder_interview_logistics_audio.mp3',
    size: 14850000,
    type: 'audio/mp3',
    category: 'audio',
    status: 'ready',
    extractedSummary: 'Interview with warehouse lead detailing scan gun disconnection and stock sync latency.',
    extractedRequirementsCount: 4,
    uploadedAt: '2026-09-14T11:20:00Z',
  },
  {
    id: 'file-2',
    name: 'q3_user_feedback_transcripts.txt',
    size: 245000,
    type: 'text/plain',
    category: 'transcript',
    status: 'ready',
    extractedSummary: 'Compilation of 8 customer support onboarding sessions with tagged pain points.',
    extractedRequirementsCount: 6,
    uploadedAt: '2026-09-15T02:10:00Z',
  },
];
