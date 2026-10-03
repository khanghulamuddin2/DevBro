import React, { useState } from 'react';
import { UserAccount, UserProfile, AdminSettings } from '../../types';
import {
  X,
  ShieldCheck,
  Users,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  ShieldAlert,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface AdminPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  registeredUsers: UserAccount[];
  adminSettings: AdminSettings;
  onUpdateAdminSettings: (newSettings: AdminSettings) => void;
  onUpdateUserPermissions: (email: string, canUpload: boolean, role: 'admin' | 'user') => void;
  onSwitchSimulatedRole: (role: 'admin' | 'user') => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminPermissionsModal: React.FC<AdminPermissionsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  registeredUsers,
  adminSettings,
  onUpdateAdminSettings,
  onUpdateUserPermissions,
  onSwitchSimulatedRole,
  showToast,
}) => {
  if (!isOpen) return null;

  const [uploadPolicy, setUploadPolicy] = useState<AdminSettings['uploadPolicy']>(
    adminSettings.uploadPolicy
  );
  const [visibilityPolicy, setVisibilityPolicy] = useState<AdminSettings['visibilityPolicy']>(
    adminSettings.visibilityPolicy
  );

  const handleSavePolicies = () => {
    onUpdateAdminSettings({
      uploadPolicy,
      visibilityPolicy,
    });
    showToast('Admin access and upload permissions updated successfully!', 'success');
  };

  const handleToggleUploadForUser = (user: UserAccount) => {
    const newCanUpload = !user.canUploadProject;
    onUpdateUserPermissions(user.email, newCanUpload, user.role || 'user');
    showToast(
      `${user.username} upload rights ${newCanUpload ? 'granted' : 'revoked'}.`,
      newCanUpload ? 'success' : 'info'
    );
  };

  const handleToggleRoleForUser = (user: UserAccount) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const newCanUpload = newRole === 'admin' ? true : user.canUploadProject || false;
    onUpdateUserPermissions(user.email, newCanUpload, newRole);
    showToast(`${user.username} role changed to ${newRole.toUpperCase()}.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Admin Control &amp; Permissions
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Admin Only
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage who can see the project upload button and grant rights to developers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Quick Admin Test Switcher Banner */}
          <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-sky-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Test Permissions Live (Role Preview)</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Current active role: <strong className="text-slate-900 capitalize font-mono">{currentUser.role || 'admin'}</strong>.
                Switch to 'Regular User' to test how upload buttons are hidden from non-admins.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onSwitchSimulatedRole('admin');
                  showToast('Switched to Admin Role. All upload buttons are visible.', 'success');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-100/50'
                }`}
              >
                👑 Admin View
              </button>

              <button
                type="button"
                onClick={() => {
                  onSwitchSimulatedRole('user');
                  showToast('Switched to Regular User View. Upload buttons are now hidden!', 'info');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentUser.role === 'user'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                👤 Regular User View
              </button>
            </div>
          </div>

          {/* Section 1: Upload Rights Policy */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Global Project Upload Rights
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Control who can upload</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                onClick={() => setUploadPolicy('admin_only')}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  uploadPolicy === 'admin_only'
                    ? 'border-purple-500 bg-purple-50/70 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Admin Only</span>
                  <input
                    type="radio"
                    name="uploadPolicy"
                    checked={uploadPolicy === 'admin_only'}
                    onChange={() => setUploadPolicy('admin_only')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Only administrators see and can trigger project upload.
                </p>
              </label>

              <label
                onClick={() => setUploadPolicy('verified_only')}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  uploadPolicy === 'verified_only'
                    ? 'border-purple-500 bg-purple-50/70 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Selected Users</span>
                  <input
                    type="radio"
                    name="uploadPolicy"
                    checked={uploadPolicy === 'verified_only'}
                    onChange={() => setUploadPolicy('verified_only')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Admins + developers granted upload permission below.
                </p>
              </label>

              <label
                onClick={() => setUploadPolicy('all_users')}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  uploadPolicy === 'all_users'
                    ? 'border-purple-500 bg-purple-50/70 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">All Members</span>
                  <input
                    type="radio"
                    name="uploadPolicy"
                    checked={uploadPolicy === 'all_users'}
                    onChange={() => setUploadPolicy('all_users')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Any signed-in registered developer can upload.
                </p>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSavePolicies}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Apply Upload Policy
              </button>
            </div>
          </div>

          {/* Section 2: User Permission Management Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  User Permissions &amp; Upload Rights ({registeredUsers.length} Users)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">1-click grant/revoke</span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
              {registeredUsers.map((u) => {
                const isAdmin = u.role === 'admin' || u.email === 'khanghulamuddin2@gmail.com';
                const hasUploadRight = isAdmin || !!u.canUploadProject || uploadPolicy === 'all_users';

                return (
                  <div
                    key={u.email}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs ${
                          isAdmin
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isAdmin ? '👑' : u.username.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{u.username}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isAdmin
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isAdmin ? 'Admin' : 'Member'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Role Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleRoleForUser(u)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Toggle admin / user role"
                      >
                        {isAdmin ? 'Demote to Member' : 'Promote to Admin'}
                      </button>

                      {/* Can Upload Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleUploadForUser(u)}
                        disabled={isAdmin && uploadPolicy === 'admin_only'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                          hasUploadRight
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        }`}
                        title="Click to toggle upload project rights"
                      >
                        {hasUploadRight ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Can Upload</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span>No Upload Right</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Changes apply instantly to current and upcoming sessions.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
