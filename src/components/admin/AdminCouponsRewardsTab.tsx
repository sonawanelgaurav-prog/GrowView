import React, { useState } from 'react';
import {
  Tag,
  Gift,
  Coins,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Percent,
  Calendar,
  X,
} from 'lucide-react';
import { CouponCode, DailyRewardDay } from '../../types';
import { MOCK_COUPONS, INITIAL_DAILY_REWARDS } from '../../data/adminMockData';

export const AdminCouponsRewardsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponCode[]>(MOCK_COUPONS);
  const [dailyRewards, setDailyRewards] = useState<DailyRewardDay[]>(INITIAL_DAILY_REWARDS);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // New Coupon Form State
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState(25);
  const [planApplicable, setPlanApplicable] = useState<'all' | 'monthly' | 'yearly'>('yearly');
  const [maxUses, setMaxUses] = useState(500);
  const [expiryDate, setExpiryDate] = useState('2026-09-30');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CouponCode = {
      id: `cpn-${Date.now()}`,
      code: newCode.toUpperCase(),
      discountType,
      discountValue,
      planApplicable,
      maxUses,
      usedCount: 0,
      expiryDate,
      isActive: true,
      revenueGenerated: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCoupons([created, ...coupons]);
    setIsCouponModalOpen(false);
    setNewCode('');
  };

  const handleToggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <span>कूपन्स व रिवॉर्ड्स व्यवस्थापन (Coupons & Daily Rewards System)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            डिस्काउंट कूपन्स तयार करा आणि युजर्सना रोज लॉगिन केल्यावर मोफत कॉईन्स रिवॉर्ड्स द्या.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCouponModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन कूपन तयार करा</span>
        </button>
      </div>

      {/* 2-Section Grid: Coupons List + Daily Rewards Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2-Cols: Active Coupons List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>सक्रिय डिस्काउंट कूपन्स (Active Promo Codes)</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">{coupons.length} Coupons</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map((cpn) => (
              <div
                key={cpn.id}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {cpn.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cpn.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {cpn.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-300 font-bold">
                    {cpn.discountType === 'percentage'
                      ? `${cpn.discountValue}% OFF`
                      : `₹${cpn.discountValue} Flat Discount`}
                  </span>
                  <span className="text-slate-500 uppercase text-[10px] font-mono font-semibold">
                    {cpn.planApplicable} Plan
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-900 pt-2">
                  <span>
                    Used: <strong className="text-slate-200">{cpn.usedCount}</strong> / {cpn.maxUses}
                  </span>
                  <span>
                    Revenue: <strong className="text-emerald-400">₹{(cpn.revenueGenerated / 1000).toFixed(0)}k</strong>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-slate-500">Exp: {cpn.expiryDate}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(cpn.id)}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      {cpn.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(cpn.id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1-Col: Daily Rewards Coins Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Daily Login Reward Coins (Day 1-7)</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              रोज लॉगिन केल्यावर युजर्सना कॉईन्स मिळतात, ज्यातून ते मोफत प्रिमियम डिझाईन्स अनलॉक करू शकतात.
            </p>
          </div>

          <div className="space-y-2">
            {dailyRewards.map((reward) => (
              <div
                key={reward.day}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  reward.isSpecial
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-slate-300 font-bold flex items-center justify-center font-mono text-[11px]">
                    D{reward.day}
                  </span>
                  <span className="font-bold">{reward.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold font-mono text-sm">{reward.coins} Coins</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>सध्या दररोज सरासरी ४,१२० युजर्स कॉईन्स क्लेम करतात.</span>
          </div>
        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>नवीन प्रोमो कूपन कोड तयार करा</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">कूपन कोड (Coupon Code)</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="उदा. GANPATI25 किंवा FEST50"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">सूट प्रकार (Discount Type)</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="percentage">टक्केवारी (%)</option>
                    <option value="flat">थेट सूट (Flat ₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">सूट मूल्य (Discount Value)</label>
                  <input
                    type="number"
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">लागू प्लॅन (Plan)</label>
                  <select
                    value={planApplicable}
                    onChange={(e) => setPlanApplicable(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="yearly">Yearly VIP Plan</option>
                    <option value="monthly">Monthly Plan</option>
                    <option value="all">सर्व प्लॅन्स</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">कमाल वापर (Max Uses)</label>
                  <input
                    type="number"
                    min={1}
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">मुदत समाप्ती तारीख (Expiry Date)</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  कूपन तयार करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
