import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  UserPlus,
  ShieldCheck,
  Building,
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Crown,
  AlertTriangle,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { UserAccount, BusinessProfile, TeamMemberRecord } from '../../types';
import {
  fetchTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  toggleTeamMemberStatus,
  fetchSubscriptionStatus,
  UserSubscriptionResolution,
} from '../../services/subscriptionService';

interface BusinessTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  profiles: BusinessProfile[];
  onOpenPricingModal: () => void;
}

export const BusinessTeamModal: React.FC<BusinessTeamModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profiles,
  onOpenPricingModal,
}) => {
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState<boolean>(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [subResolution, setSubResolution] = useState<UserSubscriptionResolution | null>(null);

  // New Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'team_member' | 'business_admin'>('team_member');
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

  const loadMembers = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const list = await fetchTeamMembers(currentUser.id);
      setMembers(list);
    } catch (err) {
      console.warn('Failed to load team members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadMembers();
      setSelectedProfileIds(profiles.map((p) => p.id));
      fetchSubscriptionStatus(currentUser.id, currentUser.email)
        .then((res) => setSubResolution(res))
        .catch((err) => console.warn('Failed to load subscription status:', err));
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const isPaidActive = Boolean(
    subResolution?.isPaidActive ||
    currentUser.role === 'admin' ||
    currentUser.adminRole ||
    currentUser.isVIP
  );

  const activePlanName = isPaidActive
    ? (subResolution?.planConfig?.plan_name || subResolution?.subscription?.plan_name || 'VIP बिझनेस प्लॅन')
    : 'मोफत (Free Plan)';

  const maxAllowedMembers = isPaidActive
    ? (subResolution?.subscription?.team_member_limit || 20)
    : 0;

  const handleToggleProfile = (profId: string) => {
    if (selectedProfileIds.includes(profId)) {
      setSelectedProfileIds(selectedProfileIds.filter((id) => id !== profId));
    } else {
      setSelectedProfileIds([...selectedProfileIds, profId]);
    }
  };

  const handleOpenInviteModal = () => {
    setInviteError(null);
    setIsInviteOpen(true);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaidActive) {
      setInviteError('आपला प्लॅन सध्या ॲक्टिव्ह नाही. टीम सदस्य जोडण्यासाठी कृपया प्रथम VIP / बिझनेस प्लॅन ॲक्टिव्हेट करा.');
      return;
    }

    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      setInviteError('कृपया नाव आणि ईमेल पत्ता भरा.');
      return;
    }

    setIsSubmittingInvite(true);
    setInviteError(null);

    try {
      await inviteTeamMember({
        ownerId: currentUser.id,
        ownerEmail: currentUser.email,
        ownerBusinessName: currentUser.businessName || 'माझा व्यवसाय',
        memberName: newMemberName,
        memberEmail: newMemberEmail,
        role: newMemberRole,
        assignedBusinessIds: selectedProfileIds,
        isVIP: isPaidActive,
      });

      setNewMemberName('');
      setNewMemberEmail('');
      setIsInviteOpen(false);
      await loadMembers();
    } catch (err: any) {
      setInviteError(err.message || 'सदस्य जोडताना अडचण आली.');
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleToggleStatus = async (memberId: string) => {
    try {
      await toggleTeamMemberStatus(currentUser.id, memberId);
      await loadMembers();
    } catch (err: any) {
      alert(err.message || 'स्टेटस बदलता आला नाही.');
    }
  };

  const handleRemove = async (memberId: string, memberName: string) => {
    if (!confirm(`नक्की "${memberName}" यांना टीममधून हटवायचे आहे का?`)) return;
    try {
      await removeTeamMember(currentUser.id, memberId);
      await loadMembers();
    } catch (err: any) {
      alert(err.message || 'सदस्य हटवता आला नाही.');
    }
  };

  const handleCopyCredentials = (member: TeamMemberRecord) => {
    const text = `नमस्कार ${member.member_name},\nआपल्याला GROW VIEW स्टुडिओमध्ये ${currentUser.businessName || 'आमच्या ब्रँड'} टीम सदस्य म्हणून जोडण्यात आले आहे.\nलॉगिन करण्यासाठी आपला ईमेल वापरा: ${member.member_email}\nसर्व सण व बिझनेस पोस्टर्स वॉटरमार्क-फ्री उपलब्ध आहेत.`;
    navigator.clipboard.writeText(text);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-white relative my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-5 text-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                ★ टीम & स्टाफ व्यवस्थापन ★
              </span>
              <h2 className="text-xl font-black mt-0.5">बिझनेस टीम व कर्मचारी ॲक्सेस</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-slate-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>कंपनी/मालक:</span>
              <span className="font-bold text-white">{currentUser.businessName || currentUser.name}</span>
            </div>

            {/* Plan Status Indicator */}
            {isPaidActive ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{activePlanName} (सक्रिय)</span>
              </span>
            ) : (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>प्लॅन निष्क्रिय (Inactive)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              सध्याचे सदस्य:{' '}
              <strong className="text-white">
                {members.length} {isPaidActive ? `/ ${maxAllowedMembers}` : ''}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleOpenInviteModal}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ${
                isPaidActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              नवीन सदस्य जोडा
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* ⚠️ Prominent Inactive Plan Message for Customers */}
          {!isPaidActive && (
            <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-amber-500/20">
                  <AlertTriangle className="w-6 h-6 text-slate-950" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base sm:text-lg font-black text-amber-300">
                      आपला बिझनेस किंवा VIP प्लॅन सध्या ॲक्टिव्ह नाही!
                    </h4>
                    <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Active Plan Required
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    आपल्या कर्मचाऱ्यांना व टीम सदस्यांना GROW VIEW ॲक्सेस देण्यासाठी आणि वॉटरमार्क-फ्री पोस्टर्स
                    तयार करण्याची परवानगी देण्यासाठी आपल्या खात्यावर <strong>सक्रिय VIP किंवा बिझनेस प्लॅन</strong> असणे
                    आवश्यक आहे. सध्या आपले मोफत (Free) खाते चालू आहे.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-500/30">
                <div className="text-xs text-amber-200/90 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>बिझनेस टीम प्लॅनमध्ये १० ते २०+ सदस्यांना पूर्ण ॲक्सेस मिळतो.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPricingModal();
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>VIP / बिझनेस प्लॅन ॲक्टिव्हेट करा (View Plans)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Explanation Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white">टीम ॲक्सेस कसा काम करतो?</p>
              <p>
                आपण जोडलेले टीम सदस्य त्यांच्या ईमेलने GROW VIEW मध्ये लॉगिन करू शकतात. त्यांना आपल्या खात्यातील
                सबस्क्रिप्शनचे सर्व फायदे (वॉटरमार्क-फ्री डिझाईन्स, निवडक ब्रँड्स) मिळतील, परंतु त्यांना आपल्या मुख्य
                पेमेंट किंवा पासवर्डमध्ये बदल करण्याचा अधिकार नसेल.
              </p>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              सक्रिय कर्मचारी व टीम सदस्य ({members.length})
            </h3>

            {isLoading ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span className="text-xs">टीम माहिती लोड होत आहे...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400 font-semibold">अद्याप कोणताही टीम सदस्य जोडलेला नाही.</p>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  पहिला सदस्य आत्ता जोडा
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                        {member.member_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{member.member_name}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              member.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {member.status === 'active' ? 'सक्रिय (Active)' : 'बंद (Inactive)'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {member.role === 'business_admin' ? 'बिझनेस ॲडमिन' : 'स्टाफ सदस्य'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {member.member_email}
                          </span>
                          <span>• {member.assigned_business_ids?.length || 0} ब्रँड्स असाइन केले</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(member)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="लॉगिन संदेश कॉपी करा"
                      >
                        {copiedId === member.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">कॉपी झाले!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>माहिती पाठवा</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(member.id)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          member.status === 'active'
                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-slate-500 hover:bg-slate-800'
                        }`}
                        title={member.status === 'active' ? 'डीॲक्टिव्हेट करा' : 'ॲक्टिव्हेट करा'}
                      >
                        {member.status === 'active' ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(member.id, member.member_name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
                        title="सदस्य काढून टाका"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-between text-xs text-slate-400">
          <span>अधिक सदस्यांसाठी किंवा कॉर्पोरेट इंटिग्रेशनसाठी आमची बिझनेस टीम उपलब्ध आहे.</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPricingModal();
            }}
            className="text-amber-400 hover:underline font-bold"
          >
            प्लॅन अपग्रेड करा →
          </button>
        </div>
      </div>

      {/* Invite Modal Sub-Dialog */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-slate-950 flex items-center justify-between">
              <h3 className="font-black text-base">नवीन टीम सदस्य जोडा</h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-full bg-black/20 hover:bg-black/30 text-slate-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">कर्मचाऱ्याचे नाव *</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="उदा. अमित साळुंखे"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">कर्मचाऱ्याचा ईमेल पत्ता *</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="उदा. staff@growview.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">भूमिका (Role)</label>
                <select
                  value={newMemberRole}
                  onChange={(e: any) => setNewMemberRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="team_member">स्टाफ सदस्य (फक्त पोस्टर्स बनवणे)</option>
                  <option value="business_admin">बिझनेस ॲडमिन (सर्व ब्रँड्स ॲक्सेस)</option>
                </select>
              </div>

              {profiles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">
                    या सदस्याला कोणते ब्रँड्स वापरायला द्यायचे?
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {profiles.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProfileIds.includes(p.id)}
                          onChange={() => handleToggleProfile(p.id)}
                          className="rounded border-slate-700 text-amber-500 focus:ring-0"
                        />
                        <span className="truncate">{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Inactive Plan Notice inside Invite Dialog */}
              {!isPaidActive && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>सक्रिय VIP किंवा बिझनेस प्लॅन आवश्यक आहे!</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    नवीन टीम सदस्य जोडण्यासाठी आणि त्यांना वॉटरमार्क-फ्री डिझाईन्स देण्यासाठी सक्रिय प्लॅन असणे आवश्यक आहे.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsInviteOpen(false);
                      onClose();
                      onOpenPricingModal();
                    }}
                    className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Crown className="w-3.5 h-3.5 fill-slate-950" />
                    <span>प्लॅन ॲक्टिव्हेट / अपग्रेड करा (View Plans)</span>
                  </button>
                </div>
              )}

              {inviteError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInvite}
                  className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
                >
                  {isSubmittingInvite ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      जोडत आहे...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      टीममध्ये जोडा
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
