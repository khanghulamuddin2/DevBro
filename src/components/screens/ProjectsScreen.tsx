import React, { useState } from 'react';
import { Project, ScreenType } from '../../types';
import {
  Search,
  Filter,
  Check,
  Heart,
  Eye,
  Download,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowRight,
  Upload,
} from 'lucide-react';

interface ProjectsScreenProps {
  projects: Project[];
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectProjectForUnlock: (project: Project) => void;
  onOpenDonateModal: (project: Project) => void;
  onOpenDetailsModal: (project: Project) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUploadModal?: () => void;
  canUploadProject?: boolean;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  wishlistIds,
  onToggleWishlist,
  onNavigate,
  onSelectProjectForUnlock,
  onOpenDonateModal,
  onOpenDetailsModal,
  searchQuery,
  onSearchChange,
  onOpenUploadModal,
  canUploadProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [activePage, setActivePage] = useState(1);

  const categories = ['All', 'SAAS', 'E-COMMERCE', 'TRADING'];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="rounded-3xl bg-gradient-to-br from-[#dbeafe]/70 via-[#e0f2fe]/40 to-[#eef2ff]/70 border border-blue-100/70 p-6 md:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hero copy and callouts */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/90 text-cyan-800 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                <span>Donation-first code marketplace</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.18] tracking-tight mb-5">
                DevBro – Developer Source Code Sharing &amp; Resource Platform
              </h1>

