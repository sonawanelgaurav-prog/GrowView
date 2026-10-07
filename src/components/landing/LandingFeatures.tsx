import React from 'react';
import {
  Sparkles,
  LayoutTemplate,
  Briefcase,
  Sliders,
  Share2,
  TrendingUp,
} from 'lucide-react';

interface LandingFeaturesProps {
  title?: string;
  subtitle?: string;
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({ title, subtitle }) => {
  const featureList = [
    {
      icon: Sparkles,
      title: 'AI पोस्टर जनरेटर (AI Design)',
      desc: 'मराठी व इंग्रजी सण आणि बिझनेस पोस्टर्स, मथळे व कोट्स काही सेकंदात AI ने तयार करा.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: LayoutTemplate,
      title: 'सण व व्यवसाय टेम्पलेट्स (Templates)',
      desc: 'शिवजयंती, गणेशोत्सव, दिवाळी, वाढदिवस, सुविचार आणि सर्व प्रकारच्या व्यवसायांसाठी तयार पोस्टर्स.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Briefcase,
      title: '२७+ ऑटो ब्रँडिंग फ्रेम्स (Brand Kit)',
      desc: 'आपला लोगो, नाव, पत्ता व मोबाईल नंबरसह दर्जेदार फ्रेम्स थेट पोस्टर्सवर एका क्लिकवर जोडा.',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: Sliders,
      title: 'लाईव्ह पोस्टर एडिटर (Live Editor)',
      desc: 'मराठी फॉन्ट्स, अक्षरांचे रंग, स्टिकर्स, लोगो प्लेसमेंट आणि सुपर-फास्ट HD डाऊनलोड.',
      color: 'bg-sky-50 text-sky-600',
    },
    {
      icon: Share2,
      title: 'सोशल मीडिया व रील्स (Reels Studio)',
      desc: 'WhatsApp स्टेटस (९:१६), Instagram पोस्ट (१:१), आणि १-क्लिक ॲनिमेटेड रील्स तयार करा.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'VIP बिझनेस टूल्स (Business Growth)',
      desc: 'वॉटरमार्क-फ्री HD क्वालिटी, बिझनेस प्रोफाइल्स, व्हॉट्सॲप सपोर्ट आणि ऑटो शेड्यूलर.',
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <section id="section-features" className="py-16 md:py-24 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>GrowView ची खास वैशिष्ट्ये</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            {title || 'व्यवसाय वाढवण्यासाठी संपूर्ण सोल्यूशन'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            {subtitle || 'दररोज सोशल मीडियावर नवीन पोस्टर्स शेअर करून ग्राहकांशी नेहमी जोडलेले राहा.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200/80 hover:border-amber-400/50 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl shadow-xs group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#18181B] mb-2 font-['Outfit']">{item.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

