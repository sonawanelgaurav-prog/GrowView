import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Sun, 
  Crown, 
  Palette, 
  Video, 
  Tag, 
  Gift, 
  Briefcase, 
  Moon, 
  Sunrise, 
  Zap, 
  TrendingUp, 
  MessageCircle,
  Building2,
  Users
} from 'lucide-react';
import {
  loadUserDashboardConfig,
  UserDashboardConfig,
  DashboardStoryItem,
  DEFAULT_DASHBOARD_STORIES,
} from '../../data/userDashboardConfig';

// Helper to map icon name strings to icons
const getStoryIconComponent = (name: string): React.ElementType => {
  switch (name) {
    case 'Flame': return Flame;
    case 'Crown': return Crown;
    case 'Moon': return Moon;
    case 'Sun': return Sun;
    case 'Palette': return Palette;
    case 'Video': return Video;
    case 'Sunrise': return Sunrise;
    case 'Briefcase': return Briefcase;
    case 'Tag': return Tag;
    case 'Building2': return Building2;
    case 'Users': return Users;
    case 'Zap': return Zap;
    case 'TrendingUp': return TrendingUp;
    default: return Sparkles;
  }
};

export interface StoryPillItem {
  id: string;
  label: string;
  labelMarathi: string;
  icon: React.ElementType;
  gradient: string;
  badge?: string;
  isLive?: boolean;
  categoryFilter: string;
  groupFilter?: string;
  formatFilter?: 'all' | '1:1' | '9:16' | 'video';
  actionType?: 'filter' | 'ai' | 'vip';
}

interface BrandsLiveStoryTrayProps {
  activeCategory: string;
  activeGroup: string;
  onSelectStory: (story: StoryPillItem) => void;
  onOpenAIModal: () => void;
  onOpenVIPModal: () => void;
}

export const STORY_PILLS: StoryPillItem[] = [
  {
    id: 'master-designs',
    label: '👑 Master Designs (150)',
    labelMarathi: '👑 १५० मास्टर डिझाईन्स',
    icon: Sparkles,
    gradient: 'from-amber-500 via-yellow-500 to-amber-600',
    badge: '150 Designs',
    isLive: true,
    categoryFilter: 'master-designs',
    groupFilter: 'special',
  },
  {
    id: 'wedding-invitation',
    label: 'Wedding Cards (50)',
    labelMarathi: '💍 लग्नपत्रिका (५०)',
    icon: Gift,
    gradient: 'from-rose-600 via-pink-600 to-red-600',
    badge: '50 Designs',
    categoryFilter: 'wedding-invitation',
    groupFilter: 'special',
  },
  {
    id: 'engagement-ceremony',
    label: 'Engagement (50)',
    labelMarathi: '💎 साखरपुडा (५०)',
    icon: Crown,
    gradient: 'from-purple-600 via-indigo-600 to-pink-600',
    badge: '50 Designs',
    categoryFilter: 'engagement-ceremony',
    groupFilter: 'special',
  },
  {
    id: 'biodata-resume',
    label: 'Resume & CV (50)',
    labelMarathi: '📄 बायोडाटा / CV (५०)',
    icon: Briefcase,
    gradient: 'from-blue-600 via-cyan-600 to-indigo-700',
    badge: '50 Designs',
    categoryFilter: 'biodata-resume',
    groupFilter: 'special',
  },
  {
    id: 'today-special',
    label: "Today's Special",
    labelMarathi: 'आजचे विशेष',
    icon: Flame,
    gradient: 'from-red-500 via-orange-500 to-amber-500',
    badge: 'LIVE',
    isLive: true,
    categoryFilter: 'all',
    groupFilter: 'upcoming',
  },
  {
    id: 'shivaji-jayanti',
    label: 'Shivaji Jayanti',
    labelMarathi: 'शिवजयंती',
    icon: Crown,
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    badge: '19 Feb',
    categoryFilter: 'shivaji-jayanti',
    groupFilter: 'festivals',
  },
  {
    id: 'maha-shivratri',
    label: 'Maha Shivratri',
    labelMarathi: 'महाशिवरात्री',
    icon: Moon,
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    badge: '26 Feb',
    categoryFilter: 'shivratri',
    groupFilter: 'festivals',
  },
  {
    id: 'holi-festival',
    label: 'Holi Special',
    labelMarathi: 'होळी व रंगपंचमी',
    icon: Palette,
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    badge: 'Festive',
    categoryFilter: 'holi',
    groupFilter: 'festivals',
  },
  {
    id: 'ganesh-chaturthi',
    label: 'Ganesh Chaturthi',
    labelMarathi: 'गणेशोत्सव १००',
    icon: Sun,
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    badge: '100 Designs',
    isLive: true,
    categoryFilter: 'ganesh-chaturthi',
    groupFilter: 'festivals',
  },
  {
    id: 'good-morning-quotes',
    label: 'Good Morning',
    labelMarathi: 'शुभ सकाळ ५०',
    icon: Sunrise,
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    badge: '50 Designs',
    categoryFilter: 'good-morning-quotes',
    groupFilter: 'daily',
  },
  {
    id: 'good-night-quotes',
    label: 'Good Night',
    labelMarathi: 'शुभ रात्र ५०',
    icon: Moon,
    gradient: 'from-indigo-600 via-purple-700 to-slate-900',
    badge: '50 Designs',
    categoryFilter: 'good-night-quotes',
    groupFilter: 'daily',
  },
  {
    id: 'business-branding',
    label: 'Business Posts',
    labelMarathi: 'उद्योग व जाहिरात',
    icon: Briefcase,
    gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    categoryFilter: 'all',
    groupFilter: 'business',
  },
  {
    id: 'video-status',
    label: 'Video Status',
    labelMarathi: 'व्हिडिओ स्टेटस',
    icon: Video,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    badge: 'HD Video',
    categoryFilter: 'video-posts',
    formatFilter: 'video',
  },
  {
    id: 'daily-suvichar',
    label: 'Daily Quotes',
    labelMarathi: 'यशस्वी सुविचार',
    icon: Sun,
    gradient: 'from-purple-600 via-fuchsia-600 to-pink-500',
    categoryFilter: 'quotes-motivation',
    groupFilter: 'daily',
  },
  {
    id: 'birthday-wishes',
    label: 'Birthday',
    labelMarathi: 'वाढदिवस शुभेच्छा',
    icon: Gift,
    gradient: 'from-rose-500 via-pink-500 to-amber-500',
    categoryFilter: 'birthday-wishes',
    groupFilter: 'daily',
  },
  {
    id: 'mega-offers',
    label: 'Sale Dhamaka',
    labelMarathi: 'ऑफर व सेल',
    icon: Tag,
    gradient: 'from-red-600 via-rose-600 to-orange-500',
    badge: 'Hot Deal',
    categoryFilter: 'business-promo',
    groupFilter: 'business',
  },
  {
    id: 'ai-magic',
    label: 'AI Slogans',
    labelMarathi: 'AI पोस्ट मेकर',
    icon: Sparkles,
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    badge: 'AI Smart',
    categoryFilter: 'all',
    actionType: 'ai',
  },
];

