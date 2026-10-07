import React, { useState } from 'react';
import { UserAccount } from '../types';
import { loginWithCredentials } from '../services/authService';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  LogIn,
  Loader2,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  currentUser?: UserAccount | null;
  onAdminLoginSuccess: (adminUser: UserAccount) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
}) => {
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Strict Admin Login: Requires valid registered credentials verified by the server
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!adminIdentifier.trim() || !adminPassword.trim()) {
      setErrorMessage('कृपया अधिकृत ॲडमिन ईमेल किंवा युझरनेम आणि पासवर्ड प्रविष्ट करा.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { user } = await loginWithCredentials(adminIdentifier.trim(), adminPassword.trim());

      // Verify that user possesses admin credentials
      if (user.role !== 'admin' && !user.adminRole) {
        setErrorMessage('प्रवेश नाकारला: हे खाते ॲडमिन पॅनलसाठी अधिकृत नाही.');
        return;
      }

      setSuccessMessage(`प्रमाणीकरण यशस्वी! स्वागत आहे, ${user.name}...`);
      setTimeout(() => {
        onAdminLoginSuccess(user);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'लॉगिन अयशस्वी झाले. कृपया माहिती तपासा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                GROWVIEW Admin Authentication
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                केवळ अधिकृत सुपर ॲडमिन व मॅनेजर्ससाठी सुरक्षित लॉगिन
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 sm:p-6 space-y-4 relative z-10">
          {errorMessage && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm p-3.5 rounded-xl flex items-start gap-2.5">
              <p className="font-medium leading-relaxed">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                अधिकृत ॲडमिन ईमेल किंवा युझरनेम (Admin Email / Username) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  placeholder="उदा. admin किंवा sonawanel.gaurav@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ॲडमिन पासवर्ड (Admin Password) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="आपला सुरक्षित ॲडमिन पासवर्ड टाका"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>प्रमाणीकरण होत आहे...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>सुरक्षित ॲडमिन लॉगिन करा (Admin Login)</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              सर्व ॲडमिन सत्रे व ॲक्सेस सर्व्हरद्वारे कडकपणे नियंत्रित व लॉग केले जातात.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
