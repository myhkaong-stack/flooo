/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveTab,
  Campaign,
  CompletedSession,
  FeedbackLink,
  InterviewGuide,
  UploadedTransferFile,
} from './types';
import {
  INITIAL_CAMPAIGNS,
  INITIAL_FEEDBACK_LINKS,
  INITIAL_GUIDES,
  INITIAL_UPLOADED_FILES,
  SAMPLE_COMPLETED_SESSION,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InterviewsView } from './components/InterviewsView';
import { GuideBuilderView } from './components/GuideBuilderView';
import { LiveSessionView } from './components/LiveSessionView';
import { ReportsView } from './components/ReportsView';
import { FeedbackLinksView } from './components/FeedbackLinksView';
import { TransferHubView } from './components/TransferHubView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { FileTransferModal } from './components/FileTransferModal';
import { PublicInterviewModal } from './components/PublicInterviewModal';
import { TutorialModal } from './components/TutorialModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [guides, setGuides] = useState<InterviewGuide[]>(INITIAL_GUIDES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [sessions, setSessions] = useState<CompletedSession[]>([SAMPLE_COMPLETED_SESSION]);
  const [activeSession, setActiveSession] = useState<CompletedSession | null>(SAMPLE_COMPLETED_SESSION);
  const [selectedGuideForSession, setSelectedGuideForSession] = useState<InterviewGuide | null>(INITIAL_GUIDES[0]);
  const [feedbackLinks, setFeedbackLinks] = useState<FeedbackLink[]>(INITIAL_FEEDBACK_LINKS);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedTransferFile[]>(INITIAL_UPLOADED_FILES);

  // Modals
  const [isFileTransferModalOpen, setIsFileTransferModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [respondentLink, setRespondentLink] = useState<FeedbackLink | null>(null);

  // Handle Guide Actions
  const handleSaveGuide = (newGuide: InterviewGuide) => {
    setGuides([newGuide, ...guides]);
    setActiveTab('interviews');
  };

  const handleLaunchGuideSession = (guide: InterviewGuide) => {
    setSelectedGuideForSession(guide);
    setActiveTab('live-session');
  };

  const handleDeleteGuide = (id: string) => {
    setGuides(guides.filter((g) => g.id !== id));
  };

  const handleDuplicateGuide = (guide: InterviewGuide) => {
    const duplicated: InterviewGuide = {
      ...guide,
      id: `guide-${Date.now()}`,
      title: `${guide.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseCount: 0,
    };
    setGuides([duplicated, ...guides]);
  };

  // Complete Session from Live room
  const handleCompleteSession = (session: CompletedSession) => {
    setSessions([session, ...sessions]);
    setActiveSession(session);
    setActiveTab('reports');
  };

  // Create Feedback Link
  const handleCreateLink = (
    guideId: string,
    expiry: 'Never expires' | 'Expires in 7 days' | 'Expires in 30 days'
  ) => {
    const targetGuide = guides.find((g) => g.id === guideId) || guides[0];
    const newLink: FeedbackLink = {
      id: `link-${Date.now()}`,
      guideId: targetGuide.id,
      guideTitle: targetGuide.title,
      token: `${targetGuide.system.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'live',
      expiryOption: expiry,
      submissionsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setFeedbackLinks([newLink, ...feedbackLinks]);
  };

  const handleToggleLinkStatus = (id: string) => {
    setFeedbackLinks(
      feedbackLinks.map((l) =>
        l.id === id ? { ...l, status: l.status === 'live' ? 'off' : 'live' } : l
      )
    );
  };

  // File Upload Handlers
  const handleAddUploadedFile = (file: UploadedTransferFile) => {
    setUploadedFiles([file, ...uploadedFiles]);
  };

  const handleGenerateGuideFromFile = (file: UploadedTransferFile) => {
    setActiveTab('guide-builder');
  };

  return (
    <div className="min-h-screen bg-[#FBFDFB] flex text-gray-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'tutorial') {
            setIsTutorialOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        activeGuidesCount={guides.filter((g) => g.status === 'active').length}
        openFileTransfer={() => setIsFileTransferModalOpen(true)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky App Header */}
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          openFileTransfer={() => setIsFileTransferModalOpen(true)}
        />

        {/* View Routing Canvas */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              campaigns={campaigns}
              guides={guides}
              onSelectTab={setActiveTab}
              openFileTransfer={() => setIsFileTransferModalOpen(true)}
              onLaunchGuideSession={handleLaunchGuideSession}
            />
          )}

          {activeTab === 'interviews' && (
            <InterviewsView
              guides={guides}
              onSelectGuide={(guide) => setSelectedGuideForSession(guide)}
              onLaunchSession={handleLaunchGuideSession}
              onCreateNew={() => setActiveTab('guide-builder')}
              onDeleteGuide={handleDeleteGuide}
              onDuplicateGuide={handleDuplicateGuide}
            />
          )}

          {activeTab === 'guide-builder' && (
            <GuideBuilderView
              onSaveGuide={handleSaveGuide}
              onLaunchSession={handleLaunchGuideSession}
            />
          )}

          {activeTab === 'live-session' && (
            <LiveSessionView
              guides={guides}
              selectedGuide={selectedGuideForSession}
              onCompleteSession={handleCompleteSession}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              sessions={sessions}
              activeSession={activeSession}
              onSelectSession={(s) => setActiveSession(s)}
            />
          )}

          {activeTab === 'feedback-links' && (
            <FeedbackLinksView
              links={feedbackLinks}
              guides={guides}
              onCreateLink={handleCreateLink}
              onToggleStatus={handleToggleLinkStatus}
              onOpenRespondentModal={(link) => setRespondentLink(link)}
            />
          )}

          {activeTab === 'transfer-hub' && (
            <TransferHubView
              uploadedFiles={uploadedFiles}
              onAddUploadedFile={handleAddUploadedFile}
              onGenerateGuideFromFile={handleGenerateGuideFromFile}
            />
          )}

          {activeTab === 'settings' && <ProfileSettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      <FileTransferModal
        isOpen={isFileTransferModalOpen}
        onClose={() => setIsFileTransferModalOpen(false)}
        onAddUploadedFile={handleAddUploadedFile}
      />

      <PublicInterviewModal
        link={respondentLink}
        guide={guides.find((g) => g.id === respondentLink?.guideId) || guides[0]}
        onClose={() => setRespondentLink(null)}
        onSubmitResponses={() => {
          if (respondentLink) {
            setFeedbackLinks(
              feedbackLinks.map((l) =>
                l.id === respondentLink.id
                  ? { ...l, submissionsCount: l.submissionsCount + 1 }
                  : l
              )
            );
          }
        }}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onGoToBuilder={() => setActiveTab('guide-builder')}
      />
    </div>
  );
}
