import React, { useState } from 'react';
import {
  Film,
  Plus,
  Play,
  Download,
  Trash2,
  Edit3,
  Sparkles,
  Music,
  FolderKanban,
  Sliders,
  Share2,
  CheckCircle2,
  Smartphone,
  Square,
  Search,
  Check,
  Eye,
  Volume2,
  Square as StopSquare,
  Zap,
  Loader2,
} from 'lucide-react';
import {
  PosterTemplate,
  BusinessProfile,
  VideoStudioProject,
  AdminVideoSettings,
  UserAccount,
} from '../../types';
import {
  getStoredVideoProjects,
  getStoredExportedVideos,
  deleteStoredVideoProject,
  saveStoredVideoProject,
  generateVideoProjectFromPoster,
  ExportedVideoRecord,
  DEFAULT_ANIMATION_TEMPLATES,
} from '../../utils/autoAnimatePoster';
import {
  ENTRANCE_PRESETS,
  MOVEMENT_PRESETS,
  EXIT_PRESETS,
} from '../../data/videoStudioPresets';
import { AUDIO_TRACKS_LIBRARY, videoStudioAudioEngine } from '../../data/videoStudioAudio';
import { AutoPosterReelModal } from '../video-studio/AutoPosterReelModal';

interface AdminVideoStudioTabProps {
  templates?: PosterTemplate[];
  activeProfile: BusinessProfile;
  currentUser?: UserAccount | null;
  videoSettings?: AdminVideoSettings;
  onUpdateVideoSettings?: (settings: AdminVideoSettings) => void;
  onOpenVideoStudio?: (poster?: PosterTemplate | null, project?: VideoStudioProject | null) => void;
}

type StudioSubmenu =
  | 'projects'
  | 'create'
  | 'templates'
  | 'presets'
  | 'music'
  | 'exported'
  | 'drafts'
  | 'settings';

