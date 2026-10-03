import React, { useState } from 'react';
import { Project, UserProfile } from '../../types';
import {
  X,
  Upload,
  Code2,
  FileCode,
  Globe,
  Tag,
  DollarSign,
  Gift,
  Key,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  Sparkles,
  Github,
  Layers,
} from 'lucide-react';

interface UploadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => void;
  user?: UserProfile;
}

export const UploadProjectModal: React.FC<UploadProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}) => {
  if (!isOpen) return null;

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'SAAS' | 'E-COMMERCE' | 'TRADING' | string>('SAAS');
  const [bannerTitle, setBannerTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceCodeUrl, setSourceCodeUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [minDonation, setMinDonation] = useState('1.00');
  const [password, setPassword] = useState('');
  const [freeTasksAvailable, setFreeTasksAvailable] = useState(true);
  const [youtubeVideoId, setYoutubeVideoId] = useState('video_real_estate');
  const [youtubeChannel, setYoutubeChannel] = useState('DevBro Academy');
  const [features, setFeatures] = useState<{ label: string; sub: string }[]>([
    { label: 'Clean Architecture', sub: 'Production-ready modular code structure' },
    { label: 'Documentation Included', sub: 'Step-by-step README and env setup' },
  ]);
  const [newFeatureLabel, setNewFeatureLabel] = useState('');
  const [newFeatureSub, setNewFeatureSub] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddFeature = () => {
    if (!newFeatureLabel.trim()) return;
    setFeatures((prev) => [
      ...prev,
      {
        label: newFeatureLabel.trim(),
        sub: newFeatureSub.trim() || 'Comprehensive integration module',
      },
    ]);
    setNewFeatureLabel('');
    setNewFeatureSub('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a project title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a project description.');
      return;
    }
    if (!sourceCodeUrl.trim()) {
      setErrorMsg('Please provide a valid source code link (GitHub, GitLab, or ZIP URL).');
      return;
    }

    setIsSubmitting(true);

    const generatedId =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;

    const safePassword =
      password.trim() ||
      `DEVBRO_${title.slice(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, '')}_${new Date().getFullYear()}`;

    // Color gradient variations based on category
    const categoryGradients: Record<string, { accentColor: string; gradient: string }> = {
      SAAS: {
        accentColor: '#0284c7',
        gradient: 'from-blue-600 via-sky-600 to-indigo-700',
      },
      'E-COMMERCE': {
        accentColor: '#10b981',
        gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
      },
      TRADING: {
        accentColor: '#f59e0b',
        gradient: 'from-amber-600 via-orange-600 to-red-700',
      },
    };

    const gradientConfig = categoryGradients[category] || {
      accentColor: '#8b5cf6',
      gradient: 'from-purple-600 via-violet-600 to-indigo-700',
    };

    const newProject: Project = {
      id: generatedId,
      title: title.trim(),
      category: category as any,
      description: description.trim(),
      bannerTitle: bannerTitle.trim() || title.trim(),
      bannerSubtext: 'Original Source Code • Developer Verified',
      features: features.length > 0 ? features : [
        { label: 'Source Code', sub: 'Full access to repository files' },
      ],
      accentColor: gradientConfig.accentColor,
      gradient: gradientConfig.gradient,
      downloads: 0,
      type: `${category} Engine`,
      minDonationUsdt: Math.max(0.5, parseFloat(minDonation) || 1.0),
      password: safePassword,
      youtubeVideoId: freeTasksAvailable ? youtubeVideoId : undefined,
      youtubeChannel: freeTasksAvailable ? youtubeChannel : undefined,
      freeTasksAvailable,
      sourceCodeUrl: sourceCodeUrl.trim(),
      demoUrl: demoUrl.trim() || undefined,
      author: user?.username || 'DevBro Creator',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newProject);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Upload Project
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  Developer Portal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Share your original source code with the DevBro developer community
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

        {/* Modal Body - Scrollable Form */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="upload-project-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Title & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                  <Code2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Project Title *</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js SaaS Boilerplate & Multi-Tenant CRM"
                  className="w-full text-sm font-semibold border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-900"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-600" />
                  <span>Category *</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm font-semibold border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white"
                >
                  <option value="SAAS">SaaS / Web App</option>
                  <option value="E-COMMERCE">E-Commerce</option>
                  <option value="TRADING">Trading / FinTech</option>
                  <option value="AI / ML">AI & Machine Learning</option>
                  <option value="MOBILE">Mobile App (Flutter/React Native)</option>
                  <option value="UTILITY">Developer Utility</option>
                </select>
              </div>
            </div>

            {/* Short Tagline / Banner Subtitle */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Short Tagline / Tech Stack Banner</span>
              </label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="e.g. React 19 • Node.js • Prisma • Stripe Integration"
                className="w-full text-sm border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-800"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <FileCode className="w-3.5 h-3.5 text-sky-600" />
                <span>Project Description *</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed summary of features, architecture, database models, and setup prerequisites..."
                className="w-full text-sm border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-800 resize-none"
              />
            </div>

            {/* Source Code Link & Demo URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-700" />
                    <span>Source Code Link *</span>
                  </div>
                  <span className="text-[10px] text-sky-600 font-normal">GitHub, GitLab, or ZIP</span>
                </label>
                <input
                  type="url"
                  required
                  value={sourceCodeUrl}
                  onChange={(e) => setSourceCodeUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full text-sm font-mono border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-800"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-700" />
                    <span>Live Demo URL (Optional)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Preview link</span>
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://demo.myproject.dev"
                  className="w-full text-sm font-mono border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-800"
                />
              </div>
            </div>

            {/* Minimum Donation & Archive Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Min Donation (USDT / INR)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Min $1.00 / ₹85</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={minDonation}
                  onChange={(e) => setMinDonation(e.target.value)}
                  className="w-full text-sm font-bold border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-900"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span>ZIP Password / Unlock Key</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Auto-generated if blank</span>
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. DEVBRO_SECURE_2026"
                  className="w-full text-sm font-mono border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-800"
                />
              </div>
            </div>

            {/* Key Features Bullets Builder */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Key Project Highlights ({features.length})</span>
                </div>
                <span className="text-[10px] text-slate-500">Displayed on project card</span>
              </label>

              <div className="space-y-2 mb-2.5">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs"
                  >
                    <div className="flex-1 truncate">
                      <span className="font-bold text-slate-900">{feat.label}: </span>
                      <span className="text-slate-600">{feat.sub}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add feature input row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newFeatureLabel}
                  onChange={(e) => setNewFeatureLabel(e.target.value)}
                  placeholder="Feature name (e.g. Authentication)"
                  className="text-xs border border-slate-300 rounded-lg py-2 px-2.5 flex-1"
                />
                <input
                  type="text"
                  value={newFeatureSub}
                  onChange={(e) => setNewFeatureSub(e.target.value)}
                  placeholder="Details (e.g. NextAuth & JWT sessions)"
                  className="text-xs border border-slate-300 rounded-lg py-2 px-2.5 flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Free Download Watch-to-Unlock Option */}
            <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl space-y-3">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Enable "Watch to Unlock" Free Download
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Users can unlock this project by completing your YouTube tasks.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={freeTasksAvailable}
                  onChange={(e) => setFreeTasksAvailable(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
              </label>

              {freeTasksAvailable && (
                <div className="pt-2 border-t border-sky-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      YouTube Video ID / URL
                    </label>
                    <input
                      type="text"
                      value={youtubeVideoId}
                      onChange={(e) => setYoutubeVideoId(e.target.value)}
                      placeholder="e.g. dQw4w9WgXcQ"
                      className="w-full text-xs font-mono border border-sky-200 bg-white rounded-lg py-1.5 px-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      YouTube Channel Name
                    </label>
                    <input
                      type="text"
                      value={youtubeChannel}
                      onChange={(e) => setYoutubeChannel(e.target.value)}
                      placeholder="e.g. DevBro Tutorials"
                      className="w-full text-xs border border-sky-200 bg-white rounded-lg py-1.5 px-2.5 text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="upload-project-form"
            disabled={isSubmitting}
            className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2.5 px-6 rounded-xl transition shadow-sm hover:shadow flex items-center gap-2 text-xs cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Publishing Project...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Submit &amp; Publish Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
