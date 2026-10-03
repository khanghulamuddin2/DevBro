import React, { useState } from 'react';
import { ScreenType } from '../types';
import { Search, ChevronDown, Check, Sparkles, LogOut, User, Upload, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  wishlistCount: number;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenUploadModal?: () => void;
  canUploadProject?: boolean;
  isAdmin?: boolean;
  onOpenAdminPermissions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  wishlistCount,
  isLoggedIn,
  onLogout,
  onOpenAuth,
  onOpenUploadModal,
  canUploadProject,
  isAdmin,
  onOpenAdminPermissions,
}) => {
  const [showNavMenu, setShowNavMenu] = useState(false);

  const screens: { id: ScreenType; label: string; tag?: string }[] = [
    { id: 'dashboard', label: '1. Dashboard (Initial Screen)' },
    { id: 'watch-to-unlock', label: '2. Watch to Unlock Free Download', tag: 'Interactive' },
    { id: 'wishlist', label: `3. My Wishlist (${wishlistCount})` },
    { id: 'profile', label: '4. Profile & Security' },
    { id: 'projects', label: 'Explore Projects / Marketplace' },
    { id: 'donations', label: 'Donation History' },
    { id: 'downloads', label: 'Download History' },
  ];

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs backdrop-blur-md">
      <div className="w-full px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Navigation Links */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          <button
            onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'projects')}
            className="flex items-center space-x-2.5 text-xl font-bold tracking-tight text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm group-hover:bg-[#0369a1] transition">
              &lt;/&gt;
            </div>
            <span className="text-[#092244] text-2xl font-black tracking-tight">
              Dev<span className="text-[#0284c7]">Bro</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'projects')}
              className={`transition cursor-pointer ${
                currentScreen === 'dashboard' ? 'text-sky-600 font-semibold' : 'hover:text-sky-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className={`transition cursor-pointer ${
                currentScreen === 'projects' ? 'text-sky-600 font-semibold' : 'hover:text-sky-600'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => {
                onNavigate('projects');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-sky-600 transition cursor-pointer"
            >
              How it works
            </button>
          </nav>
        </div>

        {/* Search and Header Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Quick Prototype Screen Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowNavMenu(!showNavMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition cursor-pointer shadow-2xs"
              title="Switch Prototype Screens"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Screen:</span>
              <span className="text-slate-900 max-w-[130px] truncate">
                {currentScreen === 'dashboard' && 'Dashboard'}
                {currentScreen === 'watch-to-unlock' && 'Watch Unlock'}
                {currentScreen === 'wishlist' && 'My Wishlist'}
                {currentScreen === 'profile' && 'Profile'}
                {currentScreen === 'projects' && 'Projects'}
                {currentScreen === 'donations' && 'Donations'}
                {currentScreen === 'downloads' && 'Downloads'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showNavMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNavMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                    Prototype Navigation Screens
                  </div>
                  {screens.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onNavigate(s.id);
                        setShowNavMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-50 transition cursor-pointer ${
                        currentScreen === s.id ? 'font-bold text-sky-600 bg-sky-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{s.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {s.tag && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-purple-100 text-purple-700">
                            {s.tag}
                          </span>
                        )}
                        {currentScreen === s.id && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search bar input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="relative hidden sm:flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects"
              className="w-52 lg:w-64 pl-4 pr-16 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-full focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition placeholder-slate-400"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-transparent hover:bg-slate-200/60 rounded-full text-xs font-semibold text-slate-600 transition cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Admin Rights Control Trigger (Only visible to Admins) */}
          {isAdmin && onOpenAdminPermissions && (
            <button
              onClick={onOpenAdminPermissions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition shadow-2xs cursor-pointer shrink-0"
              title="Admin Permissions: Manage who can see and upload projects"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden sm:inline">Admin Rights</span>
            </button>
          )}

          {/* Upload Project Button - ONLY for Admin or users granted upload rights */}
          {canUploadProject && onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs cursor-pointer shrink-0"
              title="Upload project source code"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Project</span>
              <span className="sm:hidden">Upload</span>
            </button>
          )}

          {/* Authentication Actions: When Logged In vs When Logged Out */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Dashboard Pill Button */}
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-5 py-1.5 text-sm font-semibold rounded-full shadow-sm transition cursor-pointer ${
                  currentScreen === 'dashboard'
                    ? 'bg-[#6d28d9] text-white ring-2 ring-purple-300'
                    : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white'
                }`}
              >
                Dashboard
              </button>

              {/* Logout Action Button */}
              <button
                onClick={onLogout}
                className="px-5 py-1.5 text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-full shadow-sm transition cursor-pointer flex items-center gap-1.5"
                title="Logout of account"
              >
                <span>Logout</span>
              </button>
            </div>
          ) : (
            /* Logged Out: Matches the exact uploaded screenshot */
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Sign in button (dark purple pill) */}
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-5 py-1.5 text-sm font-semibold text-white bg-[#2e1065] hover:bg-[#1e0a45] rounded-full shadow-sm transition cursor-pointer"
              >
                Sign in
              </button>

              {/* Create account button (blue/cyan pill) */}
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-5 py-1.5 text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-full shadow-sm transition cursor-pointer"
              >
                Create account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
