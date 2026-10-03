import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { User, Lock, AlertTriangle, Check, ShieldCheck } from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onUpdatePassword?: (currentPass: string, newPass: string) => { success: boolean; message: string };
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateProfile,
  onUpdatePassword,
  showToast,
}) => {
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }

    setIsSavingProfile(true);
    setTimeout(() => {
      onUpdateProfile({ ...user, username: username.trim() });
      setIsSavingProfile(false);
      showToast('Profile information updated successfully!', 'success');
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      if (onUpdatePassword) {
        const res = onUpdatePassword(currentPassword, newPassword);
        if (!res.success) {
          showToast(res.message, 'error');
          return;
        }
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully! Your account is secure.', 'success');
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Profile Information Card */}
      <section className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-7">
        <div className="flex items-center space-x-3 mb-1">
          <User className="w-6 h-6 text-[#7c3aed]" />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Profile Information
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">Update your account details.</p>
        <hr className="border-slate-100 mb-6" />

        <form onSubmit={handleSaveProfile} className="space-y-5">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="w-full rounded-xl border border-slate-300 bg-slate-50/80 py-2.5 px-4 text-sm text-slate-600 focus:outline-none cursor-not-allowed select-all"
            />
            <p className="mt-1.5 text-xs text-slate-400">Email cannot be changed</p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#6d28d9] hover:opacity-95 shadow-sm transition cursor-pointer flex items-center gap-2"
            >
              {isSavingProfile ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Change Password Card */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7">
        <div className="flex items-center space-x-3 mb-1">
          <Lock className="w-6 h-6 text-[#10b981]" />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Change Password
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Update your password to keep your account secure.
        </p>
        <hr className="border-slate-100 mb-6" />

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 6 characters)"
              className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <p className="mt-1.5 text-xs text-slate-400">Must be at least 6 characters long</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm bg-[#059669] hover:bg-[#047857] shadow-sm transition cursor-pointer flex items-center gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Password Security Tips Card */}
      <section className="bg-[#fef9c3]/50 border border-[#fef08a] rounded-2xl p-6 text-[#854d0e]">
        <div className="flex items-center space-x-2.5 mb-3">
          <AlertTriangle className="w-5 h-5 text-[#b45309]" />
          <h3 className="text-base font-bold text-[#92400e]">Password Security Tips</h3>
        </div>
        <ul className="list-disc list-inside text-sm text-[#854d0e] space-y-1.5 ml-1">
          <li>Use a strong password with at least 6 characters</li>
          <li>Include uppercase, lowercase, numbers, and special characters</li>
          <li>Don't reuse passwords from other accounts</li>
          <li>Change your password regularly</li>
        </ul>
      </section>
    </div>
  );
};
