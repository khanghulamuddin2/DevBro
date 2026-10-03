import React, { useState, useEffect, useRef } from 'react';
import { Project, ScreenType } from '../../types';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Share2,
  Settings,
  Lock,
  Unlock,
  Check,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  AlertTriangle,
  Download,
  FastForward,
  RotateCcw,
  Sparkles,
  Key,
} from 'lucide-react';

interface WatchToUnlockScreenProps {
  project: Project;
  onNavigate: (screen: ScreenType) => void;
  onUnlockCompleted: (project: Project) => void;
  onOpenPasswordModal: (password: string, title: string) => void;
}

export const WatchToUnlockScreen: React.FC<WatchToUnlockScreenProps> = ({
  project,
  onNavigate,
  onUnlockCompleted,
  onOpenPasswordModal,
}) => {
  // Step tracking: 1 = Watch Video, 2 = Like & Subscribe, 3 = Submit Proof & Download, 4 = Completed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Video playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [watchSeconds, setWatchSeconds] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [tabWarningTriggered, setTabWarningTriggered] = useState<boolean>(false);
  const [simulatedTabEnforcement, setSimulatedTabEnforcement] = useState<boolean>(true);

  // Step 2 task states
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasCommented, setHasCommented] = useState<boolean>(false);
  const [hasSubscribed, setHasSubscribed] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>(
    'Great tutorial on the Real Estate SaaS! Thanks for sharing the source code.'
  );

  // Step 3 proof states
  const [ytUsername, setYtUsername] = useState<string>('@khanghulamuddin');
  const [proofUploaded, setProofUploaded] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState<boolean>(false);

  // Total required seconds: 5 minutes = 300 seconds
  const REQUIRED_SECONDS = 300;
  const progressPercent = Math.min(100, Math.round((watchSeconds / REQUIRED_SECONDS) * 100));

  // Timer loop for video playback
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && watchSeconds < REQUIRED_SECONDS) {
      interval = setInterval(() => {
        setWatchSeconds((prev) => {
          const next = prev + playbackSpeed;
          if (next >= REQUIRED_SECONDS) {
            setIsPlaying(false);
            return REQUIRED_SECONDS;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, watchSeconds, playbackSpeed]);

  // Tab visibility change detection (Keep this tab open enforcement)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && simulatedTabEnforcement && isPlaying) {
        setIsPlaying(false);
        setTabWarningTriggered(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [simulatedTabEnforcement, isPlaying]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isStep1Done = watchSeconds >= REQUIRED_SECONDS;
  const isStep2Done = hasLiked && hasCommented && hasSubscribed;

  const handleInstantUnlock = () => {
    setWatchSeconds(REQUIRED_SECONDS);
    setIsPlaying(false);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setUnlockedSuccess(true);
      setCurrentStep(4);
      onUnlockCompleted(project);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Title and Back Button Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Watch to unlock free download
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm sm:text-base font-medium">
            {project.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </section>

      {/* Steps Tracker */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div
          onClick={() => isStep1Done && setCurrentStep(1)}
          className={`relative rounded-2xl p-5 flex flex-col justify-between transition ${
            currentStep === 1
              ? 'bg-[#eaf6ff] border-2 border-sky-400 shadow-sm'
              : isStep1Done
              ? 'bg-emerald-50/70 border border-emerald-200 cursor-pointer'
              : 'bg-slate-50 border border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isStep1Done
                  ? 'bg-emerald-200 text-emerald-700'
                  : currentStep === 1
                  ? 'bg-sky-200 text-sky-600'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isStep1Done ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </div>
            {isStep1Done && (
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Step 1</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Watch the video (5 mins)</p>
          </div>
        </div>

        {/* Step 2 */}
        <div
          onClick={() => isStep1Done && setCurrentStep(2)}
          className={`relative rounded-2xl p-5 flex flex-col justify-between transition ${
            currentStep === 2
              ? 'bg-[#f4effc] border-2 border-purple-400 shadow-sm'
              : isStep2Done
              ? 'bg-emerald-50/70 border border-emerald-200 cursor-pointer'
              : isStep1Done
              ? 'bg-purple-50/50 border border-purple-100 cursor-pointer'
              : 'bg-slate-50 border border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isStep2Done
                  ? 'bg-emerald-200 text-emerald-700'
                  : currentStep === 2
                  ? 'bg-purple-200 text-purple-600'
                  : 'bg-purple-100 text-purple-400'
              }`}
            >
              {isStep2Done ? <Check className="w-5 h-5 stroke-[2.5]" /> : <ThumbsUp className="w-4 h-4" />}
            </div>
            {isStep2Done && (
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Step 2</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Like, comment & subscribe</p>
          </div>
        </div>

        {/* Step 3 */}
        <div
          onClick={() => isStep2Done && setCurrentStep(3)}
          className={`relative rounded-2xl p-5 flex flex-col justify-between transition ${
            currentStep === 3
              ? 'bg-[#fef1e8] border-2 border-orange-400 shadow-sm'
              : unlockedSuccess
              ? 'bg-emerald-50/70 border border-emerald-200'
              : isStep2Done
              ? 'bg-orange-50/50 border border-orange-100 cursor-pointer'
              : 'bg-slate-50 border border-slate-200 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                unlockedSuccess
                  ? 'bg-emerald-200 text-emerald-700'
                  : currentStep === 3
                  ? 'bg-orange-200 text-orange-600'
                  : 'bg-orange-100 text-orange-400'
              }`}
            >
              {unlockedSuccess ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Download className="w-4 h-4" />}
            </div>
            {unlockedSuccess && (
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full">
                Unlocked
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Step 3</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Submit proof & download</p>
          </div>
        </div>
      </section>

      {/* Warning Notice */}
      <section>
        <div className="bg-[#fef8e7] border-l-4 border-amber-500 rounded-r-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
          <div className="shrink-0 text-amber-600 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm flex-1">
            <h4 className="font-bold text-amber-900 leading-tight">Keep this tab open</h4>
            <p className="text-amber-800/90 mt-1 leading-relaxed">
              Switching tabs or minimizing the browser before the timer finishes will reset your
              progress and restart the video from the beginning.
            </p>
            {tabWarningTriggered && (
              <div className="mt-2 text-xs font-semibold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center justify-between">
                <span>⚠️ Tab switch detected! Playback was paused as per policy.</span>
                <button
                  onClick={() => setTabWarningTriggered(false)}
                  className="underline ml-2 text-rose-800 hover:text-rose-900"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STEP 1: Video Player & Progress Card */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-100 flex flex-col gap-6">
          {/* Video Player Viewport Container */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner group select-none">
            {/* Top Video Overlay */}
            <div className="absolute top-0 inset-x-0 z-20 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-xs border border-white/40">
                  CO
                </div>
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-semibold truncate max-w-xs sm:max-w-md">
                    Free Real Estate Marketplace Website | Complete SaaS Source Code
                  </p>
                  <p className="text-[11px] text-slate-300">Codetai • 21:28</p>
                </div>
              </div>

              {/* YouTube Video Control Icons */}
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs font-semibold px-1.5 py-0.5 border border-white/60 rounded cursor-pointer">
                  CC
                </span>
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 5 : 1)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded cursor-pointer transition ${
                    playbackSpeed > 1 ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-white/20'
                  }`}
                  title="Toggle Fast Simulation Speed"
                >
                  {playbackSpeed}x
                </button>
                <Settings className="w-4 h-4 cursor-pointer" />
              </div>
            </div>

            {/* Video Content Simulation Canvas */}
            <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center overflow-hidden">
              {/* Simulated UI Screen inside video */}
              <div className="w-full h-full bg-[#f8fafc] flex flex-col scale-95 rounded-lg overflow-hidden border border-slate-700 shadow-2xl relative">
                {/* Simulated Web Nav inside video */}
                <div className="h-9 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500 font-semibold shrink-0">
                  <span className="text-sky-600 font-bold text-sm tracking-tight">&lt;/&gt; Estaly Real Estate</span>
                  <div className="flex gap-4">
                    <span className="text-slate-900 font-bold">Home</span>
                    <span>Properties</span>
                    <span>Pricing</span>
                    <span>Contact</span>
                  </div>
                  <span className="text-slate-400">Customer | Vendor Portal</span>
                </div>

                {/* Hero section simulation */}
                <div className="p-6 flex-1 bg-gradient-to-r from-slate-100 to-sky-50 flex items-center justify-between">
                  <div className="space-y-3 max-w-sm">
                    <span className="text-[11px] uppercase tracking-wider text-sky-600 font-bold bg-sky-100 px-2.5 py-0.5 rounded">
                      Training For You
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                      Find Your Next Dream Luxury Real Estate
                    </h4>
                    <p className="text-xs text-slate-500">
                      Automated booking engine, dynamic MLS listings, multi-vendor broker subscriptions.
                    </p>

                    {/* Grid of property types */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="bg-white p-2 rounded shadow-2xs text-center text-[10px] text-sky-600 font-bold border border-sky-100">
                        🏠 House
                      </div>
                      <div className="bg-white p-2 rounded shadow-2xs text-center text-[10px] text-purple-600 font-bold border border-purple-100">
                        🏢 Apartment
                      </div>
                      <div className="bg-white p-2 rounded shadow-2xs text-center text-[10px] text-emerald-600 font-bold border border-emerald-100">
                        🏨 Hotel
                      </div>
                      <div className="bg-white p-2 rounded shadow-2xs text-center text-[10px] text-rose-600 font-bold border border-rose-100">
                        🏬 Condo
                      </div>
                      <div className="bg-white p-2 rounded shadow-2xs text-center text-[10px] text-amber-600 font-bold border border-amber-100">
                        🏡 Villa
                      </div>
                      <div className="bg-white p-2 rounded shadow-2xs text-center text-[10px] text-indigo-600 font-bold border border-indigo-100">
                        🏘️ Town
                      </div>
                    </div>
                  </div>

                  {/* Simulated 3D property card */}
                  <div className="hidden sm:flex w-52 h-40 bg-slate-900 rounded-xl shadow-lg flex-col items-center justify-center text-white/90 border border-slate-700 relative overflow-hidden p-3 text-center">
                    <div className="text-xs font-bold text-sky-400 mb-1">Live Source Code</div>
                    <div className="text-[11px] text-slate-300">Complete Laravel + Vue SaaS</div>
                    <div className="mt-3 px-3 py-1 text-[10px] font-bold bg-sky-600 rounded-full text-white">
                      Ready to Deploy
                    </div>
                  </div>
                </div>

                {/* Simulated playing status indicator */}
                {isPlaying && (
                  <div className="absolute top-12 right-6 px-3 py-1 bg-red-600 text-white text-[11px] font-bold rounded-full shadow-md animate-pulse flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span>LIVE WATCHING</span>
                  </div>
                )}
              </div>

              {/* Big Center Play / Pause Icon overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute z-20 w-16 h-12 bg-red-600/95 hover:bg-red-700 active:scale-95 transition rounded-2xl flex items-center justify-center text-white shadow-xl cursor-pointer"
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Bottom Video Controls Bar Overlay */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-1.5 text-white">
              {/* Scrubber Track */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  setWatchSeconds(Math.floor(ratio * REQUIRED_SECONDS));
                }}
                className="w-full bg-white/30 h-1.5 rounded-full relative cursor-pointer group/bar"
              >
                <div
                  className="bg-red-600 h-full rounded-full relative flex items-center justify-end"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="w-3.5 h-3.5 bg-red-600 rounded-full shadow absolute -right-1.5"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-red-500 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <span className="font-mono text-[11px] text-slate-300">
                    {formatTime(watchSeconds)} / {formatTime(REQUIRED_SECONDS)}
                  </span>
                </div>

                {/* Center Captions text inside player */}
                <div className="hidden sm:block text-center text-[11px] bg-black/60 px-3 py-0.5 rounded text-white/90 font-sans">
                  Today, I will show you a complete real estate marketplace SaaS website.
                </div>

                <div className="flex items-center gap-3">
                  <button className="hover:text-white cursor-pointer" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="hover:text-white cursor-pointer" title="Fullscreen">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Simulation Bar for Easy Testing */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Simulator Controls:</span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
              </button>
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 10 : 1)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <FastForward className="w-3 h-3 text-sky-600" />
                <span>Speed: {playbackSpeed}x</span>
              </button>
              <button
                onClick={() => {
                  setWatchSeconds(0);
                  setIsPlaying(false);
                }}
                className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-500 cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={handleInstantUnlock}
              className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Finish 5:00</span>
            </button>
          </div>

          {/* Watch Progress Status Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold tracking-wider text-slate-500 uppercase text-[11px] sm:text-xs">
                Watch Progress
              </span>
              <span className="font-bold text-slate-800 text-sm sm:text-base font-mono tabular-nums">
                {formatTime(watchSeconds)} / {formatTime(REQUIRED_SECONDS)}
              </span>
            </div>

            {/* Progress Bar Indicator */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isStep1Done ? 'bg-emerald-500' : 'bg-sky-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Progress Sub-labels */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{progressPercent}% completed</span>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                <span>5 min required</span>
              </div>
            </div>
          </div>

          {/* Next Step Action Button */}
          <div className="pt-1 flex flex-col items-center gap-2.5">
            {isStep1Done ? (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Next: Like, comment & subscribe</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3.5 px-4 bg-slate-100 text-slate-400 font-semibold rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200/60 shadow-2xs"
              >
                <Lock className="w-4 h-4 fill-current text-slate-400" />
                <span>Next: Like, comment & subscribe</span>
              </button>
            )}

            <p className="text-xs text-slate-500 text-center font-medium">
              You must watch at least <span className="font-bold text-slate-700">5 minute(s)</span> to unlock the next step.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Like, Comment & Subscribe Tasks Card */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-100 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                Step 2 of 3
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">
                Engage with the Video
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Complete these 3 simple YouTube tasks to support the developer.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Step progress</span>
              <div className="text-lg font-bold text-purple-700">
                {[hasLiked, hasCommented, hasSubscribed].filter(Boolean).length} / 3
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Task 1: Like Video */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                    hasLiked ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-700 shadow-xs'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">1. Like the video</h4>
                  <p className="text-xs text-slate-500">Give a thumbs up on the YouTube video.</p>
                </div>
              </div>
              <button
                onClick={() => setHasLiked(!hasLiked)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  hasLiked
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {hasLiked && <Check className="w-3.5 h-3.5" />}
                <span>{hasLiked ? 'Liked!' : 'Click to Like'}</span>
              </button>
            </div>

            {/* Task 2: Comment on Video */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      hasCommented ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-700 shadow-xs'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">2. Leave a positive comment</h4>
                    <p className="text-xs text-slate-500">Write a brief comment about the project or feature.</p>
                  </div>
                </div>
                <button
                  onClick={() => setHasCommented(!hasCommented)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    hasCommented
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {hasCommented && <Check className="w-3.5 h-3.5" />}
                  <span>{hasCommented ? 'Commented!' : 'Post Comment'}</span>
                </button>
              </div>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
                className="w-full text-xs rounded-xl border border-slate-300 bg-white py-2 px-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Task 3: Subscribe Channel */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                    hasSubscribed ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-700 shadow-xs'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">3. Subscribe to Codetai</h4>
                  <p className="text-xs text-slate-500">Join the developer channel for new source codes.</p>
                </div>
              </div>
              <button
                onClick={() => setHasSubscribed(!hasSubscribed)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  hasSubscribed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                {hasSubscribed && <Check className="w-3.5 h-3.5" />}
                <span>{hasSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ← Back to Video
            </button>

            <button
              disabled={!isStep2Done}
              onClick={() => setCurrentStep(3)}
              className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 ${
                isStep2Done
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <span>Continue to Step 3</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Submit Proof & Download */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-100 space-y-6">
          <div>
            <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
              Final Step
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Submit Proof & Unlock Download
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Confirm your YouTube handle or proof to instantly generate your private download package.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Your YouTube Channel Handle / Username
              </label>
              <input
                type="text"
                value={ytUsername}
                onChange={(e) => setYtUsername(e.target.value)}
                placeholder="@yourhandle"
                className="w-full text-sm border-slate-300 rounded-xl py-2.5 px-3.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to verify your like, comment, and subscription on the video.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Proof Verification Screenshot (Optional)
              </label>
              <div
                onClick={() => setProofUploaded(true)}
                className="border-2 border-dashed border-slate-200 hover:border-sky-400 bg-slate-50/50 rounded-2xl p-6 text-center cursor-pointer transition"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {proofUploaded ? 'yt_engagement_proof_screenshot.png' : 'Click to attach proof screenshot'}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Verification auto-validated (PNG, 1.4 MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ← Back to Engagement
            </button>

            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying & Generating Package...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Verify & Unlock Free Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Unlocked State */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Download Unlocked!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Congratulations! Your Source Code is Ready
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
              You have successfully completed all video tasks. You can now download the complete
              package and view the zip archive password below.
            </p>
          </div>

          {/* Password Reveal Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider">Archive Password</span>
              <span className="text-emerald-600 font-bold">Encrypted ZIP</span>
            </div>
            <div className="flex items-center justify-between bg-white border border-slate-300 rounded-xl px-4 py-2.5">
              <code className="font-mono text-sm font-bold text-slate-800 select-all">
                {project.password || 'DEVBRO_REALESTATE_2026'}
              </code>
              <button
                onClick={() =>
                  onOpenPasswordModal(
                    project.password || 'DEVBRO_REALESTATE_2026',
                    project.title
                  )
                }
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
              >
                Copy Key
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`#download-${project.id}`}
              onClick={(e) => {
                e.preventDefault();
                alert(`Starting direct download for ${project.title}.zip!`);
                onNavigate('downloads');
              }}
              className="px-6 py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP Package</span>
            </a>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