export const BrandsLiveStoryTray: React.FC<BrandsLiveStoryTrayProps> = ({
  activeCategory,
  activeGroup,
  onSelectStory,
  onOpenAIModal,
  onOpenVIPModal,
}) => {
  const [dashboardConfig, setDashboardConfig] = useState<UserDashboardConfig>(() => loadUserDashboardConfig());

  useEffect(() => {
    const handleConfigChange = (e: any) => {
      if (e?.detail) {
        setDashboardConfig(e.detail);
      } else {
        setDashboardConfig(loadUserDashboardConfig());
      }
    };
    window.addEventListener('growview:dashboard_config_updated', handleConfigChange);
    return () => window.removeEventListener('growview:dashboard_config_updated', handleConfigChange);
  }, []);

  if (!dashboardConfig?.showStoryTray) {
    return null;
  }

  const activeStories = (dashboardConfig?.stories || []).filter((s) => s.enabled);
  if (activeStories.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight flex items-center gap-1.5">
            {dashboardConfig.storyTrayTitle || 'Trending Daily Stories & Events'}
          </h3>
          <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full border border-orange-200">
            {dashboardConfig.storyTrayTitleMarathi || 'दैनिक ट्रेंड्स'}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
          Swipe to explore all events ➔
        </span>
      </div>

      {/* Horizontal Story Reels Row */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1.5 pt-1 px-1 no-scrollbar scroll-smooth">
        {activeStories.map((story) => {
          const IconComp = getStoryIconComponent(story.iconName);
          const isSelected =
            (story.categoryFilter !== 'all' && activeCategory === story.categoryFilter) ||
            (story.categoryFilter === 'all' && story.groupFilter && activeGroup === story.groupFilter);

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                onSelectStory({
                  id: story.id,
                  label: story.label,
                  labelMarathi: story.labelMarathi,
                  icon: IconComp,
                  gradient: story.gradient,
                  badge: story.badge,
                  isLive: story.isLive,
                  categoryFilter: story.categoryFilter,
                  groupFilter: story.groupFilter,
                  formatFilter: story.formatFilter,
                });
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              {/* Circular Avatar with Gradient Ring */}
              <div className="relative">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] bg-gradient-to-tr ${
                    story.gradient
                  } transition-all duration-300 transform group-hover:scale-105 ${
                    isSelected ? 'ring-3 ring-orange-500 ring-offset-2 scale-105' : 'opacity-90 group-hover:opacity-100'
                  } ${story.isLive ? 'animate-pulse' : ''}`}
                >
                  <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-white border-2 border-white/80 overflow-hidden shadow-inner">
                    <IconComp className="w-6 h-6 text-white drop-shadow group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Badge Tag on Ring */}
                {story.badge && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full border shadow-xs whitespace-nowrap ${
                      story.isLive
                        ? 'bg-red-600 text-white border-red-400 animate-pulse'
                        : 'bg-slate-900 text-amber-300 border-slate-700'
                    }`}
                  >
                    {story.badge}
                  </span>
                )}
              </div>

              {/* Title & Marathi Tag */}
              <div className="text-center max-w-[72px] sm:max-w-[80px]">
                <p
                  className={`text-[10px] sm:text-[11px] font-bold leading-tight truncate transition-colors ${
                    isSelected ? 'text-orange-600' : 'text-slate-800 group-hover:text-orange-600'
                  }`}
                >
                  {story.label}
                </p>
                <p className="text-[9px] text-slate-400 font-medium truncate leading-none mt-0.5">
                  {story.labelMarathi}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
