import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppSupportFloatProps {
  businessName?: string;
  supportNumber?: string;
}

export const WhatsAppSupportFloat: React.FC<WhatsAppSupportFloatProps> = ({
  businessName = 'My Business',
  supportNumber = '+917774914906',
}) => {
  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello GrowView Support! I need help creating high-impact festival posters for my business "${businessName}".`
    );
    const cleanNumber = supportNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40">
      <button
        type="button"
        onClick={handleOpenWhatsApp}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2.5 rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all transform hover:scale-105 active:scale-95 group border-2 border-white/80"
        title="Chat on WhatsApp Support"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold hidden sm:inline">
          Festival Help / WhatsApp
        </span>
      </button>
    </div>
  );
};