              {/* Description */}
              <p className="text-slate-600 text-base sm:text-[17px] leading-relaxed max-w-2xl mb-8">
                DevBro is a developer resource platform where original source code projects are
                shared for learning and development purposes. Browse projects, support the creator
                with a donation, or download select projects for free.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-10">
                <a
                  href="#projects-grid"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition cursor-pointer"
                >
                  Browse source codes
                </a>
                {canUploadProject && onOpenUploadModal && (
                  <button
                    onClick={onOpenUploadModal}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Project</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition cursor-pointer"
                >
                  View marketplace
                </button>
              </div>
            </div>

            {/* Value Proposition Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
              <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 border border-white/60 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Secure payments</div>
                  <div className="text-xs text-slate-500 mt-0.5">Manual proof review</div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 border border-white/60 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Fast delivery</div>
                  <div className="text-xs text-slate-500 mt-0.5">Gated downloads</div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 border border-white/60 shadow-xs flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Creator-first</div>
                  <div className="text-xs text-slate-500 mt-0.5">You own your IP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Marketplace Analytics Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs bg-grid-pattern relative overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Live marketplace</h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Realtime</span>
                </span>
              </div>

              {/* 2x2 Stats Grid */}
              <div className="grid grid-cols-2 gap-3.5 mb-8">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/70 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500 mb-1">Projects</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    50
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/70 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500 mb-1">Downloads</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    3,869
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/70 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500 mb-1">Supporters</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    3,515
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/70 shadow-2xs">
                  <div className="text-xs font-medium text-slate-500 mb-1">Approved donations</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    195
                  </div>
                </div>
              </div>

              {/* Creator Workflow Footer Area */}
              <div className="pt-4 border-t border-slate-200/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  CREATOR WORKFLOW
                </p>
                <p className="text-sm font-bold text-slate-800 leading-snug mb-2">
                  Upload, set a minimum donation, approve proofs, unlock downloads.
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>Audit trail + activity logs</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="projects-grid" className="space-y-6">
        {/* Section Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured source codes
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Filter by category or search to find what you need. Showing 1–{filteredProjects.length} of 50 projects.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-500" />
                <span>{selectedCategory === 'All' ? 'All categories' : selectedCategory}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {showCategoryMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowCategoryMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 text-xs">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition cursor-pointer ${
                          selectedCategory === cat ? 'font-bold text-sky-600 bg-sky-50/50' : 'text-slate-700'
                        }`}
                      >
                        {cat === 'All' ? 'All categories' : cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Filter Action Button */}
            <button
              onClick={() => {
                setSelectedCategory('All');
                onSearchChange('');
              }}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-xs shadow-purple-300 transition cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isFav = wishlistIds.includes(project.id);
            return (
              <article
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  {/* Banner Image Graphic */}
                  <div
                    className={`w-full aspect-[16/9] bg-gradient-to-br ${project.gradient} p-4 text-white relative flex flex-col justify-between overflow-hidden select-none`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[11px] font-black uppercase tracking-wider text-yellow-300">
                        {project.bannerTitle}
                      </div>
                      <button
                        onClick={() => onToggleWishlist(project.id)}
                        className={`p-1.5 rounded-full transition shrink-0 cursor-pointer ${
                          isFav ? 'bg-rose-500 text-white' : 'bg-black/40 hover:bg-black/60 text-white/80'
                        }`}
                        title={isFav ? 'In Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 my-2">
                      {project.features.slice(0, 3).map((f, i) => (
                        <div
                          key={i}
                          className="bg-slate-800/80 p-1.5 rounded text-[8px] text-slate-300 border border-slate-700/60 text-center"
                        >
                          <div className="font-bold text-white truncate">{f.label}</div>
                          <span className="truncate block">{f.sub}</span>
                        </div>
                      ))}
                    </div>

                    <div className="inline-block self-center bg-orange-600 text-white text-[9px] font-bold px-3 py-1 rounded shadow">
                      {project.bannerSubtext || 'DOWNLOAD NOW'}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md mb-3">
                      <span className="text-xs">≡</span> {project.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3 pt-2 border-t border-slate-100">
                    <span className="font-mono">{project.downloads} downloads</span>
                    <span>Source code</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => onOpenDetailsModal(project)}
                      className="w-1/2 py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg text-center hover:bg-slate-50 transition cursor-pointer"
                    >
                      View details
                    </button>
                    <button
                      onClick={() => onOpenDonateModal(project)}
                      className="w-1/2 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center shadow-xs transition cursor-pointer"
                    >
                      Donate &amp; download
                    </button>
                  </div>

                  {project.freeTasksAvailable && (
                    <button
                      onClick={() => {
                        onSelectProjectForUnlock(project);
                        onNavigate('watch-to-unlock');
                      }}
                      className="w-full py-2 px-3 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Watch &amp; Unlock for Free</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination Component */}
        <div className="flex justify-center items-center mt-12 mb-8">
          <nav className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-full shadow-xs text-sm">
            <button
              onClick={() => setActivePage(1)}
              className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition cursor-pointer ${
                activePage === 1 ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setActivePage(2)}
              className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition cursor-pointer ${
                activePage === 2 ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              2
            </button>
            <button
              onClick={() => setActivePage(3)}
              className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition cursor-pointer ${
                activePage === 3 ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              3
            </button>
            <span className="w-8 h-8 text-slate-400 flex items-center justify-center text-xs font-bold">
              •••
            </span>
            <button
              onClick={() => setActivePage(Math.min(3, activePage + 1))}
              className="px-3 h-8 rounded-full text-slate-600 hover:bg-slate-100 font-semibold flex items-center justify-center text-xs transition cursor-pointer"
            >
              Next ›
            </button>
            <button
              onClick={() => setActivePage(3)}
              className="px-3 h-8 rounded-full text-slate-600 hover:bg-slate-100 font-semibold flex items-center justify-center text-xs transition cursor-pointer"
            >
              Last »
            </button>
          </nav>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-8">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="bg-[#fafcff] rounded-2xl p-6 border border-slate-100 bg-grid-pattern relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-100/70 text-cyan-600 flex items-center justify-center mb-5 font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Register</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create your supporter or creator account securely.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#fafcff] rounded-2xl p-6 border border-slate-100 bg-grid-pattern relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-100/70 text-cyan-600 flex items-center justify-center mb-5 font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Browse</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search curated projects across web, mobile, and APIs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#fafcff] rounded-2xl p-6 border border-slate-100 bg-grid-pattern relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-100/70 text-cyan-600 flex items-center justify-center mb-5 font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Donate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose a gateway and upload proof for manual approval.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-[#fafcff] rounded-2xl p-6 border border-slate-100 bg-grid-pattern relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-100/70 text-cyan-600 flex items-center justify-center mb-5 font-bold">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Download</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Access files instantly once approved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
