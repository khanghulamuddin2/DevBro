import React from 'react';
import { Project, ScreenType } from '../../types';
import { Heart, Search, ArrowRight, Download, Sparkles, Trash2, Eye } from 'lucide-react';

interface WishlistScreenProps {
  wishlistIds: string[];
  allProjects: Project[];
  onToggleWishlist: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectProjectForUnlock: (project: Project) => void;
  onOpenDonateModal: (project: Project) => void;
  onOpenDetailsModal: (project: Project) => void;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  wishlistIds,
  allProjects,
  onToggleWishlist,
  onNavigate,
  onSelectProjectForUnlock,
  onOpenDonateModal,
  onOpenDetailsModal,
}) => {
  const favoriteProjects = allProjects.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title & Subtitle Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            My Wishlist
          </h1>
          <p className="text-[15px] text-slate-500">
            Your favorite projects saved for quick access. {favoriteProjects.length} saved project
            {favoriteProjects.length === 1 ? '' : 's'}.
          </p>
        </div>

        {favoriteProjects.length > 0 && (
          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Discover More Projects</span>
          </button>
        )}
      </div>

      {favoriteProjects.length === 0 ? (
        /* Empty State Card */
        <section className="w-full bg-white rounded-2xl border-2 border-dashed border-slate-200/90 p-12 lg:p-16 flex flex-col items-center justify-center text-center shadow-xs">
          {/* Icon Container */}
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
            <Heart className="w-7 h-7 stroke-[1.5]" />
          </div>

          {/* Heading */}
          <h2 className="text-lg font-bold text-slate-900 mb-1.5">No favorites yet</h2>

          {/* Explanatory note */}
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            Start adding projects to your wishlist for quick access later.
          </p>

          {/* Call to action button */}
          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Projects</span>
          </button>
        </section>
      ) : (
        /* Populated Wishlist Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProjects.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Banner Graphic Header */}
                <div
                  className={`w-full aspect-[16/9] bg-gradient-to-br ${project.gradient} p-4 text-white relative flex flex-col justify-between overflow-hidden`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-yellow-300 line-clamp-2">
                      {project.bannerTitle}
                    </div>
                    <button
                      onClick={() => onToggleWishlist(project.id)}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-rose-400 hover:text-rose-300 transition shrink-0 cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1 my-1">
                    {project.features.slice(0, 3).map((f, i) => (
                      <div
                        key={i}
                        className="bg-black/40 backdrop-blur-xs p-1 rounded text-[8px] border border-white/10 text-center"
                      >
                        <div className="font-bold text-white truncate">{f.label}</div>
                        <div className="text-slate-300 truncate">{f.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <span className="inline-block bg-sky-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded shadow">
                      {project.bannerSubtext || 'FREE SOURCE CODE'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md">
                      <span>≡</span> {project.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {project.downloads} downloads
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDetailsModal(project)}
                    className="w-1/2 py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg text-center hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View details</span>
                  </button>

                  <button
                    onClick={() => onOpenDonateModal(project)}
                    className="w-1/2 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Donate</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onSelectProjectForUnlock(project);
                    onNavigate('watch-to-unlock');
                  }}
                  className="w-full py-2 px-3 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/70 rounded-lg text-center transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Watch to Unlock Free Download</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
