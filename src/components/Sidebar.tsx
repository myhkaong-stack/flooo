import React from 'react';
import {
  LayoutDashboard,
  FileQuestion,
  Sparkles,
  Radio,
  FileText,
  Link2,
  UploadCloud,
  Settings,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeGuidesCount: number;
  openFileTransfer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeGuidesCount,
  openFileTransfer,
}) => {
  const mainNavItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interviews', label: 'Interviews', icon: FileQuestion, badge: activeGuidesCount },
    { id: 'guide-builder', label: 'AI Guide Builder', icon: Sparkles },
    { id: 'live-session', label: 'Live Session', icon: Radio },
    { id: 'reports', label: 'Reports & Synthesis', icon: FileText },
    { id: 'feedback-links', label: 'Feedback Links', icon: Link2 },
    { id: 'transfer-hub', label: 'File Transfer & Import', icon: UploadCloud, badge: 'New' },
  ];

  const secondaryNavItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'settings', label: 'Profile Settings', icon: Settings },
    { id: 'tutorial', label: 'Help & Tutorial', icon: HelpCircle },
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between h-screen sticky top-0 select-none z-30"
    >
      {/* Top Brand Logo */}
      <div className="p-5 border-b border-gray-100 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0E7C66] flex items-center justify-center text-white shadow-sm shadow-[#0E7C66]/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-['Sora'] font-bold text-gray-900 text-base tracking-tight flex items-center gap-1.5">
              ReqSynth AI
              <span className="text-[10px] font-semibold tracking-wide bg-[#EBF5F2] text-[#0E7C66] px-1.5 py-0.5 rounded">
                v2.4
              </span>
            </span>
            <p className="text-[11px] text-gray-500 font-medium -mt-0.5">
              Requirements Interview Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0E7C66] text-white shadow-sm shadow-[#0E7C66]/20'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'New'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Transfer / Import CTA Box */}
        <div className="p-3 bg-gradient-to-br from-[#F0F8F5] to-emerald-50/50 rounded-xl border border-emerald-100/80">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-[#0E7C66] text-white shadow-xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Transfer Files</p>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                Drop audio or notes to auto-extract requirements.
              </p>
            </div>
          </div>
          <button
            id="sidebar-quick-upload-btn"
            onClick={openFileTransfer}
            className="mt-2.5 w-full py-1.5 px-2.5 text-xs font-semibold text-[#0E7C66] bg-white hover:bg-emerald-50 rounded-lg border border-emerald-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Transfer / Upload</span>
            <span className="text-[10px] text-emerald-600">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation & User Profile */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-gray-500" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0E7C66]/15 text-[#0E7C66] font-bold text-xs flex items-center justify-center">
              MK
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">Lead Interviewer</p>
              <p className="text-[10px] text-gray-400 truncate">ReqSynth Workspace</p>
            </div>
          </div>
          <FolderGit2 className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </aside>
  );
};
