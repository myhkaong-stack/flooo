import React, { useState } from 'react';
import {
  User,
  Shield,
  Building,
  Mail,
  CheckCircle,
  Lock,
  Key,
  Database,
  Save,
} from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const [name, setName] = useState('Alex Rivera');
  const [role, setRole] = useState('Principal Requirements Architect');
  const [organization, setOrganization] = useState('Product Engineering Group');
  const [email, setEmail] = useState('lead.analyst@company.org');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div id="profile-settings-view" className="max-w-4xl mx-auto pb-16 space-y-6">
      <div>
        <h2 className="text-xl font-bold font-['Sora'] text-gray-900">Profile & Workspace Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your interviewer identity, organizational metadata, and elicitation workspace.
        </p>
      </div>

      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#0E7C66]" />
          <span>Profile preferences saved successfully.</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
        <h3 className="font-['Sora'] font-bold text-gray-900 text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-[#0E7C66]" />
          <span>Interviewer Credentials</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Job Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#0E7C66]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#0E7C66] hover:bg-[#0B6654] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#0E7C66]/20 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & System Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <h3 className="font-['Sora'] font-bold text-gray-900 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0E7C66]" />
          <span>Security & Data Compliance</span>
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Interview transcripts and synthesized requirements documents are processed locally in your container environment with secure server-side AI integrations. No audio is shared with unapproved third parties.
        </p>
      </div>
    </div>
  );
};
