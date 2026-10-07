import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  // Convert dev URL to pre (public shared preview) URL so mobile users don't get 403 Forbidden
  const rawUrl = window.location.href;
  const currentUrl = rawUrl.includes('ais-dev-')
    ? rawUrl.replace('ais-dev-', 'ais-pre-')
    : rawUrl;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'तुमच्या मोबाईल ब्राउझरमध्ये (Chrome/Safari) वरच्या किंवा खालच्या ३ डॉट्सवर (⋮) क्लिक करून "Install app" किंवा "Add to Home screen" निवडा!'
      );
    }
  };

  const handleShareToWhatsApp = () => {
    const text = encodeURIComponent(
      `📲 GrowView Festival & Business Poster Maker ॲप तुमच्या मोबाईलमध्ये उघडा आणि होम स्क्रीनवर इन्स्टॉल करा:\n${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md shadow-orange-500/20 shrink-0">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                मोबाईलमध्ये ॲप डाऊनलोड / इन्स्टॉल करा
              </h3>
              <p className="text-xs text-slate-500">
                प्ले स्टोअरशिवाय थेट १-क्लिकमध्ये होम स्क्रीनवर इन्स्टॉल होते (PWA)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            title="बंद करा"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Quick 1-Click Install Button if supported */}
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
            >
              <Download className="w-5 h-5" />
              <span>थेट मोबाईलमध्ये इन्स्टॉल करा (Install Now)</span>
            </button>
          )}

          {isInstalled && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>हे ॲप तुमच्या मोबाईलमध्ये आधीच इन्स्टॉल झालेले आहे!</span>
            </div>
          )}

          {/* Android Steps Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
                A
              </span>
              <span>Android मोबाईलमध्ये इन्स्टॉल करण्याची पद्धत (Chrome)</span>
            </div>

            <ol className="text-xs text-slate-700 space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-orange-600 shrink-0">१.</span>
                <span>
                  मोबाईलमधील Chrome ब्राऊझरच्या वरच्या उजव्या कोपऱ्यात <strong>३ डॉट्स (⋮ Menu)</strong> वर टॅप करा.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-orange-600 shrink-0">२.</span>
                <span>
                  पर्यायांमधून <strong>"Install app"</strong> किंवा <strong>"Add to Home screen" (होम स्क्रीनवर जोडा)</strong> निवडा.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-orange-600 shrink-0">३.</span>
                <span>
                  <strong>"Install"</strong> वर क्लिक करताच मोबाईलच्या होम स्क्रीनवर ॲपचा आयकॉन तयार होईल आणि प्ले-स्टोअर ॲपप्रमाणे चालेल!
                </span>
              </li>
            </ol>
          </div>

          {/* iPhone (iOS) Steps Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
              <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-black">
                i
              </span>
              <span>iPhone (Apple Safari) मध्ये इन्स्टॉल करण्याची पद्धत</span>
            </div>

            <ol className="text-xs text-slate-700 space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 shrink-0">१.</span>
                <span>Safari ब्राउझरमध्ये खालील मध्यभागी असणाऱ्या <strong>Share (📤)</strong> आयकॉनवर टॅप करा.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 shrink-0">२.</span>
                <span>खाली स्क्रोल करून <strong>"Add to Home Screen" (+)</strong> वर टॅप करा.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 shrink-0">३.</span>
                <span>उजव्या वरच्या कोपऱ्यात <strong>"Add"</strong> वर क्लिक करा.</span>
              </li>
            </ol>
          </div>

          {/* Send to Mobile via WhatsApp */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <p className="text-xs text-emerald-950 font-bold flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>मोबाईलवर लिंक पाठवा:</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleShareToWhatsApp}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp वर स्वतःला पाठवा</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                {copied ? '✅ लिंक कॉपी झाली!' : '🔗 लिंक कॉपी करा'}
              </button>
            </div>
          </div>

          {/* 403 Troubleshooting Guidance */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 text-xs text-amber-900">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">!</span>
              <span>जर मोबाईलवर "403: You do not have access" एरर येत असेल:</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              १. <strong>AI Studio मध्ये Share करा:</strong> संगणकावरील AI Studio स्क्रीनच्या उजव्या वरच्या कोपऱ्यात <strong>"Share"</strong> बटणावर क्लिक करा आणि लिंक 'Public' करा.<br />
              २. <strong>किंवा Google Account:</strong> मोबाईलच्या Chrome ब्राऊझरमध्ये तुमचे AI Studio चे Google Account (<span className="font-mono font-semibold">sonawanel.gaurav@gmail.com</span>) लॉगिन असू द्या.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            समजले, बंद करा
          </button>
        </div>

      </div>
    </div>
  );
};
