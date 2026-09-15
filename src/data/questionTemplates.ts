import { InterviewQuestion, InterviewType, PillarKey, SystemType } from '../types';

export interface PillarMetadata {
  key: PillarKey;
  icon: string;
  tone: 'primary' | 'accent' | 'secondary';
  hint: string;
}

export const PILLARS: PillarMetadata[] = [
  {
    key: 'Current Workflow',
    icon: 'GitCommit',
    tone: 'primary',
    hint: 'How the system is used day to day today',
  },
  {
    key: 'Pain Points',
    icon: 'AlertCircle',
    tone: 'accent',
    hint: 'Friction, frustrations and slow steps',
  },
  {
    key: 'User Expectations',
    icon: 'Target',
    tone: 'secondary',
    hint: 'What a great experience looks like to them',
  },
  {
    key: 'System Limitations',
    icon: 'AlertTriangle',
    tone: 'accent',
    hint: 'Gaps, missing capability and reliability issues',
  },
  {
    key: 'Desired Features',
    icon: 'Sparkles',
    tone: 'primary',
    hint: 'Improvements and new capability they want',
  },
];

export const SYSTEM_OPTIONS: { value: SystemType; label: string; description: string }[] = [
  { value: 'CRM', label: 'CRM', description: 'Customer relationships, sales pipeline & support' },
  { value: 'ERP', label: 'ERP', description: 'Finance, inventory, procurement & operations' },
  { value: 'Web App', label: 'Web App', description: 'A general browser-based product or portal' },
  { value: 'Healthcare', label: 'Healthcare', description: 'Clinical, patient records & care workflows' },
  { value: 'E-Learning', label: 'E-Learning', description: 'Courses, learners & teaching platforms' },
  { value: 'Generic', label: 'Generic', description: 'Any other custom software or information system' },
];

export const INTERVIEW_TYPES: {
  value: InterviewType;
  label: string;
  badge: string;
  description: string;
  approach: string;
}[] = [
  {
    value: 'structured',
    label: 'Structured',
    badge: 'Fixed script',
    description: 'Same standardized questions, in the same order, for every participant.',
    approach: 'Every participant answers an identical, standardized set across all 5 pillars — ideal for consistent, comparable data.',
  },
  {
    value: 'semi_structured',
    label: 'Semi-Structured',
    badge: 'Guide + probes',
    description: 'A focused core of questions with room to probe deeper on the fly.',
    approach: 'A focused core of questions per pillar, each supported by follow-up probes so you can dig into what matters.',
  },
  {
    value: 'unstructured',
    label: 'Unstructured',
    badge: 'Open conversation',
    description: 'Broad, open prompts that let the participant lead the conversation.',
    approach: 'Wide-open, conversational prompts with no fixed order — best for early discovery and unexpected insights.',
  },
];

export const SYSTEM_ROLES: Record<SystemType, string[]> = {
  CRM: ['Sales Representative', 'Account Manager', 'Customer Support Agent', 'Sales Manager', 'Marketing Specialist'],
  ERP: ['Finance Officer', 'Inventory Manager', 'Procurement Officer', 'Operations Manager', 'IT Administrator'],
  'Web App': ['End User', 'Power User', 'Product Manager', 'Support Agent', 'Administrator'],
  Healthcare: ['Physician', 'Nurse', 'Front Desk Staff', 'Medical Records Officer', 'Hospital Administrator'],
  'E-Learning': ['Student', 'Instructor', 'Course Administrator', 'Teaching Assistant', 'Content Designer'],
  Generic: ['End User', 'Team Lead', 'Administrator', 'Support Staff', 'Key Stakeholder'],
};

