import React, { useState, useRef } from 'react';
import { MasterTemplate, WeddingFormData, EngagementFormData, ResumeFormData, UserAccount } from '../../types';
import { MasterTemplateRenderer } from './MasterTemplateRenderer';
import { 
  X, 
  Download, 
  Printer, 
  Crown, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  Share2,
  FileText,
  Heart,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { 
  DEFAULT_WEDDING_FORM_DATA, 
  DEFAULT_ENGAGEMENT_FORM_DATA, 
  DEFAULT_RESUME_FORM_DATA 
} from '../../data/masterTemplates';

interface MasterTemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: MasterTemplate | null;
  currentUser: UserAccount | null;
  onOpenPricingModal: () => void;
}

export const MasterTemplateEditorModal: React.FC<MasterTemplateEditorModalProps> = ({
  isOpen,
  onClose,
  template,
  currentUser,
  onOpenPricingModal,
}) => {
  if (!isOpen || !template) return null;

  // Form states initialized with realistic Marathi defaults
  const [weddingData, setWeddingData] = useState<WeddingFormData>(() => {
    try {
      const saved = localStorage.getItem(`growview_form_wedding_${template.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { ...DEFAULT_WEDDING_FORM_DATA };
  });

  const [engagementData, setEngagementData] = useState<EngagementFormData>(() => {
    try {
      const saved = localStorage.getItem(`growview_form_engagement_${template.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { ...DEFAULT_ENGAGEMENT_FORM_DATA };
  });

  const [resumeData, setResumeData] = useState<ResumeFormData>(() => {
    try {
      const saved = localStorage.getItem(`growview_form_resume_${template.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { ...DEFAULT_RESUME_FORM_DATA };
  });

  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const isUserVip = currentUser?.plan && currentUser.plan !== 'free';
  const isLocked = template.is_premium && !isUserVip && currentUser?.platformRole !== 'MASTER_ADMIN' && currentUser?.role !== 'admin';

  // Handle Wedding Form Change
  const handleWeddingChange = (field: keyof WeddingFormData, val: string) => {
    setWeddingData(prev => {
      const updated = { ...prev, [field]: val };
      localStorage.setItem(`growview_form_wedding_${template.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Engagement Form Change
  const handleEngagementChange = (field: keyof EngagementFormData, val: string) => {
    setEngagementData(prev => {
      const updated = { ...prev, [field]: val };
      localStorage.setItem(`growview_form_engagement_${template.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Resume Form Change
  const handleResumeChange = (field: keyof ResumeFormData, val: any) => {
    setResumeData(prev => {
      const updated = { ...prev, [field]: val };
      localStorage.setItem(`growview_form_resume_${template.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Add work experience to resume
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Software Developer',
      company: 'Company Name',
      duration: '2024 - Present',
      location: 'Pune',
      points: ['Key responsibility or achievement goes here'],
    };
    handleResumeChange('workExperience', [...(resumeData.workExperience || []), newExp]);
  };

  const handleRemoveExperience = (id: string) => {
    handleResumeChange('workExperience', (resumeData.workExperience || []).filter(e => e.id !== id));
  };

  // Add education to resume
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'Master of Science (M.Sc)',
      institution: 'University of Pune',
      year: '2022',
      score: 'First Class',
    };
    handleResumeChange('education', [...(resumeData.education || []), newEdu]);
  };

  const handleRemoveEducation = (id: string) => {
    handleResumeChange('education', (resumeData.education || []).filter(e => e.id !== id));
  };

  // Browser Print / Save as PDF
  const handlePrint = () => {
    if (isLocked) {
      onOpenPricingModal();
      return;
    }
    window.print();
  };

  // Simulate High-Res Export Download
  const handleDownload = () => {
    if (isLocked) {
      onOpenPricingModal();
      return;
    }
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess('डिझाईन यशस्वीरित्या डाऊनलोड झाले!');
      setTimeout(() => setExportSuccess(null), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white shadow-xs">
              {template.id}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-900 leading-tight">
                  {template.name}
                </h2>
                {template.is_free ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    FREE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-xs">
                    <Crown className="w-2.5 h-2.5 fill-current" />
                    VIP PLAN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {template.nameMarathi} • {template.style}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isLocked ? (
              <button
                type="button"
                onClick={onOpenPricingModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>अपग्रेड करा (VIP Pass)</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                  title="प्रिंट किंवा PDF म्हणून सेव्ह करा"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिंट / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'तयार होत आहे...' : 'डाऊनलोड (HD)'}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {exportSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{exportSuccess}</span>
          </div>
        )}

        {/* Premium Lock Banner if locked */}
        {isLocked && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs font-medium text-amber-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>हा <strong>VIP प्रीमियम टेम्पलेट</strong> आहे. हाय-रिझोल्यूशन डाऊनलोड आणि प्रिंटसाठी आपल्या खात्यावर प्रो किंवा बिझनेस प्लॅन आवश्यक आहे.</span>
            </div>
            <button
              type="button"
              onClick={onOpenPricingModal}
              className="shrink-0 font-bold underline hover:text-amber-700 cursor-pointer"
            >
              प्लॅन्स पहा व अपग्रेड करा →
            </button>
          </div>
        )}

        {/* Main Editor Split Pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Form Pane (50% on desktop) */}
          <div className="w-full md:w-[48%] lg:w-[44%] border-r border-slate-200 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
            <div className="max-w-xl mx-auto space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  माहिती भरा व कस्टमाईज करा
                </span>
                <span className="text-[11px] text-slate-400">
                  (बदल त्वरित उजवीकडे दिसतात)
                </span>
              </div>

              {/* WEDDING FORM FIELDS */}
              {template.category === 'wedding' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वधूचे नाव (Bride Name)
                      </label>
                      <input
                        type="text"
                        value={weddingData.brideName}
                        onChange={(e) => handleWeddingChange('brideName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        placeholder="चि. सौ. कां. सानिका"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वराचे नाव (Groom Name)
                      </label>
                      <input
                        type="text"
                        value={weddingData.groomName}
                        onChange={(e) => handleWeddingChange('groomName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        placeholder="चि. रोहन"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वधूचे माता-पिता
                      </label>
                      <input
                        type="text"
                        value={weddingData.brideParents}
                        onChange={(e) => handleWeddingChange('brideParents', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वराचे माता-पिता
                      </label>
                      <input
                        type="text"
                        value={weddingData.groomParents}
                        onChange={(e) => handleWeddingChange('groomParents', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        विवाह तारीख
                      </label>
                      <input
                        type="text"
                        value={weddingData.weddingDate}
                        onChange={(e) => handleWeddingChange('weddingDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वेळ व वार
                      </label>
                      <input
                        type="text"
                        value={weddingData.weddingTime}
                        onChange={(e) => handleWeddingChange('weddingTime', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        शुभ मुहूर्त
                      </label>
                      <input
                        type="text"
                        value={weddingData.muhurat}
                        onChange={(e) => handleWeddingChange('muhurat', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      विवाह स्थळ (Venue)
                    </label>
                    <input
                      type="text"
                      value={weddingData.venue}
                      onChange={(e) => handleWeddingChange('venue', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      पत्ता (Address)
                    </label>
                    <input
                      type="text"
                      value={weddingData.address}
                      onChange={(e) => handleWeddingChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      निमंत्रण संदेश / श्लोक
                    </label>
                    <textarea
                      rows={2}
                      value={weddingData.invitationMessage}
                      onChange={(e) => handleWeddingChange('invitationMessage', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        निमंत्रक (Hosts)
                      </label>
                      <input
                        type="text"
                        value={weddingData.hosts}
                        onChange={(e) => handleWeddingChange('hosts', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        संपर्क मोबाईल
                      </label>
                      <input
                        type="text"
                        value={weddingData.contactDetails}
                        onChange={(e) => handleWeddingChange('contactDetails', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ENGAGEMENT FORM FIELDS */}
              {template.category === 'engagement' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        कन्येचे नाव (Bride Name)
                      </label>
                      <input
                        type="text"
                        value={engagementData.brideName}
                        onChange={(e) => handleEngagementChange('brideName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        कुमाराचे नाव (Groom Name)
                      </label>
                      <input
                        type="text"
                        value={engagementData.groomName}
                        onChange={(e) => handleEngagementChange('groomName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        साखरपुडा तारीख
                      </label>
                      <input
                        type="text"
                        value={engagementData.engagementDate}
                        onChange={(e) => handleEngagementChange('engagementDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        वेळ व दिवस
                      </label>
                      <input
                        type="text"
                        value={engagementData.time}
                        onChange={(e) => handleEngagementChange('time', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      अंगठी बदलण्याचा सोहळा (Ring Ceremony Details)
                    </label>
                    <input
                      type="text"
                      value={engagementData.ringCeremonyDetails || ''}
                      onChange={(e) => handleEngagementChange('ringCeremonyDetails', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      कार्यक्रम स्थळ (Venue)
                    </label>
                    <input
                      type="text"
                      value={engagementData.venue}
                      onChange={(e) => handleEngagementChange('venue', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      पत्ता (Address)
                    </label>
                    <input
                      type="text"
                      value={engagementData.address}
                      onChange={(e) => handleEngagementChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      विशेष सूचना / स्नेहभोजन
                    </label>
                    <input
                      type="text"
                      value={engagementData.specialNote || ''}
                      onChange={(e) => handleEngagementChange('specialNote', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* RESUME / CV FORM FIELDS */}
              {template.category === 'resume' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        पूर्ण नाव (Full Name)
                      </label>
                      <input
                        type="text"
                        value={resumeData.fullName}
                        onChange={(e) => handleResumeChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        हुद्दा (Job Title / Role)
                      </label>
                      <input
                        type="text"
                        value={resumeData.professionalTitle}
                        onChange={(e) => handleResumeChange('professionalTitle', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ईमेल पत्ता (Email)
                      </label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handleResumeChange('email', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        फोन नंबर (Phone)
                      </label>
                      <input
                        type="text"
                        value={resumeData.phone}
                        onChange={(e) => handleResumeChange('phone', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      पत्ता / शहर (City, State)
                    </label>
                    <input
                      type="text"
                      value={resumeData.address}
                      onChange={(e) => handleResumeChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      प्रोफेशनल सारांश (Profile Summary)
                    </label>
                    <textarea
                      rows={3}
                      value={resumeData.professionalSummary}
                      onChange={(e) => handleResumeChange('professionalSummary', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  {/* Skills Tag Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      कौशल्ये (Skills - कॉमा देऊन लिहा)
                    </label>
                    <input
                      type="text"
                      value={resumeData.skills?.join(', ') || ''}
                      onChange={(e) => handleResumeChange('skills', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                      placeholder="React, TypeScript, Node.js, SQL"
                    />
                  </div>

                  {/* Work Experience Section */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        कामाचा अनुभव (Work Experience)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>अनुभव जोडा</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {resumeData.workExperience?.map((exp) => (
                        <div key={exp.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{exp.role}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(exp.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-slate-600">{exp.company} • {exp.duration}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Preview Pane (52% on desktop) */}
          <div className="flex-1 bg-slate-900/95 overflow-auto flex flex-col items-center justify-center p-4 sm:p-8 relative">
            {/* Zoom Controls Overlay */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-800/90 text-white rounded-xl p-1 border border-slate-700 shadow-md">
              <button
                type="button"
                onClick={() => setZoomScale(s => Math.max(0.4, s - 0.1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded-lg cursor-pointer"
                title="झूम कमी करा"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold px-2">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale(s => Math.min(1.4, s + 0.1))}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded-lg cursor-pointer"
                title="झूम वाढवा"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(0.85)}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded-lg cursor-pointer"
                title="रीसेट करा"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Document Render Canvas Area */}
            <div ref={printAreaRef} className="py-8 flex justify-center">
              <MasterTemplateRenderer
                template={template}
                weddingData={weddingData}
                engagementData={engagementData}
                resumeData={resumeData}
                scale={zoomScale}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
