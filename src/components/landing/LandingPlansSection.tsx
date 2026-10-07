import React, { useState } from 'react';
import {
  Crown,
  Check,
  ShieldCheck,
  Building,
  Zap,
  Users,
  Send,
  Sparkles,
} from 'lucide-react';
import { STANDARD_PLANS, BUSINESS_TEAM_PLAN } from '../../config/plansConfig';
import { UserAccount, PlanConfig } from '../../types';

interface LandingPlansSectionProps {
  currentUser: UserAccount | null;
  onSelectPlan: (plan: PlanConfig) => void;
  onContactTeam: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
}

export const LandingPlansSection: React.FC<LandingPlansSectionProps> = ({
  currentUser,
  onSelectPlan,
  onContactTeam,
  onOpenAuthModal,
}) => {
  const [billingCycle, setBillingCycle] = useState<'all' | 'monthly' | 'yearly'>('all');

  const filteredPlans = STANDARD_PLANS.filter((plan) => {
    if (billingCycle === 'all') return true;
    if (billingCycle === 'monthly') return plan.billing_cycle === 'monthly' || plan.billing_cycle === 'free';
    if (billingCycle === 'yearly') return plan.billing_cycle === 'yearly' || plan.billing_cycle === 'free';
    return true;
  });

  const handlePlanClick = (plan: PlanConfig) => {
    if (!currentUser) {
      onOpenAuthModal('login');
      return;
    }
    onSelectPlan(plan);
  };

  const handleTeamClick = () => {
    if (!currentUser) {
      onOpenAuthModal('login');
      return;
    }
    onContactTeam();
  };

  return (
    <section id="section-plans" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>GROW VIEW OFFICIAL SUBSCRIPTION PLANS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            सोपे, स्पष्ट व पारदर्शक <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">प्लॅन्स</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            सर्व सण, दिनविशेष आणि व्यावसायिक पोस्टर्स आता वॉटरमार्क शिवाय HD व 4K गुणवत्तेत डाऊनलोड करा.
            कोणतेही छुपे शुल्क नाही.
          </p>

          {/* Billing Cycle Toggle Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 inline-flex shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  billingCycle === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                सर्व प्लॅन्स (All Plans)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                मासिक (Monthly)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>वार्षिक (Yearly)</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  60% बचत
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Standard Plans Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {filteredPlans.map((plan) => {
            const isFree = plan.billing_cycle === 'free';

            return (
              <div
                key={plan.plan_id}
                className={`rounded-3xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  plan.is_popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500 shadow-2xl shadow-amber-500/15 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {/* Header Badge */}
                {plan.badge && (
                  <div
                    className={`text-[10px] font-black uppercase tracking-wider text-center py-1.5 px-3 ${
                      plan.is_popular
                        ? 'bg-amber-500 text-slate-950'
                        : isFree
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-orange-600 text-white'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  {/* Plan Name */}
                  <h3 className="text-lg font-black text-white">{plan.plan_name}</h3>
                  {plan.nameMarathi && (
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">{plan.nameMarathi}</p>
                  )}

                  {/* Price */}
                  <div className="mt-4 mb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {isFree ? '₹0' : `₹${plan.price}`}
                      </span>
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <span className="text-xs text-slate-500 line-through">₹{plan.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {plan.periodLabel} {plan.periodLabelMarathi ? `• ${plan.periodLabelMarathi}` : ''}
                    </span>
                  </div>

                  {/* Highlight Box (Prominent Value) */}
                  <div className="space-y-1.5 my-3">
                    <div
                      className={`text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 ${
                        plan.watermark_status === 'NO_WATERMARK'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{plan.highlight_text}</span>
                    </div>

                    <div className="text-xs px-2.5 py-1 rounded-lg font-medium bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>{plan.business_limit === 1 ? '1 Business' : `Up to ${plan.business_limit} Businesses`}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-3 space-y-2 flex-1 border-t border-slate-800/80 pt-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-tight">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                        isFree
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : plan.is_popular
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950'
                      }`}
                    >
                      {isFree ? (
                        <span>{plan.button_text || 'CURRENT PLAN'}</span>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{plan.button_text || 'BUY NOW'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* Section 4: BUSINESS / TEAM SECTION (Separate Section) */}
        {/* ======================================================== */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/60 border border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>BUSINESS / TEAM</span>
              </div>

              <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                <span className="text-xl sm:text-2xl font-black text-amber-400">
                  {BUSINESS_TEAM_PLAN.periodLabel}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  (कस्टम दर)
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Need GROW VIEW for your entire team?
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                For businesses, agencies and organizations with 10–20+ team members.
                प्रत्येक कर्मचाऱ्याला स्वतंत्र लॉगिन, ब्रँडेड फ्रेम्स आणि ओनर डॅशबोर्ड कंट्रोल.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2">
                {BUSINESS_TEAM_PLAN.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleTeamClick}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>CONTACT US</span>
              </button>
              <span className="text-[11px] text-slate-400">
                २ तासांत कस्टम कोटेशन व मोफत टीम डेमो उपलब्ध
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