export const BASE_PILLAR_QUESTIONS: Record<PillarKey, string[]> = {
  'Current Workflow': [
    'Walk me through how you typically use the {system} during a normal working day.',
    'Which steps of your {role} workflow does the {system} cover, and where does it hand off to other tools?',
    'How is information currently entered, updated and shared across your team?',
  ],
  'Pain Points': [
    'What are the most frustrating parts of using the {system} today as a {role}?',
    'Which tasks take far longer than they should, and what makes them slow?',
    'When something goes wrong, how do you work around the {system} to keep moving?',
  ],
  'User Expectations': [
    'If the {system} worked perfectly for you, what would your day look like?',
    'What would make you feel confident that your information is accurate and up to date?',
    'Which information do you need most often, and how quickly do you expect to reach it?',
  ],
  'System Limitations': [
    'Which features of the {system} feel incomplete or unreliable to you?',
    'Are there tasks you simply cannot complete in the {system} and must handle elsewhere?',
    'How well does the {system} connect with the other tools and systems you rely on?',
  ],
  'Desired Features': [
    'If you could add one feature to the {system}, what would it be and what problem would it solve?',
    'What kind of automation or alerts would save you the most time each week?',
    'How would you prioritise these improvements for the next release?',
  ],
  'Follow-Up Probes': [
    'Can you tell me more about that — why does it happen that way?',
    'How often does that come up in a typical week for you?',
    'What impact does that have on your work or your team?',
    'Is there anything you have already tried to make it better?',
    'If you could change one part of that, what would it be?',
  ],
  'Open Exploration': [
    'Tell me the story of a typical day working with the {system}, from the moment you start to the moment you finish.',
    'Looking back over the last few months, which moments with the {system} stand out the most, good or bad?',
    'If the {system} could do one thing perfectly for you as a {role}, what would it be and why?',
    'Walk me through the last time the {system} got in the way of something you needed to get done.',
    'What do you wish someone had asked you before the {system} was built?',
  ],
};

export const SYSTEM_SPECIFIC_PROBES: Record<SystemType, string> = {
  CRM: 'How confident are you that the customer records you rely on are complete and current?',
  ERP: 'How difficult is it to reconcile the {system} data with your spreadsheets or manual records?',
  'Web App': 'How often do you hit dead ends in the {system} because something was hard to find?',
  Healthcare: 'Does the {system} ever get in the way of the care or service you need to deliver quickly?',
  'E-Learning': 'How does the {system} affect your motivation or ability to keep up with your work?',
  Generic: 'If the {system} disappeared tomorrow, which parts of your work would be hardest to do?',
};

export function interpolatePrompt(text: string, system: string, role: string): string {
  return text.replace(/\{system\}/g, system).replace(/\{role\}/g, role);
}

export function generateQuestionsForGuide(
  system: SystemType,
  role: string,
  interviewType: InterviewType,
  objective?: string
): InterviewQuestion[] {
  const sysName = system || 'Generic';
  const roleName = role || 'user';
  const obj = (objective || '').trim();
  const questions: InterviewQuestion[] = [];

  const createQ = (pillar: string, template: string): InterviewQuestion => ({
    id: `q-${Math.random().toString(36).substring(2, 9)}`,
    pillar,
    text: interpolatePrompt(template, sysName, roleName),
  });

  if (interviewType === 'unstructured') {
    if (obj) {
      questions.push(
        createQ(
          'Open Exploration',
          `We would love to hear about your experience with the ${sysName}. To get us started, could you share your thoughts on "${obj}"?`
        )
      );
    }
    BASE_PILLAR_QUESTIONS['Open Exploration'].forEach((template) => {
      questions.push(createQ('Open Exploration', template));
    });
    return questions;
  }

  // Structured and Semi-structured
  const pillarsToUse: PillarKey[] = [
    'Current Workflow',
    'Pain Points',
    'User Expectations',
    'System Limitations',
    'Desired Features',
  ];

  pillarsToUse.forEach((pillarKey) => {
    let pool = [...BASE_PILLAR_QUESTIONS[pillarKey]];
    if (interviewType === 'semi_structured') {
      pool = pool.slice(0, 2);
    }

    if (pillarKey === 'Current Workflow' && obj) {
      pool = [
        `Our goal today is to understand "${obj}". To start, describe your typical experience with the ${sysName}.`,
        ...pool,
      ];
    }

    if (pillarKey === 'Pain Points' && SYSTEM_SPECIFIC_PROBES[system]) {
      pool.push(SYSTEM_SPECIFIC_PROBES[system]);
    }

    pool.forEach((template) => {
      questions.push(createQ(pillarKey, template));
    });
  });

  if (interviewType === 'semi_structured') {
    BASE_PILLAR_QUESTIONS['Follow-Up Probes'].slice(0, 3).forEach((probe) => {
      questions.push(createQ('Follow-Up Probes', probe));
    });
  }

  return questions;
}
