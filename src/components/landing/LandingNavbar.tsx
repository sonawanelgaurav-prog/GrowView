import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, User, Shield, LogIn, UserPlus, Crown } from 'lucide-react';
import { UserAccount } from '../../types';

interface LandingNavbarProps {
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenAdminLogin?: () => void;
  onNavigateToStudio: () => void;
  onSelectCategory?: (categoryId: string) => void;
  onOpenProfileModal?: () => void;
  onLogout?: () => void;
  onOpenAIFestivalModal?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenAdminLogin,
  onNavigateToStudio,
  onSelectCategory,
  onOpenProfileModal,
  onLogout,
  onOpenAIFestivalModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E7E7EE] text-[#18181B] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                  Grow<span className="text-amber-600">View</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                  सण व बिझनेस
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">मराठी, हिंदी व इंग्रजी पोस्टर्स</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => scrollToSection('section-popularTemplates')}
              className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
            >
              पोस्टर्स (Templates)
            </button>
            <button
              onClick={() => scrollToSection('section-features')}
              className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
            >
              वैशिष्ट्ये (Features)
            </button>
            <button
              onClick={() => {
                onNavigateToStudio();
              }}
              className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI पोस्टर</span>
            </button>
            <button
              onClick={() => scrollToSection('section-plans')}
              className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
            >
              VIP प्लॅन्स
            </button>
            <button
              onClick={() => scrollToSection('section-howItWorks')}
              className="text-sm font-semibold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
            >
              कसे वापरावे
            </button>

            {/* AI Festival Auto Creator Button (Sections 1-35) */}
            <button
              onClick={() => {
                if (onOpenAIFestivalModal) {
                  onOpenAIFestivalModal();
                } else {
                  onNavigateToStudio();
                }
              }}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>AI Festival Creator ✨</span>
              <span className="bg-slate-950 text-amber-300 text-[8px] px-1 py-0.2 rounded-full font-black">AI</span>
            </button>
          </nav>

          {/* Desktop Auth & Action Buttons: Section 5 RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onNavigateToStudio}
                  className="px-5 py-2.5 text-sm font-bold rounded-xl bg-[#635BFF] hover:bg-[#5148E5] text-white shadow-md shadow-[#635BFF]/25 hover:shadow-[#635BFF]/35 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Dashboard / Studio</span>
                </button>
                <button
                  onClick={onOpenProfileModal}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#18181B] transition-colors cursor-pointer"
                  title="My Account"
                >
                  <User className="w-5 h-5 text-[#635BFF]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-2.5 text-sm font-semibold text-[#18181B] hover:text-[#635BFF] hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-5 py-2.5 text-sm font-bold rounded-xl bg-[#635BFF] hover:bg-[#5148E5] text-white shadow-md shadow-[#635BFF]/25 hover:shadow-[#635BFF]/35 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser ? (
              <button
                onClick={onNavigateToStudio}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#635BFF] text-white"
              >
                Studio
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#635BFF] text-white"
              >
                Get Started
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-[#18181B] hover:bg-slate-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E7E7EE] px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => scrollToSection('section-popularTemplates')}
              className="px-3 py-2 text-left text-sm font-semibold text-[#18181B] hover:bg-slate-50 rounded-lg"
            >
              Templates
            </button>
            <button
              onClick={() => scrollToSection('section-features')}
              className="px-3 py-2 text-left text-sm font-semibold text-[#18181B] hover:bg-slate-50 rounded-lg"
            >
              Features
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToStudio();
              }}
              className="px-3 py-2 text-left text-sm font-semibold text-[#18181B] hover:bg-slate-50 rounded-lg"
            >
              AI Design
            </button>
            <button
              onClick={() => scrollToSection('section-plans')}
              className="px-3 py-2 text-left text-sm font-semibold text-[#18181B] hover:bg-slate-50 rounded-lg"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('section-howItWorks')}
              className="px-3 py-2 text-left text-sm font-semibold text-[#18181B] hover:bg-slate-50 rounded-lg"
            >
              Resources
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAIFestivalModal) {
                  onOpenAIFestivalModal();
                } else {
                  onNavigateToStudio();
                }
              }}
              className="px-3 py-2 text-left text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Festival Auto Creator ✨</span>
            </button>
          </nav>

          {!currentUser && (
            <div className="pt-2 border-t border-[#E7E7EE] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('login');
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-[#18181B] bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('register');
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#635BFF] hover:bg-[#5148E5] rounded-xl shadow-md shadow-[#635BFF]/25"
              >
                Get Started Free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
