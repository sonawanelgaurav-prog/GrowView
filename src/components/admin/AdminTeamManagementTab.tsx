import React, { useState } from 'react';
import {
  Users,
  Shield,
  KeyRound,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Crown,
  Palette,
  FileText,
  LifeBuoy,
  Film
} from 'lucide-react';
import { UserAccount, AdminRole, PlatformRole } from '../../types';
import { validatePassword } from '../../utils/authUtils';

interface AdminTeamManagementTabProps {
  users: UserAccount[];
  currentUser?: UserAccount | null;
  onSaveUser: (user: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (userId: string, newPass: string) => void;
  onToggleStatus: (userId: string) => void;
}

const ROLE_INFO: Record<
  AdminRole,
  { label: string; labelMarathi: string; badgeColor: string; icon: React.ElementType; permissions: string[] }
> = {
  super_admin: {
    label: 'Super Admin',
    labelMarathi: 'मुख्य ॲडमिन',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: Crown,
    permissions: ['सर्व परवानग्या (Full Access)', 'पोस्ट अपलोड व एडिट', 'टीम व्यवस्थापन', 'महसूल व फायनान्स'],
  },
  editor: {
    label: 'Design Editor',
    labelMarathi: 'पोस्टर व डिझाईन एडिटर',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: Palette,
    permissions: ['पोस्ट अपलोड व तयार करणे', 'कॅनव्हा स्टुडिओ ॲक्सेस', 'कस्टम घटक व फ्रेम्स', 'टेम्पलेट्स एडिट करणे'],
  },
  content_manager: {
    label: 'Content Manager',
    labelMarathi: 'कंटेंट व सण मॅनेजर',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: FileText,
    permissions: ['सण शेड्युलर व्यवस्थापन', 'AI स्लोगन्स व मथळे', 'टेम्पलेट कॅटेगरी', 'पुश नोटिफिकेशन्स'],
  },
  support_admin: {
    label: 'Support Admin',
    labelMarathi: 'सपोर्ट व हेल्पडेस्क',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: LifeBuoy,
    permissions: ['सपोर्ट तिकिटे', 'ग्राहक खाती तपासणे', 'पासवर्ड रिसेट करणे'],
  },
  finance_admin: {
    label: 'Finance Admin',
    labelMarathi: 'फायनान्स व बिलींग',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: ShieldCheck,
    permissions: ['सबस्क्रिप्शन', 'कूपन्स व डिस्काउंट', 'महसूल अहवाल'],
  },
};

export const AdminTeamManagementTab: React.FC<AdminTeamManagementTabProps> = ({
  users,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onResetPassword,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [revealedPasswordId, setRevealedPasswordId] = useState<string | null>(null);

  // Form State for Add / Edit Staff
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<AdminRole>('editor');
  const [formVideoEditorAccess, setFormVideoEditorAccess] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter only admin/staff accounts
  const staffMembers = users.filter((u) => u.role === 'admin' || !!u.adminRole);

  const filteredStaff = staffMembers.filter((staff) => {
    if (selectedRoleFilter !== 'all' && (staff.adminRole || 'super_admin') !== selectedRoleFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = staff.name.toLowerCase().includes(q);
      const matchEmail = staff.email.toLowerCase().includes(q);
      const matchUser = staff.username?.toLowerCase().includes(q) || false;
      return matchName || matchEmail || matchUser;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormPhone('');
    setFormPassword('');
    setFormRole('editor');
    setFormVideoEditorAccess(true);
    setFormError(null);
    setEditingStaffId(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (staff: UserAccount) => {
    setFormName(staff.name);
    setFormUsername(staff.username || staff.email.split('@')[0]);
    setFormEmail(staff.email);
    setFormPhone(staff.phone || '');
    setFormPassword(staff.password || '');
    setFormRole(staff.adminRole || 'editor');
    setFormVideoEditorAccess(staff.permissions?.video_editor_access ?? (staff.adminRole === 'super_admin' || staff.adminRole === 'editor'));
    setFormError(null);
    setEditingStaffId(staff.id);
    setIsAddModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError('कृपया नाव, ईमेल आणि पासवर्ड भरा.');
      return;
    }

    const validation = validatePassword(formPassword);
    if (!validation.isValid) {
      setFormError(validation.message);
      return;
    }

    const usernameClean = formUsername.trim() || formEmail.split('@')[0];

    // Check duplicate username or email if adding new
    if (!editingStaffId) {
      const exists = users.some(
        (u) =>
          u.email.toLowerCase() === formEmail.trim().toLowerCase() ||
          (u.username && u.username.toLowerCase() === usernameClean.toLowerCase())
      );
      if (exists) {
        setFormError('या ईमेल किंवा युझरनेमचे खाते आधीच उपलब्ध आहे. कृपया दुसरे निवडा.');
        return;
      }
    }

    const updatedOrNewUser: UserAccount = {
      id: editingStaffId || `usr-staff-${Date.now()}`,
      name: formName.trim(),
      username: usernameClean.toLowerCase(),
      email: formEmail.trim().toLowerCase(),
      phone: formPhone.trim() || '+91 98220 00000',
      businessName: 'GrowView Studio Team',
      businessType: 'Internal Staff Member',
      password: formPassword,
      role: 'admin',
      adminRole: formRole,
      platformRole: formRole === 'super_admin' ? 'MASTER_ADMIN' : formVideoEditorAccess ? 'VIDEO_EDITOR' : 'ADMIN',
      permissions: {
        video_editor_access: formVideoEditorAccess,
        can_manage_posters: true,
        can_create_videos: formVideoEditorAccess,
        can_export_videos: formVideoEditorAccess,
      },
      status: 'active',
      createdAt: editingStaffId ? users.find((u) => u.id === editingStaffId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      totalDownloads: 0,
    };

    onSaveUser(updatedOrNewUser);
    setIsAddModalOpen(false);
    setSuccessToast(
      editingStaffId
        ? `टीम सदस्य "${formName}" चे तपशील यशस्वीरीत्या सेव्ह केले!`
        : `नवीन टीम सदस्य "${formName}" (${ROLE_INFO[formRole].label}) तयार झाला!`
    );
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCopyCredentials = (staff: UserAccount) => {
    const text = `GrowView Staff Login Credentials:\nName: ${staff.name}\nRole: ${staff.adminRole || 'admin'}\nUsername: ${staff.username || staff.email}\nEmail: ${staff.email}\nPassword: ${staff.password}\nLogin Portal: Click "Admin" at the bottom of the page (footer).`;
    navigator.clipboard.writeText(text);
    setCopiedId(staff.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Shield className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>टीम व ॲडमिन ॲक्सेस व्यवस्थापन</span>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                  {staffMembers.length} सक्रिय सदस्य
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Editor, Content Manager व Super Admin साठी युझरनेम आणि पासवर्ड तयार करा व परवानग्या द्या.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all active:scale-95 border border-purple-400/30 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>नवीन सदस्य जोडा (Add Staff)</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search & Role Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाव, युझरनेम किंवा ईमेल शोधा..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              selectedRoleFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            सर्व ({staffMembers.length})
          </button>
          {(['super_admin', 'editor', 'content_manager', 'support_admin'] as AdminRole[]).map((r) => {
            const count = staffMembers.filter((s) => (s.adminRole || 'super_admin') === r).length;
            const info = ROLE_INFO[r];
            return (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  selectedRoleFilter === r
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{info.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((staff) => {
          const roleKey = staff.adminRole || 'super_admin';
          const roleData = ROLE_INFO[roleKey] || ROLE_INFO.super_admin;
          const RoleIcon = roleData.icon;
          const isCurrentUser = currentUser?.id === staff.id || currentUser?.email === staff.email;

          return (
            <div
              key={staff.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4.5 space-y-3.5 transition-all shadow-lg relative group"
            >
              {/* Top Row: Name, Avatar & Role Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{staff.name}</h4>
                      {isCurrentUser && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                          तुम्ही (You)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      @{staff.username || staff.email.split('@')[0]} • {staff.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${roleData.badgeColor}`}
                >
                  <RoleIcon className="w-3 h-3" />
                  <span>{roleData.label}</span>
                </span>
              </div>

              {/* Credentials Box (Secure Display for Admin) */}
              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-purple-400" /> पासवर्ड (Password):
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="text-purple-300 font-mono font-bold bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40 text-[11px]">
                      {staff.password ? (revealedPasswordId === staff.id ? staff.password : '••••••••') : 'सुरक्षित / Firebase'}
                    </code>
                    {staff.password && (
                      <button
                        type="button"
                        onClick={() => setRevealedPasswordId(revealedPasswordId === staff.id ? null : staff.id)}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
                        title={revealedPasswordId === staff.id ? 'पासवर्ड लपवा' : 'पासवर्ड दाखवा'}
                      >
                        {revealedPasswordId === staff.id ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    {staff.password && (
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(staff)}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
                        title="लॉगिन तपशील कॉपी करा"
                      >
                        {copiedId === staff.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                  {roleData.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-800/70 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                    >
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span
                  className={`text-[10px] font-bold flex items-center gap-1 ${
                    staff.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      staff.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                    }`}
                  />
                  {staff.status === 'active' ? 'सक्रिय (Active)' : 'निलंबित (Suspended)'}
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Master Admin Video Editor Permission Toggle */}
                  {(() => {
                    const hasVideoAccess = staff.permissions?.video_editor_access ?? (staff.adminRole === 'super_admin' || staff.adminRole === 'editor');
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          const updated: UserAccount = {
                            ...staff,
                            permissions: {
                              ...staff.permissions,
                              video_editor_access: !hasVideoAccess,
                              can_create_videos: !hasVideoAccess,
                              can_export_videos: !hasVideoAccess,
                            },
                            platformRole: !hasVideoAccess
                              ? staff.adminRole === 'super_admin'
                                ? 'MASTER_ADMIN'
                                : 'VIDEO_EDITOR'
                              : 'ADMIN',
                          };
                          onSaveUser(updated);
                          setSuccessToast(
                            `"${staff.name}" साठी व्हिडिओ एडिटर ॲक्सेस ${!hasVideoAccess ? 'सुरू' : 'बंद'} केला.`
                          );
                          setTimeout(() => setSuccessToast(null), 3000);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black border flex items-center gap-1 transition-all ${
                          hasVideoAccess
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                        title="व्हिडिओ एडिटर ॲक्सेस (Video Studio Access) चालू / बंद करा"
                      >
                        <Film className="w-3 h-3 text-amber-400" />
                        <span>{hasVideoAccess ? '🎬 Studio: चालू' : '🎬 Studio: बंद'}</span>
                      </button>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => onToggleStatus(staff.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition-colors"
                  >
                    {staff.status === 'active' ? 'निलंबित करा' : 'सक्रिय करा'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors border border-purple-500/30"
                    title="माहिती व पासवर्ड बदला"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {staffMembers.length > 1 && !isCurrentUser && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`खात्री आहे? सदस्य "${staff.name}" चे खाते हटवायचे आहे?`)) {
                          onDeleteUser(staff.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors border border-rose-500/30"
                      title="खाते डिलीट करा"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-black text-white">
                  {editingStaffId ? 'टीम सदस्य माहिती व पासवर्ड अपडेट करा' : 'नवीन ॲडमिन / एडिटर जोडा'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">पूर्ण नाव (Full Name):</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="उदा. राहुल जोशी (Design Editor)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">युझरनेम (Username):</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="उदा. rahul_editor"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">ईमेल आयडी (Email):</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="editor@growview.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">रोल व परवानग्या (Assigned Role):</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['editor', 'content_manager', 'super_admin', 'support_admin'] as AdminRole[]).map((r) => {
                    const info = ROLE_INFO[r];
                    const Icon = info.icon;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormRole(r)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                          formRole === r
                            ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                        <div>
                          <div className="font-bold text-[11px] text-white">{info.label}</div>
                          <div className="text-[10px] text-slate-400">{info.labelMarathi}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-bold">लॉगिन पासवर्ड (Secure Password):</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Editor@2026#Pro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  किमान ८ अक्षरे, १ मोठे अक्षर (A-Z), १ अंक (0-9) आणि १ विशेष चिन्ह (@#$) आवश्यक आहे.
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30 shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">व्हिडिओ स्टुडिओ ॲक्सेस (Video Studio Access)</div>
                    <div className="text-[10px] text-slate-400">पोस्टरचे ॲनिमेटेड व्हिडिओ, रील्स व मोशन ग्राफिक्स बनवण्याची परवानगी</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormVideoEditorAccess(!formVideoEditorAccess)}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                    formVideoEditorAccess ? 'bg-amber-500' : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${
                      formVideoEditorAccess ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>या सदस्याला मिळणाऱ्या परवानग्या:</span>
                </div>
                <div className="text-[10px] text-slate-300 space-y-0.5">
                  {ROLE_INFO[formRole].permissions.map((p, i) => (
                    <div key={i}>• {p}</div>
                  ))}
                  {formVideoEditorAccess && (
                    <div className="text-amber-300 font-bold">• 🎬 व्हिडिओ स्टुडिओ (Video Studio Access Enabled)</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95"
                >
                  {editingStaffId ? 'अपडेट करा (Save Changes)' : 'सदस्य तयार करा (Create Staff)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
