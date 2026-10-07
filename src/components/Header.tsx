import React from 'react';
import { BusinessProfile, UserAccount } from '../types';
import {
  Sparkles,
  Building,
  ChevronDown,
  Search,
  PlusCircle,
  Smartphone,
  Layers,
  Flame,
  Shield,
  User,
  LogIn,
  Activity,
  Crown,
  Users,
} from 'lucide-react';

interface HeaderProps {
  activeProfile: BusinessProfile;
  currentUser: UserAccount | null;
  onOpenProfileModal: () => void;
  onOpenAIModal: () => void;
  onOpenAdminModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenCustomerModal: () => void;
  onOpenPricingModal: () => void;
  onOpenTeamModal?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeGroup: string;
  onSelectGroup: (group: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  currentUser,
  onOpenProfileModal,
  onOpenAIModal,
  onOpenAdminModal,
  onOpenAuthModal,
  onOpenCustomerModal,
  onOpenPricingModal,
  onOpenTeamModal,
  searchQuery,
  onSearchChange,
  activeGroup,
  onSelectGroup,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-sm ring-1 ring-emerald-500/30">
            G
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Grow<span className="text-emerald-600">View</span>
              </h1>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-200 uppercase">
                Poster Maker
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Daily Indian Festivals • Business Branding • Customer Logs
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative group">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Diwali, Ganesh, Real Estate, Offers, Suvichar..."
              className="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 rounded-full pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* VIP Pricing & Subscription Trigger */}
          <button
            type="button"
            onClick={onOpenPricingModal}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="VIP Plans & Pricing / प्लॅन्स व वॉटरमार्क रिमूव्हल"
          >
            <Crown className="w-4 h-4 text-slate-950 fill-amber-300" />
            <span className="hidden sm:inline">VIP प्लॅन्स</span>
            <span className="sm:hidden">VIP</span>
          </button>

          {/* AI Generator Trigger */}
          <button
            type="button"
            onClick={onOpenAIModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 animate-spin" />
            <span className="hidden md:inline">AI Greetings</span>
            <span className="md:hidden">AI</span>
          </button>

          {/* Active Business Profile Switcher Button */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-700 transition-all shadow-xs"
            title="Business Profiles / व्यवसाय माहिती"
          >
            {activeProfile.logoUrl ? (
              <img
                src={activeProfile.logoUrl}
                alt="Logo"
                className="w-7 h-7 rounded-md object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-200">
                {activeProfile.name.charAt(0)}
              </div>
            )}
            <div className="text-left hidden xl:block max-w-[120px]">
              <span className="text-[10px] text-indigo-600 block font-semibold leading-none truncate">
                Brand Frame
              </span>
              <span className="text-xs font-semibold text-slate-900 block leading-tight truncate">
                {activeProfile.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Customer / Auth Button */}
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenCustomerModal}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 sm:px-3 py-1.5 rounded-lg text-indigo-900 transition-all shadow-xs"
              title="Customer Account & Activity Logs / ग्राहक खाते व लॉग"
            >
              <div className="w-7 h-7 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block max-w-[130px]">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-indigo-700 leading-none">
                    {currentUser.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                  {currentUser.name}
                </span>
              </div>
              <Activity className="w-3.5 h-3.5 text-indigo-600 ml-0.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 hover:border-indigo-300 font-bold text-xs sm:text-sm px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>लॉगिन</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-lg hidden sm:flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>नवीन खाते</span>
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Mobile Search Bar */}
      <div className="px-4 pb-2.5 md:hidden">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search festivals, businesses, quotes..."
            className="w-full bg-white border-2 border-slate-300 focus:border-indigo-600 rounded-xl pl-11 pr-4 py-2.5 text-sm sm:text-base font-semibold text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
        </div>
      </div>

      {/* Categories Navigation Bar */}
      <div className="border-t border-slate-200/80 bg-white/90 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 py-2">
          {[
            { id: 'all', label: 'All Posters', icon: Layers },
            { id: 'festivals', label: 'Festivals & Events', icon: Flame },
            { id: 'business', label: 'Business & Ads', icon: Building },
            { id: 'daily', label: 'Daily Suvichar', icon: Sparkles },
            { id: 'upcoming', label: 'Today / Upcoming', icon: Smartphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeGroup === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectGroup(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
