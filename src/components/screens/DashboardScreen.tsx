import React from 'react';
import { ScreenType, Transaction, Project } from '../../types';
import { Check, Clock, ArrowDown, Heart, Search, ChevronRight, Gift, Sparkles, Download, Key, Upload, ShieldCheck } from 'lucide-react';

interface DashboardScreenProps {
  username: string;
  onNavigate: (screen: ScreenType) => void;
  transactions: Transaction[];
  downloadsCount: number;
  wishlistCount: number;
  onSelectProjectForUnlock: (project: Project) => void;
  featuredProjects: Project[];
  onOpenDonateModal: (project: Project) => void;
  onOpenPasswordModal: (password: string, title: string) => void;
  onOpenUploadModal?: () => void;
  canUploadProject?: boolean;
  isAdmin?: boolean;
  onOpenAdminPermissions?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  username,
  onNavigate,
  transactions,
  downloadsCount,
  wishlistCount,
  onSelectProjectForUnlock,
  featuredProjects,
  onOpenDonateModal,
  onOpenPasswordModal,
  onOpenUploadModal,
  canUploadProject,
  isAdmin,
  onOpenAdminPermissions,
}) => {
  const approvedCount = transactions.filter((t) => t.status === 'Approved').length || 1;
  const pendingCount = transactions.filter((t) => t.status === 'Pending').length;

  return (
    <div className="space-y-8">
      {/* User Greeting & Primary Call to Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#091e42] tracking-tight flex items-center gap-2.5">
            <span>Welcome back, {username}</span>
            {isAdmin && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                👑 Super Admin
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your donations, downloads, and favorite projects.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Admin Rights Button - Only visible to Admins */}
          {isAdmin && onOpenAdminPermissions && (
            <button
              onClick={onOpenAdminPermissions}
              className="inline-flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition cursor-pointer"
              title="Admin Permissions: Manage who can see and upload projects"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Admin Rights</span>
            </button>
          )}

          {/* Upload Project - Only visible if user has upload rights */}
          {canUploadProject && onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Project</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center space-x-2 bg-[#0284c7] hover:bg-[#0369a1] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Browse projects</span>
          </button>
        </div>
      </div>

      {/* Featured Free Unlock Spotlight Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50/50 to-purple-50 rounded-2xl p-4 sm:p-5 border border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                Featured Free Task
              </span>
              <span className="text-xs text-slate-500">Screen 2 Navigation</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              Watch to Unlock Free Download: Complete Real Estate Marketplace SaaS
            </h3>
            <p className="text-xs text-slate-500">
              Complete YouTube watch & like tasks to immediately unlock the full source code without donating.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const project = featuredProjects.find((p) => p.id === 'real-estate-saas') || featuredProjects[0];
            onSelectProjectForUnlock(project);
            onNavigate('watch-to-unlock');
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Unlock Flow</span>
        </button>
      </div>

      {/* Dashboard Metric Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: Approved */}
        <div
          onClick={() => onNavigate('donations')}
          className="bg-[#eefdf5] border border-emerald-100 rounded-2xl p-5 flex items-center justify-between transition hover:shadow-sm cursor-pointer"
        >
          <div>
            <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              APPROVED
            </span>
            <span className="text-3xl font-black text-emerald-700 font-mono tabular-nums">
              {approvedCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-200/70 flex items-center justify-center text-emerald-700">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Stat Card 2: Pending */}
        <div
          onClick={() => onNavigate('donations')}
          className="bg-[#fff9eb] border border-amber-100 rounded-2xl p-5 flex items-center justify-between transition hover:shadow-sm cursor-pointer"
        >
          <div>
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              PENDING
            </span>
            <span className="text-3xl font-black text-amber-600 font-mono tabular-nums">
              {pendingCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-amber-200/70 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Stat Card 3: Downloads */}
        <div
          onClick={() => onNavigate('downloads')}
          className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-5 flex items-center justify-between transition hover:shadow-sm cursor-pointer"
        >
          <div>
            <span className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              DOWNLOADS
            </span>
            <span className="text-3xl font-black text-blue-600 font-mono tabular-nums">
              {downloadsCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-blue-200/70 flex items-center justify-center text-blue-600">
            <ArrowDown className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Stat Card 4: Favorites */}
        <div
          onClick={() => onNavigate('wishlist')}
          className="bg-[#fbf4ff] border border-purple-100 rounded-2xl p-5 flex items-center justify-between transition hover:shadow-sm cursor-pointer"
        >
          <div>
            <span className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">
              FAVORITES
            </span>
            <span className="text-3xl font-black text-purple-600 font-mono tabular-nums">
              {wishlistCount}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-purple-200/70 flex items-center justify-center text-purple-600">
            <Heart className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent transactions</h2>
            <p className="text-xs text-slate-500">Your latest 5 donations</p>
          </div>
          <button
            onClick={() => onNavigate('donations')}
            className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1 text-slate-500" />
          </button>
        </div>

        {transactions.length === 0 ? (
          /* Empty Transactions State Card */
          <div className="bg-white border border-slate-200/80 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="text-slate-300 mb-3">
              <Heart className="w-12 h-12 stroke-[1.5]" />
            </div>
            <p className="text-sm text-slate-500 font-normal">
              No transactions yet. Start donating to projects!
            </p>
            <button
              onClick={() => onNavigate('projects')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition cursor-pointer"
            >
              Explore Projects to Donate
            </button>
          </div>
        ) : (
          /* Real Transactions Card */
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Project</th>
                    <th className="py-3.5 px-4">Gateway</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {transactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-semibold text-slate-900 max-w-xs">
                        {tx.projectTitle}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-cyan-50 text-cyan-800 border border-cyan-100">
                          {tx.gateway}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {tx.amount}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                            tx.status === 'Approved'
                              ? 'bg-emerald-100/80 text-emerald-700'
                              : tx.status === 'Pending'
                              ? 'bg-amber-100/80 text-amber-700'
                              : 'bg-rose-100/80 text-rose-700'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {tx.submittedDate}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              onNavigate('downloads');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-medium text-xs shadow-xs transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                          {tx.password && (
                            <button
                              onClick={() =>
                                onOpenPasswordModal(tx.password!, tx.projectTitle)
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs border border-slate-200/80 transition cursor-pointer"
                            >
                              <Key className="w-3.5 h-3.5" />
                              <span>Password</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Quick Showcase of Open Source Scripts */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Featured source codes</h2>
            <p className="text-xs text-slate-500">Original codebases ready for download & customization</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
          >
            Explore all 50 projects →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProjects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                    <span>≡</span> {project.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{project.downloads} downloads</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectProjectForUnlock(project);
                    onNavigate('watch-to-unlock');
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition text-center cursor-pointer"
                >
                  Free Unlock
                </button>
                <button
                  onClick={() => onOpenDonateModal(project)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center shadow-xs transition cursor-pointer"
                >
                  Donate & DL
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
