import React from 'react';
import { Project } from '../../types';
import { X, Download, Sparkles, Check, Heart, Server, Shield, FileCode2, Terminal } from 'lucide-react';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onOpenDonateModal: (project: Project) => void;
  onGoToFreeUnlock: (project: Project) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onOpenDonateModal,
  onGoToFreeUnlock,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Graphic Header */}
        <div
          className={`w-full aspect-[21/9] bg-gradient-to-br ${project.gradient} p-6 text-white relative flex flex-col justify-between`}
        >
          <div className="flex items-start justify-between">
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-white/20 backdrop-blur-md uppercase tracking-wider">
              {project.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(project.id)}
                className={`p-2 rounded-full transition cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/40 hover:bg-black/60 text-white'
                }`}
                title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 font-mono">
              <span>{project.downloads} downloads</span>
              <span>•</span>
              <span>Full Source Code + DB Seeders</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Project Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Architectural Highlights
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center"
                >
                  <div className="text-xs font-bold text-slate-800 truncate">{feat.label}</div>
                  <div className="text-[11px] text-slate-500 truncate">{feat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Included Files */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <FileCode2 className="w-4 h-4 text-sky-600" />
              <span>What's inside the archive</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 ml-6 list-disc">
              <li>Complete frontend & backend source code with zero obfuscation</li>
              <li>PostgreSQL / MySQL database migration schema & seeder scripts</li>
              <li>Docker Compose configuration for one-command local orchestration</li>
              <li>Full README documentation & step-by-step video installation guide</li>
            </ul>
          </div>

          {/* Dual Action Options */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onGoToFreeUnlock(project);
              }}
              className="w-full sm:flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Watch to Unlock Free Download</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenDonateModal(project);
              }}
              className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Donate (Min. ₮ {project.minDonationUsdt.toFixed(2)} USDT)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
