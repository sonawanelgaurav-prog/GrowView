import React from 'react';
import { 
  Home, 
  Calendar, 
  Crown, 
  SlidersHorizontal,
  Sparkles,
  FileText
} from 'lucide-react';

interface BrandsLiveMobileBottomNavProps {
  activeTab: 'home' | 'festivals' | 'studio' | 'frames' | 'vip';
  onSelectTab: (tab: 'home' | 'festivals' | 'studio' | 'frames' | 'vip') => void;
  onOpenProfileModal: () => void;
  onOpenVIPModal: () => void;
  onOpenAIModal: () => void;
}

export const BrandsLiveMobileBottomNav: React.FC<BrandsLiveMobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfileModal,
  onOpenVIPModal,
  onOpenAIModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1 px-2 md:hidden shadow-lg">
      <div className="grid grid-cols-5 gap-1 items-center">
        {/* Home Feed */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 text-[10px] font-bold transition-colors ${
            activeTab === 'home' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Festival Calendar */}
        <button
          type="button"
          onClick={() => onSelectTab('festivals')}
          className={`flex flex-col items-center gap-0.5 py-1 text-[10px] font-bold transition-colors ${
            activeTab === 'festivals' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Festivals</span>
        </button>

        {/* AI Greetings / Creator */}
        <button
          type="button"
          onClick={onOpenAIModal}
          className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-bold transition-colors text-indigo-600 hover:text-indigo-800"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
          </div>
          <span className="truncate">AI Studio</span>
        </button>

        {/* Brand Frames */}
        <button
          type="button"
          onClick={onOpenProfileModal}
          className={`flex flex-col items-center gap-0.5 py-1 text-[10px] font-bold transition-colors ${
            activeTab === 'frames' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Frames</span>
        </button>

        {/* VIP Member */}
        <button
          type="button"
          onClick={onOpenVIPModal}
          className={`flex flex-col items-center gap-0.5 py-1 text-[10px] font-bold transition-colors ${
            activeTab === 'vip' ? 'text-amber-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-500 fill-current" />
          <span>VIP Pass</span>
        </button>
      </div>
    </nav>
  );
};
