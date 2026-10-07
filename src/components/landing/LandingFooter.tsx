import React from 'react';
import { Sparkles, Mail, Phone, MessageCircle, Heart, Shield, Lock } from 'lucide-react';
import { LandingPageContent } from '../../types';

interface LandingFooterProps {
  content: LandingPageContent;
  onOpenAdminLogin?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ content, onOpenAdminLogin }) => {
  return (
    <footer id="section-footer" className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white font-['Outfit']">
                  Grow<span className="text-amber-400">View</span>
                </span>
                <p className="text-xs text-slate-400">Festival & Business Poster Maker</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              GrowView helps local Indian businesses, shops, doctors, real estate agents, and creators build stunning Marathi, Hindi, and English festival greetings and branding posters automatically.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-4 h-4 text-emerald-400" /> Secure Cloud
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-4 h-4 text-amber-400" /> Privacy Protected
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">Festivals</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#section-festivalCategories" className="hover:text-amber-400">Shivaji Maharaj Jayanti</a></li>
              <li><a href="#section-festivalCategories" className="hover:text-amber-400">Ganesh Chaturthi</a></li>
              <li><a href="#section-festivalCategories" className="hover:text-amber-400">Diwali & Laxmi Pujan</a></li>
              <li><a href="#section-festivalCategories" className="hover:text-amber-400">Gudi Padwa</a></li>
              <li><a href="#section-festivalCategories" className="hover:text-amber-400">Maha Shivratri</a></li>
            </ul>
          </div>

          {/* Business Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">Business</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#section-businessTemplates" className="hover:text-amber-400">Real Estate & Plots</a></li>
              <li><a href="#section-businessTemplates" className="hover:text-amber-400">Hospitals & Doctors</a></li>
              <li><a href="#section-businessTemplates" className="hover:text-amber-400">Coaching Classes</a></li>
              <li><a href="#section-businessTemplates" className="hover:text-amber-400">Grocery & Retail Stores</a></li>
              <li><a href="#section-businessTemplates" className="hover:text-amber-400">Automobile & Services</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">Support & Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{content.contactEmail || 'support@growview.in'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`tel:${(content.contactPhone || '+91 77749 14906').replace(/\s+/g, '')}`} className="hover:text-amber-400 transition-colors">
                  {content.contactPhone || '+91 77749 14906'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <a 
                  href={`https://wa.me/${(content.supportWhatsApp || '7774914906').replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: {content.supportWhatsApp || '+91 77749 14906'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>{content.footerText || '© 2026 GrowView. All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            {onOpenAdminLogin && (
              <button onClick={onOpenAdminLogin} className="hover:text-slate-200">
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
