import React from 'react';
import { ScreenType } from '../types';
import { LayoutGrid, Heart, Download, User, LogOut, Send, Video, Upload, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  wishlistCount: number;
  onLogout: () => void;
  onOpenUploadModal?: () => void;
  canUploadProject?: boolean;
  isAdmin?: boolean;
  onOpenAdminPermissions?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  wishlistCount,
  onLogout,
  onOpenUploadModal,
  canUploadProject,
  isAdmin,
  onOpenAdminPermissions,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/70 p-5 flex flex-col justify-between hidden md:flex shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Navigation Section: Menu */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            MENU
          </span>
          <nav className="mt-3 space-y-1">
            {/* Dashboard menu item */}
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                currentScreen === 'dashboard'
                  ? 'bg-slate-50 border border-slate-200/80 text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center space-x-3">
                <LayoutGrid
                  className={`w-5 h-5 ${
                    currentScreen === 'dashboard' ? 'text-slate-700' : 'text-slate-500'
                  }`}
                />
                <span className="text-sm">Dashboard</span>
              </div>
            </button>

            {/* Donations menu item */}
            <button
              onClick={() => onNavigate('donations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer ${
                currentScreen === 'donations'
                  ? 'bg-slate-50 border border-slate-200/80 text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Heart
                  className={`w-5 h-5 ${
                    currentScreen === 'donations' ? 'text-rose-500 fill-rose-500' : 'text-slate-500'
                  }`}
                />
                <span className="text-sm">Donations</span>
              </div>
            </button>

            {/* Downloads menu item */}
            <button
              onClick={() => onNavigate('downloads')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer ${
                currentScreen === 'downloads'
                  ? 'bg-slate-50 border border-slate-200/80 text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Download
                  className={`w-5 h-5 ${
                    currentScreen === 'downloads' ? 'text-sky-600' : 'text-slate-500'
                  }`}
                />
                <span className="text-sm">Downloads</span>
              </div>
            </button>

            {/* Wishlist menu item */}
            <button
              onClick={() => onNavigate('wishlist')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer ${
                currentScreen === 'wishlist'
                  ? 'bg-slate-50 border border-slate-200/80 text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Heart
                  className={`w-5 h-5 ${
                    currentScreen === 'wishlist' ? 'text-slate-900 fill-slate-900' : 'text-slate-500'
                  }`}
                />
                <span className="text-sm">Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-700">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Profile menu item */}
            <button
              onClick={() => onNavigate('profile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer ${
                currentScreen === 'profile'
                  ? 'bg-slate-50 border border-slate-200/80 text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center space-x-3">
                <User
                  className={`w-5 h-5 ${
                    currentScreen === 'profile' ? 'text-slate-900' : 'text-slate-500'
                  }`}
                />
                <span className="text-sm">Profile</span>
              </div>
            </button>

            {/* Admin Permissions Menu Item (Only visible to Admins) */}
            {isAdmin && onOpenAdminPermissions && (
              <button
                onClick={onOpenAdminPermissions}
                className="w-full mt-2.5 flex items-center justify-between px-3 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100/70 border border-purple-200/80 text-purple-900 font-bold transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                  <span className="text-sm">Admin Rights</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-200 text-purple-900">
                  Control
                </span>
              </button>
            )}

            {/* Upload Project Menu Item - Only visible if user has upload permission */}
            {canUploadProject && onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="w-full mt-2.5 flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 text-emerald-800 font-bold transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">Upload Project</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-200 text-emerald-900">
                  New
                </span>
              </button>
            )}
          </nav>
        </div>

        <hr className="border-slate-100" />

        {/* Navigation Section: Contact Developer */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            CONTACT DEVELOPER
          </span>
          <nav className="mt-3 space-y-2">
            {/* Telegram Contact Link */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </div>
              <span className="text-sm font-medium">Telegram Support</span>
            </a>

            {/* YouTube Contact Link */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-[#ff0000] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Video className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium">YouTube Tutorials</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Sidebar Bottom Action */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-medium text-sm transition shadow-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