export const AdminVideoStudioTab: React.FC<AdminVideoStudioTabProps> = ({
  templates = [],
  activeProfile,
  currentUser,
  videoSettings = {
    enabled: true,
    defaultResolution: '1080p',
    maxDurationSeconds: 15,
    watermarkEnabled: false,
    autoAnimateEnabled: true,
    fps60Enabled: true,
    allowedRoles: ['MASTER_ADMIN', 'ADMIN', 'VIDEO_EDITOR'],
  },
  onUpdateVideoSettings,
  onOpenVideoStudio,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<StudioSubmenu>('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const [projects, setProjects] = useState<VideoStudioProject[]>(() => getStoredVideoProjects());
  const [exportedVideos, setExportedVideos] = useState<ExportedVideoRecord[]>(() =>
    getStoredExportedVideos()
  );

  // Auto Video Player Modal State
  const [previewPoster, setPreviewPoster] = useState<PosterTemplate | null>(null);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  const refreshData = () => {
    setProjects(getStoredVideoProjects());
    setExportedVideos(getStoredExportedVideos());
  };

  const handleBatchGenerateAllVideos = () => {
    setIsBatchGenerating(true);
    let count = 0;
    try {
      templates.forEach((tpl) => {
        const proj = generateVideoProjectFromPoster(
          tpl,
          activeProfile,
          'ganesh_royal_intro',
          currentUser?.id || 'admin_user'
        );
        saveStoredVideoProject(proj);
        count++;
      });
      refreshData();
      setBatchNotice(`🎉 सर्व ${count} पोस्टर्सचे ऑटो-ॲनिमेटेड व्हिडिओ तयार झाले! Video Projects टॅबमध्ये पहा.`);
      setActiveSubmenu('projects');
      setTimeout(() => setBatchNotice(null), 8000);
    } catch (e: any) {
      console.error(e);
      setBatchNotice('व्हिडिओ तयार करताना त्रुटी आली: ' + (e?.message || 'Error'));
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    deleteStoredVideoProject(id);
    refreshData();
    setBatchNotice('व्हिडिओ प्रकल्प हटवण्यात आला.');
    setTimeout(() => setBatchNotice(null), 3000);
  };

  const handleToggleAudio = (trackId: string) => {
    if (playingTrackId === trackId) {
      videoStudioAudioEngine.stop();
      setPlayingTrackId(null);
    } else {
      videoStudioAudioEngine.playTrack(trackId, 0.8);
      setPlayingTrackId(trackId);
    }
  };

  // Filter Posters for "Create Video"
  const filteredPosters = (templates || []).filter((p) => {
    if (!p) return false;
    const q = (searchQuery || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const titleNative = (p.titleNative || '');
    const category = (p.category || '').toLowerCase();
    const matchesSearch =
      !q ||
      title.includes(q) ||
      titleNative.includes(q) ||
      category.includes(q);
    const matchesCat =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      p.subCategory === selectedCategory ||
      (selectedCategory === 'गणेशोत्सव' && (p.category === 'ganesh-chaturthi' || titleNative.includes('गणेश'))) ||
      (selectedCategory === 'दसरा व दिवाळी' && (p.category === 'navratri' || p.category === 'festivals' || titleNative.includes('दसरा') || titleNative.includes('दिवाळी'))) ||
      (selectedCategory === 'वाढदिवस' && (p.category === 'birthday-wishes' || titleNative.includes('वाढदिवस'))) ||
      (selectedCategory === 'बिझनेस' && (p.category === 'business' || p.category === 'business-promo'));
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5 text-white">
      {/* Batch Notification Toast */}
      {batchNotice && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xl shadow-emerald-900/30 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{batchNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setBatchNotice(null)}
            className="p-1 hover:bg-white/20 rounded-lg text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Banner & Submenu Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30 shrink-0">
            <Film className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>🎬 Gunashree Video Studio</span>
              <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                ADMIN PANEL
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              प्रत्येक पोस्टरचा ऑटो-मुव्हिंग व्हिडिओ तयार करा, घटक मुव्ह होऊन परिपूर्ण पोस्टर स्वरूपात दिसतील!
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Batch Generate All Posters Button */}
          <button
            type="button"
            disabled={isBatchGenerating}
            onClick={handleBatchGenerateAllVideos}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95 transition-all"
            title="सर्व पोस्टर्सचे आपोआप व्हिडिओ बनवा"
          >
            {isBatchGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>तयार होत आहेत...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>⚡ सर्व पोस्टर्सचे व्हिडिओ तयार करा</span>
              </>
            )}
          </button>

          {/* Open Studio Button */}
          <button
            type="button"
            onClick={() => onOpenVideoStudio?.(templates?.[0] || null, null)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Film className="w-4 h-4" />
            <span>🎬 व्हिडिओ स्टुडिओ उघडा (Launch Video Studio)</span>
          </button>
        </div>
      </div>

      {/* 2. Submenu Tabs (8 Submenus) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
        {[
          { id: 'projects', label: 'Video Projects', count: projects.length, icon: Film },
          { id: 'create', label: 'Create Video (Poster Selection)', icon: Plus },
          { id: 'templates', label: 'Animation Templates', count: DEFAULT_ANIMATION_TEMPLATES.length, icon: FolderKanban },
          { id: 'presets', label: 'Animation Presets (25)', count: 25, icon: Sparkles },
          { id: 'music', label: 'Music Library', count: AUDIO_TRACKS_LIBRARY.length, icon: Music },
          { id: 'exported', label: 'Exported Videos', count: exportedVideos.length, icon: Download },
          { id: 'drafts', label: 'Drafts', count: projects.filter((p) => p.status === 'draft').length, icon: Edit3 },
          { id: 'settings', label: 'Settings', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubmenu === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubmenu(tab.id as StudioSubmenu)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Submenu View Content */}

      {/* SUBMENU 1: VIDEO PROJECTS */}
      {activeSubmenu === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">सर्व व्हिडिओ प्रकल्प ({projects.length})</h3>
            <button
              type="button"
              onClick={() => onOpenVideoStudio?.(templates?.[0] || null, null)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-bold text-sm text-slate-300">कोणताही व्हिडिओ प्रकल्प अद्याप तयार केलेला नाही</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                "Create Video" टॅबमधून पोस्टर निवडून किंवा "New Project" बटण दाबून व्हिडिओ तयार करण्यास सुरुवात करा.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubmenu('create')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>पोस्टर निवडून व्हिडिओ बनवा</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Smartphone className="w-3 h-3" /> {proj.aspectRatio}
                      </span>
                      <span className="font-mono bg-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                        {proj.duration}s
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white truncate">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {proj.scenes?.[0]?.layers?.length || 0} Layers • Audio: {(proj.audioTrack || 'default').replace(/_/g, ' ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => onOpenVideoStudio?.(null, proj)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Open Editor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBMENU 2: CREATE VIDEO (POSTER SELECTION) */}
      {activeSubmenu === 'create' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="पोस्टर शोधा (नाव, सण, कॅटेगरी)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {['all', 'गणेशोत्सव', 'दसरा व दिवाळी', 'वाढदिवस', 'बिझनेस'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'सर्व' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Quick Banner inside Create Submenu */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>सर्व पोस्टर्सचे ऑटो-मुव्हिंग व्हिडिओ तयार करा</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                सर्व घटक (प्रतिमा, मजकूर, ब्रँडिंग) मुव्ह होऊन शेवटी परिपूर्ण पोस्टर स्वरूपात दिसतील असा व्हिडिओ त्वरित जनरेट करा.
              </p>
            </div>
            <button
              type="button"
              disabled={isBatchGenerating}
              onClick={handleBatchGenerateAllVideos}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>⚡ सर्व {templates.length} पोस्टर्सचे व्हिडिओ बनवा</span>
            </button>
          </div>

          {/* Posters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredPosters.map((poster) => (
              <div
                key={poster.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-2.5 flex flex-col justify-between gap-2.5 transition-all shadow-md group hover:shadow-xl hover:shadow-amber-500/10"
              >
                {/* Poster Miniature Visual Card (Clickable to preview auto video) */}
                <div
                  onClick={() => setPreviewPoster(poster)}
                  className={`w-full aspect-square rounded-xl bg-gradient-to-br ${poster.theme?.bgGradient || poster.bgGradient || 'from-amber-950 via-orange-950 to-red-950'} p-2.5 flex flex-col justify-between relative overflow-hidden cursor-pointer group-hover:scale-[1.02] transition-transform`}
                >
                  {/* Poster Image / Artwork if available */}
                  {(poster.imageUrl || poster.thumbnailUrl || (poster as any).customBgUrl || poster.bgImage) ? (
                    <img
                      src={poster.imageUrl || poster.thumbnailUrl || (poster as any).customBgUrl || poster.bgImage}
                      alt={poster.title || 'Poster'}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                  <div className="flex items-center justify-between z-10">
                    <span className="text-xl drop-shadow-md">🔱</span>
                    <span className="text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-md truncate max-w-[85px]">
                      {poster.category || 'Festival'}
                    </span>
                  </div>

                  {/* Headline & Native Title Preview inside thumbnail */}
                  <div className="z-10 bg-black/60 backdrop-blur-xs p-1.5 rounded-lg border border-white/10 text-center">
                    <p className="text-[10px] font-black text-amber-300 truncate drop-shadow-sm">
                      {poster.headline || poster.titleNative || poster.title || 'सण व उत्सव'}
                    </p>
                    <p className="text-[8px] text-white/90 truncate">
                      {poster.subtext || poster.title || 'GrowView Festive'}
                    </p>
                  </div>

                  {/* Hover Overlay with Big Play Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-white truncate">
                    {poster.titleNative || poster.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {poster.headline || poster.category}
                  </p>
                </div>

                {/* Dual Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  {/* Primary: Auto Video Player */}
                  <button
                    type="button"
                    onClick={() => setPreviewPoster(poster)}
                    className="flex-1 py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all shadow-xs"
                    title="ऑटो-मुव्हिंग व्हिडिओ पहा व डाऊनलोड करा"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>ऑटो व्हिडिओ</span>
                  </button>

                  {/* Secondary: Full Studio */}
                  <button
                    type="button"
                    onClick={() => onOpenVideoStudio?.(poster, null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 transition-all active:scale-95 cursor-pointer"
                    title="संपूर्ण व्हिडिओ स्टुडिओमध्ये उघडा"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMENU 3: ANIMATION TEMPLATES */}
      {activeSubmenu === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEFAULT_ANIMATION_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span className="bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-md uppercase">
                      {tmpl.category}
                    </span>
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded-md text-amber-300 font-bold">
                      {tmpl.duration}s
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{tmpl.name}</h4>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">{tmpl.nameMarathi}</p>
                  <p className="text-xs text-slate-400 mt-2">{tmpl.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenVideoStudio(null, null)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Use Template</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMENU 4: 25 ANIMATION PRESETS CATALOG */}
      {activeSubmenu === 'presets' && (
        <div className="space-y-6">
          {/* 10 Entrance */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>10 Entrance Animation Presets (प्रवेश ॲनिमेशन)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {ENTRANCE_PRESETS.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-1.5 hover:border-amber-500/40 transition-colors"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold text-amber-500">Preset #{i + 1}</div>
                    <h5 className="font-bold text-xs text-white mt-0.5">{p.name}</h5>
                    <p className="text-[11px] text-amber-300/70">{p.nameMarathi}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Movement */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>10 Movement Animation Presets (हालचाल ॲनिमेशन)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {MOVEMENT_PRESETS.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-1.5 hover:border-cyan-500/40 transition-colors"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold text-cyan-400">Preset #{i + 11}</div>
                    <h5 className="font-bold text-xs text-white mt-0.5">{p.name}</h5>
                    <p className="text-[11px] text-cyan-300/70">{p.nameMarathi}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Exit */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-rose-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>5 Exit Animation Presets (शेवट ॲनिमेशन)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {EXIT_PRESETS.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-1.5 hover:border-rose-500/40 transition-colors"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold text-rose-400">Preset #{i + 21}</div>
                    <h5 className="font-bold text-xs text-white mt-0.5">{p.name}</h5>
                    <p className="text-[11px] text-rose-300/70">{p.nameMarathi}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMENU 5: MUSIC LIBRARY */}
      {activeSubmenu === 'music' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {AUDIO_TRACKS_LIBRARY.map((track) => {
              const isPlaying = playingTrackId === track.id;
              return (
                <div
                  key={track.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md uppercase">
                        {track.category}
                      </span>
                      <span className="font-mono text-slate-400">{track.bpm} BPM</span>
                    </div>

                    <h5 className="font-bold text-sm text-white mt-1">{track.name}</h5>
                    <p className="text-xs text-amber-300/80">{track.nameMarathi}</p>
                    <p className="text-[11px] text-slate-400 mt-2">{track.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleToggleAudio(track.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        isPlaying
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isPlaying ? <StopSquare className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isPlaying ? 'थांबवा' : 'ऐका (Play)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenVideoStudio(null, null)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300"
                    >
                      Use in Video
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBMENU 6: EXPORTED VIDEOS */}
      {activeSubmenu === 'exported' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">तयार झालेले एक्सपोर्टेड व्हिडिओ ({exportedVideos.length})</h3>
          </div>

          {exportedVideos.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <Download className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-bold text-sm text-slate-300">कोणताही व्हिडिओ अद्याप एक्सपोर्ट केलेला नाही</p>
              <p className="text-xs text-slate-500">
                व्हिडिओ स्टुडिओमध्ये प्रकल्प तयार करून "Export MP4" बटण दाबल्यावर व्हिडिओ येथे दिसतील.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {exportedVideos.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-md"
                >
                  <div className="aspect-[9/16] max-h-56 bg-black rounded-xl overflow-hidden flex items-center justify-center">
                    <video src={rec.downloadUrl} controls className="w-full h-full object-contain" />
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-white truncate">{rec.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {rec.aspectRatio} • {rec.duration}s • {new Date(rec.exportedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                    <a
                      href={rec.downloadUrl}
                      download={`${rec.title}.mp4`}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MP4</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBMENU 7: DRAFTS */}
      {activeSubmenu === 'drafts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects
              .filter((p) => p.status === 'draft')
              .map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">
                      DRAFT
                    </span>
                    <h4 className="font-bold text-sm text-white mt-2 truncate">{proj.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{proj.duration}s • {proj.aspectRatio}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenVideoStudio(null, proj)}
                    className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Resume Editing</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBMENU 8: SETTINGS */}
      {activeSubmenu === 'settings' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-sm text-white">ग्लोबल व्हिडिओ स्टुडिओ सेटींग्ज</h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">व्हिडिओ स्टुडिओ ॲक्सेस सक्षम करा</div>
                <div className="text-[11px] text-slate-400">फक्त अधिकृत ॲडमीन व व्हिडिओ एडिटर्ससाठी उपलब्ध</div>
              </div>
              <input
                type="checkbox"
                checked={videoSettings.enabled}
                onChange={(e) =>
                  onUpdateVideoSettings({ ...videoSettings, enabled: e.target.checked })
                }
                className="w-5 h-5 accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Default Export Resolution</div>
                <div className="text-[11px] text-slate-400">नवीन प्रकल्पांसाठी प्राथमिक रिझोल्यूशन</div>
              </div>
              <select
                value={videoSettings.defaultResolution}
                onChange={(e) =>
                  onUpdateVideoSettings({
                    ...videoSettings,
                    defaultResolution: e.target.value as '1080p' | '720p' | '480p',
                  })
                }
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-bold"
              >
                <option value="1080p">1080p (Full HD)</option>
                <option value="720p">720p (HD)</option>
                <option value="480p">480p (SD)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">60 FPS Render Support</div>
                <div className="text-[11px] text-slate-400">हाय-फ्रेमरेट स्मूथ ॲनिमेशन</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(videoSettings.fps60Enabled)}
                onChange={(e) =>
                  onUpdateVideoSettings?.({ ...videoSettings, fps60Enabled: e.target.checked })
                }
                className="w-5 h-5 accent-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto Poster Animated Reel Modal (Opens upon clicking "ऑटो व्हिडिओ" on any poster) */}
      {previewPoster && (
        <AutoPosterReelModal
          isOpen={Boolean(previewPoster)}
          onClose={() => setPreviewPoster(null)}
          poster={previewPoster}
          activeProfile={activeProfile}
          allPosters={filteredPosters.length > 0 ? filteredPosters : templates}
          onSelectPoster={(p) => setPreviewPoster(p)}
          onOpenFullStudio={(p, proj) => {
            setPreviewPoster(null);
            onOpenVideoStudio?.(p, proj);
          }}
        />
      )}
    </div>
  );
};
