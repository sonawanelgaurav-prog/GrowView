import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Crown,
  Lock,
  Unlock,
  Trash2,
  KeyRound,
  ShieldCheck,
  UserCheck,
  UserX,
  LogIn,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smartphone,
  Globe,
  Coins,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import { UserAccount } from '../../types';
import { validatePassword } from '../../utils/authUtils';

interface AdminUserManagementTabProps {
  users: UserAccount[];
  currentUser?: UserAccount | null;
  onToggleUserStatus: (userId: string) => void;
  onResetUserPassword: (userId: string, newPass: string) => void;
  onDeleteUser: (userId: string) => void;
  onLoginAsUser?: (user: UserAccount) => void;
  onUpdateUserPlan?: (userId: string, plan: 'free' | 'trial' | 'monthly' | 'yearly' | 'lifetime') => void;
}

export const AdminUserManagementTab: React.FC<AdminUserManagementTabProps> = ({
  users,
  currentUser,
  onToggleUserStatus,
  onResetUserPassword,
  onDeleteUser,
  onLoginAsUser,
  onUpdateUserPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'mr' | 'hi' | 'en' | 'gu'>('all');
  const [selectedPlan, setSelectedPlan] = useState<'all' | 'free' | 'trial' | 'monthly' | 'yearly' | 'lifetime' | 'expired'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected User for Modals
  const [inspectUser, setInspectUser] = useState<UserAccount | null>(null);
  const [passwordModalUser, setPasswordModalUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // VIP Grant State
  const [vipModalUser, setVipModalUser] = useState<UserAccount | null>(null);

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.businessName.toLowerCase().includes(q) ||
        (u.city && u.city.toLowerCase().includes(q));

      const matchesLang = selectedLanguage === 'all' || (u.language || 'mr') === selectedLanguage;
      const matchesPlan = selectedPlan === 'all' || (u.subscriptionPlan || (u.isPremium ? 'yearly' : 'free')) === selectedPlan;
      const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

      return matchesSearch && matchesLang && matchesPlan && matchesStatus;
    });
  }, [users, searchQuery, selectedLanguage, selectedPlan, selectedStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setPasswordError(validation.message || 'पासवर्ड मजबूत असावा.');
      return;
    }

    onResetUserPassword(passwordModalUser.id, newPassword);
    setPasswordSuccess(`पासवर्ड यशस्वीरित्या रीसेट केला: ${passwordModalUser.name}`);
    setTimeout(() => {
      setPasswordModalUser(null);
      setNewPassword('');
      setPasswordError(null);
      setPasswordSuccess(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="नाव, ईमेल, फोन किंवा शहराने युजर शोधा..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-700/80 text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all">सर्व भाषा (All Languages)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>

          {/* Subscription Plan Filter */}
          <select
            value={selectedPlan}
            onChange={(e) => {
              setSelectedPlan(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-700/80 text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all">सर्व प्लॅन्स (All Plans)</option>
            <option value="free">Free Users</option>
            <option value="trial">Trial Users</option>
            <option value="monthly">Monthly VIP</option>
            <option value="yearly">Yearly VIP</option>
            <option value="lifetime">Lifetime VIP</option>
            <option value="expired">Expired</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-slate-950 border border-slate-700/80 text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all">सर्व स्टेटस (All Status)</option>
            <option value="active">Active (सक्रिय)</option>
            <option value="suspended">Suspended (निलंबित)</option>
          </select>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              ग्राहक व युजर्स व्यवस्थापन (User Management Table)
            </h3>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {filteredUsers.length} Users
            </span>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User & Business</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Language / City</th>
                <th className="py-3 px-4">Subscription</th>
                <th className="py-3 px-4">Activity & Device</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {paginatedUsers.map((user) => {
                const isVip =
                  user.isPremium ||
                  user.subscriptionPlan === 'yearly' ||
                  user.subscriptionPlan === 'monthly' ||
                  user.subscriptionPlan === 'lifetime';

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* User Name & Business */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-100">{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                                Super Admin
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 block truncate max-w-[180px]">
                            {user.businessName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-300 text-xs">{user.phone}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-[160px]">{user.email}</div>
                    </td>

                    {/* Language & City */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-300">
                          {user.language === 'hi'
                            ? 'हिंदी (Hindi)'
                            : user.language === 'en'
                            ? 'English'
                            : user.language === 'gu'
                            ? 'ગુજરાતી'
                            : 'मराठी (Marathi)'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">{user.city || 'Maharashtra'}</span>
                    </td>

                    {/* Subscription */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            user.subscriptionPlan === 'lifetime'
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                              : user.subscriptionPlan === 'yearly'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : user.subscriptionPlan === 'monthly'
                              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                              : user.subscriptionPlan === 'trial'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isVip && <Crown className="w-3 h-3 text-amber-400" />}
                          <span className="capitalize">{user.subscriptionPlan || (isVip ? 'VIP' : 'Free')}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Coins: <strong className="text-amber-400">{user.coins || 0}</strong>
                      </span>
                    </td>

                    {/* Activity & Device */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-300 text-xs">
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[130px]">{user.device || 'Android 14'}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Exports: <strong className="text-slate-300">{user.totalDownloads}</strong>
                      </span>
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Inspect User Profile */}
                        <button
                          type="button"
                          onClick={() => setInspectUser(user)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Profile / प्रोफाइल पहा"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Reset Password */}
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordModalUser(user);
                            setNewPassword('');
                            setPasswordError(null);
                            setPasswordSuccess(null);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                          title="Reset Password / पासवर्ड रीसेट करा"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* VIP Upgrade Dialog */}
                        <button
                          type="button"
                          onClick={() => setVipModalUser(user)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                          title="Grant / Change VIP Plan"
                        >
                          <Crown className="w-4 h-4" />
                        </button>

                        {/* Toggle Suspend/Active */}
                        <button
                          type="button"
                          onClick={() => onToggleUserStatus(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === 'suspended'
                              ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400'
                          }`}
                          title={user.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                        >
                          {user.status === 'suspended' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        {/* Login as User Simulator */}
                        {onLoginAsUser && user.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => onLoginAsUser(user)}
                            className="p-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                            title="Login As User (Support simulation)"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>
            एकूण {filteredUsers.length} पैकी {Math.min(filteredUsers.length, itemsPerPage)} युजर्स दाखवत आहे
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-200 font-bold px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: INSPECT USER PROFILE */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-base">
                  {inspectUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">{inspectUser.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">{inspectUser.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Business Name</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{inspectUser.businessName}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Category / Type</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{inspectUser.businessType || 'Retail'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Email</span>
                <span className="font-bold text-slate-200 mt-0.5 block font-mono">{inspectUser.email}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Phone</span>
                <span className="font-bold text-slate-200 mt-0.5 block font-mono">{inspectUser.phone}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Subscription Plan</span>
                <span className="font-bold text-amber-400 mt-0.5 block uppercase">{inspectUser.subscriptionPlan || 'Free'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Total Exports / Downloads</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{inspectUser.totalDownloads} Posters</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Coins Wallet</span>
                <span className="font-bold text-amber-400 mt-0.5 block">{inspectUser.coins || 0} Coins</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-semibold block">Referral Code</span>
                <span className="font-bold text-indigo-400 mt-0.5 block font-mono">{inspectUser.referralCode || 'N/A'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
              >
                बंद करा (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET USER PASSWORD */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>पासवर्ड रीसेट करा ({passwordModalUser.name})</span>
              </h4>
              <button
                type="button"
                onClick={() => setPasswordModalUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">नवीन सुरक्षित पासवर्ड</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="उदा. User@2026#Secure"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                >
                  पासवर्ड सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIP SUBSCRIPTION PLAN MANAGER */}
      {vipModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>सबस्क्रिप्शन प्लॅन बदला ({vipModalUser.name})</span>
              </h4>
              <button
                type="button"
                onClick={() => setVipModalUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              युजरला 4K अल्ट्रा एचडी डाऊनलोड व अमर्यादित फ्रेम्स देण्यासाठी प्लॅन निवडा:
            </p>

            <div className="space-y-2">
              {[
                { id: 'free', label: 'Free Tier (मर्यादित डाऊनलोड)', desc: 'Standard HD with Watermark' },
                { id: 'trial', label: '7-Day VIP Trial', desc: 'Full VIP Access for 7 Days' },
                { id: 'monthly', label: 'Monthly VIP (₹199)', desc: 'Full 30 Days Access' },
                { id: 'yearly', label: 'Yearly VIP (₹999)', desc: '365 Days Unlimited Access' },
                { id: 'lifetime', label: 'Lifetime Super VIP', desc: 'Permanent Unlimited VIP' },
              ].map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    if (onUpdateUserPlan) {
                      onUpdateUserPlan(vipModalUser.id, plan.id as any);
                    }
                    setVipModalUser(null);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    vipModalUser.subscriptionPlan === plan.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{plan.label}</span>
                    <span className="text-[11px] text-slate-400">{plan.desc}</span>
                  </div>
                  {vipModalUser.subscriptionPlan === plan.id && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
