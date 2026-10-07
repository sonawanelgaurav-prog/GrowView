import React from 'react';

interface MotifProps {
  type: string;
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  imageUrl?: string;
}

export const MotifGraphics: React.FC<MotifProps> = ({
  type,
  className = 'w-48 h-48',
  primaryColor = '#f59e0b',
  accentColor = '#ef4444',
  imageUrl,
}) => {
  if (imageUrl) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={imageUrl}
          alt="Custom Graphic"
          className="w-full h-full object-contain drop-shadow-2xl rounded-xl transition-transform hover:scale-105"
        />
      </div>
    );
  }

  switch (type) {
    case 'diwali-diya':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Aura Glow */}
          <circle cx="100" cy="80" r="45" fill="url(#diwali-glow)" opacity="0.6" />
          {/* Flame */}
          <path d="M100 25C100 25 118 65 118 85C118 100 110 108 100 108C90 108 82 100 82 85C82 65 100 25 100 25Z" fill="url(#flame-grad)" />
          <path d="M100 45C100 45 110 70 110 85C110 94 105 100 100 100C95 100 90 94 90 85C90 70 100 45 100 45Z" fill="#ffedd5" />
          {/* Clay Diya Lamp Base */}
          <path d="M40 105C45 138 75 160 100 160C125 160 155 138 160 105C160 105 135 118 100 118C65 118 40 105 40 105Z" fill="url(#diya-base)" />
          {/* Ornate Rim Engravings */}
          <path d="M45 108C60 120 140 120 155 108" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="70" cy="128" r="4" fill="#fef08a" />
          <circle cx="100" cy="135" r="5" fill="#fef08a" />
          <circle cx="130" cy="128" r="4" fill="#fef08a" />
          {/* Sparkles */}
          <path d="M45 45L48 55L58 58L48 61L45 71L42 61L32 58L42 55Z" fill="#fde047" opacity="0.8" />
          <path d="M155 45L158 55L168 58L158 61L155 71L152 61L142 58L152 55Z" fill="#fde047" opacity="0.8" />
          <defs>
            <radialGradient id="diwali-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="flame-grad" x1="100" y1="25" x2="100" y2="108" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="diya-base" x1="40" y1="105" x2="160" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'ganesh-murti':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Divine Aura */}
          <circle cx="100" cy="95" r="75" fill="url(#ganesh-halo)" opacity="0.4" />
          <circle cx="100" cy="95" r="72" stroke="#fde047" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
          {/* Crown (Mukut) */}
          <path d="M80 48L100 20L120 48L112 58L88 58Z" fill="url(#gold-crown)" />
          <circle cx="100" cy="35" r="4" fill="#dc2626" />
          {/* Head & Ears */}
          <path d="M70 70C50 65 35 85 45 105C55 120 75 110 80 98" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M130 70C150 65 165 85 155 105C145 120 125 110 120 98" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          {/* Forehead Tilak (Trishul Shape) */}
          <path d="M92 65H108M90 70H110M94 75H106" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="62" r="3" fill="#dc2626" />
          <line x1="100" y1="58" x2="100" y2="78" stroke="#eab308" strokeWidth="2" />
          {/* Trunk (Sond) */}
          <path d="M100 78C95 100 90 125 105 135C115 142 125 138 126 128C126 120 118 116 114 122" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
          {/* Modak */}
          <path d="M138 122C138 122 148 115 152 125C154 132 144 138 138 134Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          {/* Bottom Lotus Petals */}
          <path d="M60 160C80 150 120 150 140 160C130 172 70 172 60 160Z" fill="#e11d48" opacity="0.9" />
          <defs>
            <radialGradient id="ganesh-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="gold-crown" x1="80" y1="20" x2="120" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'navratri-garba':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Garba / Dandiya Sticks */}
          <circle cx="100" cy="100" r="70" fill="url(#nav-glow)" opacity="0.3" />
          {/* Crossed Dandiya sticks */}
          <rect x="45" y="150" width="130" height="12" rx="6" transform="rotate(-45 45 150)" fill="url(#dandiya1)" stroke="#fef08a" strokeWidth="2" />
          <rect x="55" y="55" width="130" height="12" rx="6" transform="rotate(45 55 55)" fill="url(#dandiya2)" stroke="#fef08a" strokeWidth="2" />
          {/* Decorative bells / ghungroo */}
          <circle cx="65" cy="140" r="7" fill="#fde047" stroke="#b45309" strokeWidth="2" />
          <circle cx="135" cy="140" r="7" fill="#fde047" stroke="#b45309" strokeWidth="2" />
          <circle cx="100" cy="40" r="6" fill="#fde047" stroke="#b45309" strokeWidth="2" />
          {/* Garba Pot with Diya on top */}
          <path d="M85 145C85 130 115 130 115 145C125 155 120 175 100 175C80 175 75 155 85 145Z" fill="#dc2626" stroke="#fde047" strokeWidth="2" />
          <circle cx="100" cy="126" r="4" fill="#f97316" />
          <defs>
            <radialGradient id="nav-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dandiya1" x1="45" y1="150" x2="175" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="dandiya2" x1="55" y1="55" x2="185" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'independence-flag':
    case 'republic-chakra':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Indian Tiranga Ribbon Waves */}
          <circle cx="100" cy="100" r="75" fill="#1e3a8a" opacity="0.1" />
          {/* Saffron Wave */}
          <path d="M30 65C60 50 140 80 170 65C170 85 140 100 170 120L30 120Z" fill="#ff9933" opacity="0.9" />
          {/* White Stripe */}
          <rect x="25" y="85" width="150" height="30" fill="#ffffff" />
          {/* Green Stripe */}
          <path d="M30 115C60 100 140 130 170 115C170 135 140 150 170 170L30 170Z" fill="#138808" opacity="0.9" />
          {/* Ashoka Chakra */}
          <circle cx="100" cy="100" r="14" stroke="#000080" strokeWidth="2" fill="#ffffff" />
          <circle cx="100" cy="100" r="2.5" fill="#000080" />
          {/* 24 Spokes representation */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
            <line
              key={idx}
              x1="100"
              y1="100"
              x2={100 + 13 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 13 * Math.sin((angle * Math.PI) / 180)}
              stroke="#000080"
              strokeWidth="1.2"
            />
          ))}
        </svg>
      );

    case 'krishna-flute':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Peacock Feather */}
          <path d="M120 40C150 20 170 50 150 80C135 100 115 110 115 110" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="140" cy="55" rx="18" ry="24" transform="rotate(30 140 55)" fill="#0284c7" />
          <ellipse cx="140" cy="55" rx="10" ry="14" transform="rotate(30 140 55)" fill="#0f172a" />
          <circle cx="140" cy="55" r="5" fill="#eab308" />
          {/* Golden Flute (Bansuri) */}
          <rect x="35" y="115" width="130" height="14" rx="7" transform="rotate(-25 35 115)" fill="url(#flute-grad)" stroke="#ca8a04" strokeWidth="2" />
          {/* Flute Holes */}
          <circle cx="85" cy="98" r="3" fill="#451a03" />
          <circle cx="105" cy="89" r="3" fill="#451a03" />
          <circle cx="125" cy="80" r="3" fill="#451a03" />
          <circle cx="145" cy="71" r="3" fill="#451a03" />
          {/* Pearl / Ribbon Tassels hanging */}
          <path d="M45 135C45 155 55 165 52 175" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
          <circle cx="52" cy="178" r="5" fill="#fde047" />
          <defs>
            <linearGradient id="flute-grad" x1="35" y1="115" x2="165" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'rakhi-thread':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sacred Threads */}
          <path d="M20 100C50 90 70 100 90 100" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <path d="M110 100C130 100 150 110 180 100" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <path d="M20 100C50 110 70 100 90 100" stroke="#eab308" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M110 100C130 100 150 90 180 100" stroke="#eab308" strokeWidth="2" strokeDasharray="4 4" />
          {/* Floral Center Emblem */}
          <circle cx="100" cy="100" r="30" fill="url(#rakhi-grad)" stroke="#fde047" strokeWidth="3" />
          <circle cx="100" cy="100" r="22" fill="#b91c1c" stroke="#fde047" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="12" fill="#fde047" />
          <circle cx="100" cy="100" r="6" fill="#e11d48" />
          {/* Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
            <circle
              key={i}
              cx={100 + 34 * Math.cos((ang * Math.PI) / 180)}
              cy={100 + 34 * Math.sin((ang * Math.PI) / 180)}
              r="4"
              fill="#fbbf24"
            />
          ))}
          <defs>
            <linearGradient id="rakhi-grad" x1="70" y1="70" x2="130" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'shiva-trishul':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Crescent Moon */}
          <path d="M125 35C115 35 105 45 105 60C105 75 118 85 132 82C120 80 115 70 115 60C115 48 122 40 125 35Z" fill="#e0f2fe" opacity="0.9" />
          {/* Central Trishul */}
          <path d="M100 25V175" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          {/* Trishul Prongs */}
          <path d="M70 45C70 75 90 90 100 90C110 90 130 75 130 45" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M68 45L64 35L76 40Z" fill="#f59e0b" />
          <path d="M132 45L136 35L124 40Z" fill="#f59e0b" />
          <path d="M100 25L94 15L106 15Z" fill="#f59e0b" />
          {/* Damru */}
          <path d="M85 105L115 125H85L115 105H85Z" fill="#b45309" stroke="#fde047" strokeWidth="2" />
          <circle cx="100" cy="115" r="3" fill="#fde047" />
          {/* Rudraksha beads string */}
          <circle cx="82" cy="115" r="4" fill="#78350f" />
          <circle cx="118" cy="115" r="4" fill="#78350f" />
        </svg>
      );

    case 'real-estate-house':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Modern Architectural Skyline & Villa */}
          <rect x="40" y="70" width="40" height="100" fill="#0284c7" opacity="0.7" rx="4" />
          <rect x="90" y="50" width="45" height="120" fill="#0369a1" rx="4" />
          <rect x="145" y="90" width="30" height="80" fill="#38bdf8" opacity="0.8" rx="4" />
          {/* House Roof Accent Line */}
          <path d="M30 110L100 40L170 110" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          {/* Windows */}
          <rect x="100" y="70" width="10" height="10" fill="#fef08a" rx="1" />
          <rect x="115" y="70" width="10" height="10" fill="#fef08a" rx="1" />
          <rect x="100" y="90" width="10" height="10" fill="#fef08a" rx="1" />
          <rect x="115" y="90" width="10" height="10" fill="#fef08a" rx="1" />
          {/* Key with Ribbon */}
          <circle cx="150" cy="55" r="12" stroke="#f59e0b" strokeWidth="3" fill="#ffffff" />
          <path d="M158 63L175 80M170 75L176 69M165 70L171 64" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'jewelry-gold':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sparkle Glow */}
          <circle cx="100" cy="100" r="65" fill="#fef08a" opacity="0.15" />
          {/* Royal Diamond & Necklace */}
          <path d="M60 70C80 50 120 50 140 70C155 110 120 150 100 160C80 150 45 110 60 70Z" stroke="url(#jewel-gold)" strokeWidth="4" />
          {/* Diamond Cutout */}
          <path d="M100 65L125 90L100 125L75 90L100 65Z" fill="url(#jewel-facet)" stroke="#fef08a" strokeWidth="2" />
          <line x1="75" y1="90" x2="125" y2="90" stroke="#fef08a" strokeWidth="2" />
          <line x1="100" y1="65" x2="100" y2="125" stroke="#ffffff" strokeWidth="2" />
          {/* Golden Pearls */}
          <circle cx="65" cy="85" r="5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          <circle cx="135" cy="85" r="5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          <circle cx="80" cy="120" r="5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          <circle cx="120" cy="120" r="5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          <circle cx="100" cy="155" r="7" fill="#dc2626" stroke="#fde047" strokeWidth="2" />
          <defs>
            <linearGradient id="jewel-gold" x1="60" y1="70" x2="140" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="jewel-facet" x1="75" y1="65" x2="125" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'doctor-medical':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Red Cross & Heartbeat Line */}
          <circle cx="100" cy="100" r="70" fill="#fee2e2" />
          <rect x="88" y="45" width="24" height="110" rx="6" fill="#ef4444" />
          <rect x="45" y="88" width="110" height="24" rx="6" fill="#ef4444" />
          {/* Heart Beat Wave */}
          <path d="M35 140H75L85 115L95 165L105 125L115 140H165" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Stethoscope */}
          <path d="M60 60C60 90 90 90 90 90M140 60C140 90 110 90 110 90V110C110 130 130 130 130 130" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="130" cy="130" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
        </svg>
      );

    case 'restaurant-food':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gourmet Cloche / Bowl & Steam */}
          <circle cx="100" cy="100" r="70" fill="#fef3c7" />
          {/* Aroma Steam Lines */}
          <path d="M85 45C80 55 90 65 85 75" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 40C95 50 105 60 100 70" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M115 45C110 55 120 65 115 75" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          {/* Dish Platter & Dome */}
          <path d="M50 115C50 75 150 75 150 115H50Z" fill="#ea580c" />
          <rect x="40" y="115" width="120" height="12" rx="6" fill="#c2410c" />
          <circle cx="100" cy="72" r="6" fill="#fde047" />
          {/* Fork & Spoon crossed */}
          <line x1="60" y1="140" x2="90" y2="170" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <line x1="140" y1="140" x2="110" y2="170" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'morning-sun':
    case 'morning-sun-peaks':
    case 'motivational-mountain':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rising Sun Rays */}
          <circle cx="100" cy="105" r="46" fill="url(#sun-grad)" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <line
              key={i}
              x1={100 + 55 * Math.cos((deg * Math.PI) / 180)}
              y1={105 + 55 * Math.sin((deg * Math.PI) / 180)}
              x2={100 + 72 * Math.cos((deg * Math.PI) / 180)}
              y2={105 + 72 * Math.sin((deg * Math.PI) / 180)}
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ))}
          {/* Mountain Peaks Silhouette */}
          <path d="M15 175L75 95L120 150L150 115L185 175H15Z" fill="url(#mountain-grad)" />
          {/* Golden Sun Highlights on peaks */}
          <path d="M75 95L60 120L75 125L90 120Z" fill="#fde047" opacity="0.6" />
          <path d="M150 115L140 135L150 140L160 135Z" fill="#fde047" opacity="0.6" />
          {/* Flying birds */}
          <path d="M45 55Q52 46 60 55Q68 46 75 55" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M130 45Q136 38 142 45Q148 38 155 45" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <defs>
            <linearGradient id="sun-grad" x1="100" y1="60" x2="100" y2="155" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="mountain-grad" x1="100" y1="95" x2="100" y2="175" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'morning-coffee-cup':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Aura */}
          <circle cx="100" cy="100" r="70" fill="#fef3c7" opacity="0.4" />
          {/* Steam curves */}
          <path d="M80 40C75 55 90 65 85 80" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M100 32C92 50 108 60 100 78" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M120 40C115 55 130 65 125 80" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
          {/* Cup body */}
          <path d="M55 85H145L138 145C136 158 124 168 110 168H90C76 168 64 158 62 145L55 85Z" fill="url(#coffee-cup-grad)" />
          {/* Cup Rim */}
          <ellipse cx="100" cy="85" rx="45" ry="10" fill="#b45309" stroke="#fef3c7" strokeWidth="2" />
          {/* Latte Foam Heart */}
          <ellipse cx="100" cy="85" rx="35" ry="7" fill="#78350f" />
          <path d="M100 87C95 81 88 84 94 88L100 91L106 88C112 84 105 81 100 87Z" fill="#ffedd5" />
          {/* Cup Handle */}
          <path d="M140 95C160 95 165 135 135 140" stroke="#b45309" strokeWidth="9" strokeLinecap="round" />
          {/* Saucer */}
          <ellipse cx="100" cy="172" rx="65" ry="9" fill="#78350f" stroke="#fef3c7" strokeWidth="2" />
          <defs>
            <linearGradient id="coffee-cup-grad" x1="55" y1="85" x2="145" y2="168" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'morning-tea-cup':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glowing Aura */}
          <circle cx="100" cy="100" r="70" fill="#ffedd5" opacity="0.5" />
          {/* Tea Vapor */}
          <path d="M85 35C78 50 92 60 85 75" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          <path d="M105 28C98 46 112 55 105 72" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          {/* Cutting Glass Shape */}
          <path d="M65 75H135L125 155C124 162 118 168 110 168H90C82 168 76 162 75 155L65 75Z" fill="url(#tea-glass-grad)" stroke="#fed7aa" strokeWidth="2" />
          {/* Tea level */}
          <path d="M68 95H132L124 152C123 158 118 162 110 162H90C82 162 77 158 76 152L68 95Z" fill="#c2410c" opacity="0.9" />
          {/* Cardamom / Mint Leaf */}
          <path d="M100 95C90 85 100 70 115 80C110 95 105 95 100 95Z" fill="#22c55e" />
          {/* Saucer */}
          <ellipse cx="100" cy="172" rx="60" ry="8" fill="#9a3412" />
          <defs>
            <linearGradient id="tea-glass-grad" x1="65" y1="75" x2="135" y2="168" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fdba74" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'morning-blooming-rose':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Soft Glow */}
          <circle cx="100" cy="90" r="65" fill="#ffe4e6" opacity="0.6" />
          {/* Stem & Leaves */}
          <path d="M100 120V175" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 145C80 135 70 150 70 150C70 150 85 160 100 145Z" fill="#16a34a" />
          <path d="M100 135C120 125 130 140 130 140C130 140 115 150 100 135Z" fill="#16a34a" />
          {/* Rose Petals layers */}
          <circle cx="100" cy="90" r="42" fill="#e11d48" />
          <path d="M70 85C70 65 95 60 100 75C105 60 130 65 130 85C130 105 100 125 100 125C100 125 70 105 70 85Z" fill="#f43f5e" />
          <path d="M80 82C80 70 95 68 100 78C105 68 120 70 120 82C120 96 100 110 100 110C100 110 80 96 80 82Z" fill="#fda4af" />
          <circle cx="100" cy="85" r="10" fill="#be123c" />
          {/* Sparkles / Dewdrops */}
          <circle cx="85" cy="75" r="3" fill="#ffffff" opacity="0.9" />
          <circle cx="115" cy="95" r="2.5" fill="#ffffff" opacity="0.9" />
        </svg>
      );

    case 'morning-ocean-wave':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rising Sun */}
          <circle cx="100" cy="80" r="38" fill="url(#ocean-sun)" />
          {/* Ocean Waves */}
          <path d="M20 125C50 110 80 135 110 120C140 105 170 130 185 125V175H20V125Z" fill="#0284c7" />
          <path d="M15 140C45 125 85 150 120 135C155 120 175 145 185 140V175H15V140Z" fill="#0369a1" />
          <path d="M15 155C55 140 95 160 135 148C165 138 178 152 185 150V175H15V155Z" fill="#075985" />
          {/* Sea Foam highlights */}
          <path d="M20 125C50 110 80 135 110 120C140 105 170 130 185 125" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
          {/* Flying Seagulls */}
          <path d="M60 55Q66 48 72 55Q78 48 84 55" stroke="#ffffff" strokeWidth="2" fill="none" />
          <path d="M130 65Q135 60 140 65Q145 60 150 65" stroke="#ffffff" strokeWidth="2" fill="none" />
          <defs>
            <linearGradient id="ocean-sun" x1="100" y1="42" x2="100" y2="118" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'morning-road-horizon':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Sun on Horizon */}
          <circle cx="100" cy="95" r="40" fill="#f59e0b" />
          {/* Horizon Line */}
          <line x1="20" y1="105" x2="180" y2="105" stroke="#fbbf24" strokeWidth="2" />
          {/* Highway Perspective */}
          <path d="M85 105L30 180H170L115 105H85Z" fill="#334155" />
          {/* Road Center Dashes */}
          <line x1="100" y1="110" x2="100" y2="120" stroke="#fde047" strokeWidth="2" />
          <line x1="100" y1="128" x2="100" y2="142" stroke="#fde047" strokeWidth="3" />
          <line x1="100" y1="152" x2="100" y2="175" stroke="#fde047" strokeWidth="4.5" />
          {/* Mountains Silhouette */}
          <path d="M20 105L55 80L85 105H20Z" fill="#1e293b" />
          <path d="M115 105L145 75L180 105H115Z" fill="#1e293b" />
        </svg>
      );

    case 'morning-sunflower':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stem */}
          <path d="M100 120V175" stroke="#4d7c0f" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 145C75 140 70 160 70 160C70 160 90 165 100 145Z" fill="#65a30d" />
          <path d="M100 135C125 130 130 150 130 150C130 150 110 155 100 135Z" fill="#65a30d" />
          {/* Petals Circle (12 petals) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 100 + 38 * Math.cos(rad);
            const cy = 85 + 38 * Math.sin(rad);
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx="14"
                ry="7"
                transform={`rotate(${deg} ${cx} ${cy})`}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1"
              />
            );
          })}
          {/* Inner Brown Seed Core */}
          <circle cx="100" cy="85" r="28" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <circle cx="100" cy="85" r="22" fill="#451a03" strokeDasharray="3 3" stroke="#b45309" strokeWidth="2" />
          <circle cx="100" cy="85" r="14" fill="#78350f" />
        </svg>
      );

    case 'morning-forest-lake':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Mist Aura */}
          <circle cx="100" cy="80" r="45" fill="#fef08a" opacity="0.5" />
          {/* Forest Pine Trees */}
          <path d="M40 135L60 90L80 135H40Z" fill="#064e3b" />
          <path d="M70 130L95 75L120 130H70Z" fill="#047857" />
          <path d="M110 135L135 85L160 135H110Z" fill="#065f46" />
          <path d="M140 140L160 100L180 140H140Z" fill="#064e3b" />
          {/* Calm Lake Water */}
          <rect x="20" y="135" width="160" height="40" rx="4" fill="#0f766e" />
          {/* Water Ripples */}
          <line x1="45" y1="145" x2="85" y2="145" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" />
          <line x1="95" y1="152" x2="145" y2="152" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="160" x2="110" y2="160" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'morning-golden-birds':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Sun Ring */}
          <circle cx="100" cy="95" r="50" fill="url(#sun-birds)" />
          {/* Flying Bird 1 */}
          <path d="M60 85Q75 70 90 85Q105 70 120 85C110 95 70 95 60 85Z" fill="#ffffff" />
          {/* Flying Bird 2 */}
          <path d="M105 55Q115 44 125 55Q135 44 145 55C138 62 112 62 105 55Z" fill="#ffffff" />
          {/* Flying Bird 3 */}
          <path d="M45 110Q55 100 65 110Q75 100 85 110C78 116 52 116 45 110Z" fill="#ffffff" />
          {/* Sparkles */}
          <path d="M150 75L153 82L160 85L153 88L150 95L147 88L140 85L147 82Z" fill="#fde047" />
          <defs>
            <linearGradient id="sun-birds" x1="100" y1="45" x2="100" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'morning-lotus-dew':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Halo */}
          <circle cx="100" cy="100" r="60" fill="#fef3c7" opacity="0.5" />
          {/* Lotus Flower */}
          <path d="M100 50C90 75 80 110 100 135C120 110 110 75 100 50Z" fill="#f43f5e" />
          <path d="M100 70C75 85 60 115 80 135C95 125 100 100 100 70Z" fill="#fb7185" />
          <path d="M100 70C125 85 140 115 120 135C105 125 100 100 100 70Z" fill="#fb7185" />
          <path d="M100 90C60 105 45 130 70 145C90 138 100 115 100 90Z" fill="#fda4af" />
          <path d="M100 90C140 105 155 130 130 145C110 138 100 115 100 90Z" fill="#fda4af" />
          {/* Water Base */}
          <ellipse cx="100" cy="155" rx="55" ry="10" fill="#0284c7" opacity="0.8" />
          {/* Dewdrop */}
          <circle cx="100" cy="85" r="4" fill="#ffffff" />
        </svg>
      );

    case 'morning-wellness-yoga':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sun Aura */}
          <circle cx="100" cy="95" r="55" fill="url(#yoga-sun)" />
          {/* Yoga Meditation Silhouette */}
          <circle cx="100" cy="65" r="10" fill="#ffffff" />
          <path d="M100 78C90 78 80 88 80 105C80 118 70 125 60 135H140C130 125 120 118 120 105C120 88 110 78 100 78Z" fill="#ffffff" />
          {/* Lotus Base */}
          <path d="M70 140C85 130 115 130 130 140C115 150 85 150 70 140Z" fill="#fde047" />
          <defs>
            <linearGradient id="yoga-sun" x1="100" y1="40" x2="100" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'morning-village-nature':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Morning Sun */}
          <circle cx="100" cy="85" r="40" fill="#f59e0b" />
          {/* Village Hut Silhouette */}
          <polygon points="50,130 75,100 100,130" fill="#78350f" />
          <rect x="55" y="130" width="40" height="30" fill="#9a3412" />
          <rect x="70" y="142" width="12" height="18" fill="#451a03" />
          {/* Coconut Palm Tree */}
          <path d="M135 160C132 130 140 105 150 90" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          <path d="M150 90C135 75 120 85 120 85" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M150 90C165 75 180 85 180 85" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M150 90C155 70 145 60 145 60" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
          {/* Ground */}
          <path d="M20 160C60 150 140 150 180 160V175H20V160Z" fill="#166534" />
        </svg>
      );

    // --- NIGHT MOTIFS ---
    case 'night-full-moon-lake':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Moonlight Glow Halo */}
          <circle cx="100" cy="80" r="55" fill="#e0f2fe" opacity="0.25" />
          {/* Full Moon */}
          <circle cx="100" cy="80" r="35" fill="url(#full-moon-grad)" />
          {/* Moon Craters */}
          <circle cx="92" cy="72" r="5" fill="#cbd5e1" opacity="0.6" />
          <circle cx="110" cy="85" r="7" fill="#cbd5e1" opacity="0.5" />
          <circle cx="95" cy="92" r="4" fill="#cbd5e1" opacity="0.5" />
          {/* Lake Water Surface */}
          <rect x="20" y="130" width="160" height="45" rx="4" fill="#0f172a" />
          {/* Silver Moon Reflection on Water */}
          <line x1="90" y1="135" x2="110" y2="135" stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <line x1="82" y1="142" x2="118" y2="142" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <line x1="88" y1="149" x2="112" y2="149" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="94" y1="156" x2="106" y2="156" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Stars */}
          <circle cx="45" cy="45" r="2" fill="#ffffff" />
          <circle cx="155" cy="50" r="2.5" fill="#ffffff" />
          <circle cx="165" cy="100" r="1.5" fill="#ffffff" />
          <defs>
            <linearGradient id="full-moon-grad" x1="100" y1="45" x2="100" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'night-crescent-clouds':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Soft Moonlight Glow */}
          <circle cx="100" cy="85" r="50" fill="#fef08a" opacity="0.2" />
          {/* Crescent Moon */}
          <path
            d="M115 50C90 50 70 70 70 95C70 120 90 140 115 140C125 140 134 136 142 130C120 128 102 110 102 88C102 68 116 52 135 52C128 50 122 50 115 50Z"
            fill="url(#crescent-gold)"
          />
          {/* Dreamy Cloud drifting in front */}
          <path
            d="M50 135C50 122 62 112 75 112C78 102 88 95 100 95C114 95 125 105 127 118C138 118 147 126 147 137C147 148 138 155 127 155H60C50 155 50 145 50 135Z"
            fill="#1e1b4b"
            opacity="0.85"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
          {/* Sparkling Stars */}
          <path d="M145 55L147 62L154 64L147 66L145 73L143 66L136 64L143 62Z" fill="#fef08a" />
          <path d="M55 75L56 80L61 81L56 82L55 87L54 82L49 81L54 80Z" fill="#fef08a" />
          <circle cx="160" cy="110" r="2" fill="#ffffff" />
          <defs>
            <linearGradient id="crescent-gold" x1="70" y1="50" x2="142" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'night-starry-galaxy':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cosmic Swirl */}
          <circle cx="100" cy="100" r="70" fill="url(#galaxy-cosmic)" opacity="0.4" />
          {/* Orbiting Star Dust Rings */}
          <ellipse cx="100" cy="100" rx="65" ry="25" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6 8" transform="rotate(-25 100 100)" />
          <ellipse cx="100" cy="100" rx="45" ry="18" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 6" transform="rotate(35 100 100)" />
          {/* Center Glowing Star Core */}
          <circle cx="100" cy="100" r="14" fill="#ffffff" />
          <circle cx="100" cy="100" r="22" fill="#c084fc" opacity="0.5" />
          {/* Four-Point Major Stars */}
          <path d="M100 65L103 90L125 100L103 110L100 135L97 110L75 100L97 90Z" fill="#ffffff" />
          <path d="M45 60L47 70L57 73L47 76L45 86L43 76L33 73L43 70Z" fill="#fde047" />
          <path d="M155 130L157 140L167 143L157 146L155 156L153 146L143 143L153 140Z" fill="#38bdf8" />
          <defs>
            <radialGradient id="galaxy-cosmic" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'night-candle-lamp':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm Candle Light Aura */}
          <circle cx="100" cy="70" r="55" fill="url(#candle-glow)" opacity="0.7" />
          {/* Flame */}
          <path d="M100 40C100 40 110 65 110 75C110 82 105 88 100 88C95 88 90 82 90 75C90 65 100 40 100 40Z" fill="#fef08a" />
          <path d="M100 52C100 52 105 68 105 75C105 79 102 82 100 82C98 82 95 79 95 75C95 68 100 52 100 52Z" fill="#f97316" />
          <line x1="100" y1="88" x2="100" y2="96" stroke="#451a03" strokeWidth="2.5" />
          {/* Wax Candle Body */}
          <rect x="75" y="96" width="50" height="65" rx="6" fill="url(#wax-grad)" stroke="#fde68a" strokeWidth="1.5" />
          {/* Dripping Wax */}
          <path d="M85 96V115C85 118 88 120 90 120C92 120 95 118 95 115V96" fill="#fef3c7" />
          {/* Candle Plate / Holder */}
          <ellipse cx="100" cy="165" rx="55" ry="10" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
          <defs>
            <radialGradient id="candle-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wax-grad" x1="75" y1="96" x2="125" y2="161" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'night-city-skyline':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Moon */}
          <circle cx="150" cy="55" r="22" fill="#fef08a" />
          {/* City Skyscrapers Silhouette */}
          <rect x="25" y="90" width="30" height="85" fill="#1e293b" />
          <rect x="60" y="70" width="35" height="105" fill="#0f172a" />
          <polygon points="77,50 65,70 90,70" fill="#0f172a" />
          <rect x="100" y="85" width="28" height="90" fill="#1e293b" />
          <rect x="132" y="105" width="35" height="70" fill="#0f172a" />
          <rect x="170" y="115" width="15" height="60" fill="#1e293b" />
          {/* Lit Windows */}
          {[
            [32, 100], [45, 100], [32, 115], [45, 125],
            [68, 80], [80, 80], [68, 95], [80, 110], [68, 125],
            [106, 95], [118, 108], [106, 120],
            [140, 115], [152, 125], [140, 140]
          ].map(([wx, wy], idx) => (
            <rect key={idx} x={wx} y={wy} width="6" height="6" rx="1" fill="#fef08a" opacity="0.9" />
          ))}
          {/* Bridge / Ground */}
          <rect x="15" y="172" width="170" height="8" fill="#334155" />
        </svg>
      );

    case 'night-dream-catcher':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Ring */}
          <circle cx="100" cy="75" r="42" stroke="#fbbf24" strokeWidth="4" />
          {/* Inner Web Lines */}
          <circle cx="100" cy="75" r="28" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="100" cy="75" r="14" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="100" cy="75" r="5" fill="#38bdf8" />
          {/* Web Intersects */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line
              key={i}
              x1={100 + 14 * Math.cos((deg * Math.PI) / 180)}
              y1={75 + 14 * Math.sin((deg * Math.PI) / 180)}
              x2={100 + 42 * Math.cos((deg * Math.PI) / 180)}
              y2={75 + 42 * Math.sin((deg * Math.PI) / 180)}
              stroke="#fef08a"
              strokeWidth="1"
            />
          ))}
          {/* Hanging Feathers */}
          {/* Center Feather */}
          <line x1="100" y1="117" x2="100" y2="140" stroke="#fbbf24" strokeWidth="2" />
          <path d="M100 140C92 150 94 175 100 180C106 175 108 150 100 140Z" fill="#38bdf8" />
          {/* Left Feather */}
          <line x1="75" y1="110" x2="70" y2="135" stroke="#fbbf24" strokeWidth="2" />
          <path d="M70 135C64 143 66 165 70 170C74 165 76 143 70 135Z" fill="#c084fc" />
          {/* Right Feather */}
          <line x1="125" y1="110" x2="130" y2="135" stroke="#fbbf24" strokeWidth="2" />
          <path d="M130 135C124 143 126 165 130 170C134 165 136 143 130 135Z" fill="#c084fc" />
        </svg>
      );

    case 'night-moon-silhouette':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Big Moon */}
          <circle cx="100" cy="90" r="50" fill="url(#moon-sil)" />
          {/* Silhouette Tree on hill */}
          <path d="M15 175C60 145 140 145 185 175H15Z" fill="#020617" />
          {/* Tree trunk and branches */}
          <path d="M80 150Q78 120 75 105Q85 95 95 90M75 110Q65 100 60 95M75 125Q60 120 52 118" stroke="#020617" strokeWidth="4.5" strokeLinecap="round" />
          {/* Resting Bird */}
          <circle cx="92" cy="87" r="3.5" fill="#020617" />
          <path d="M92 89L85 92" stroke="#020617" strokeWidth="2" />
          {/* Stars */}
          <circle cx="40" cy="50" r="2" fill="#ffffff" />
          <circle cx="150" cy="40" r="2" fill="#ffffff" />
          <circle cx="165" cy="75" r="2" fill="#ffffff" />
          <defs>
            <linearGradient id="moon-sil" x1="100" y1="40" x2="100" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'night-aurora-glow':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Aurora Waves */}
          <path d="M20 70C60 40 100 90 140 60C165 40 180 70 185 80V140C155 120 120 150 80 125C45 105 25 120 20 115V70Z" fill="url(#aurora-grad-1)" opacity="0.75" />
          <path d="M20 90C50 65 90 110 130 85C160 65 175 90 185 95V155C150 140 110 165 70 140C40 125 25 135 20 130V90Z" fill="url(#aurora-grad-2)" opacity="0.65" />
          {/* Snowy Mountain Peaks Silhouette */}
          <polygon points="20,180 65,125 110,180" fill="#090d16" />
          <polygon points="65,125 55,140 65,145 75,140" fill="#99f6e4" />
          <polygon points="90,180 140,115 185,180" fill="#090d16" />
          <polygon points="140,115 130,132 140,138 150,132" fill="#99f6e4" />
          {/* Stars */}
          <circle cx="50" cy="40" r="2" fill="#ffffff" />
          <circle cx="110" cy="35" r="2.5" fill="#ffffff" />
          <circle cx="160" cy="45" r="2" fill="#ffffff" />
          <defs>
            <linearGradient id="aurora-grad-1" x1="20" y1="60" x2="185" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="aurora-grad-2" x1="20" y1="80" x2="185" y2="155" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      );

    // --- GANESH CHATURTHI 100 SPECIAL MOTIFS ---
    case 'ganesh-dagdusheth-royal':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Royal Sunburst Halo */}
          <circle cx="100" cy="100" r="78" fill="url(#dagdu-halo)" opacity="0.45" />
          <circle cx="100" cy="100" r="72" stroke="#fde047" strokeWidth="2.5" strokeDasharray="6 3" />
          {/* Peshwai Gold Mukut with Red Jewels */}
          <path d="M70 52L100 12L130 52L122 62H78L70 52Z" fill="url(#dagdu-gold)" stroke="#78350f" strokeWidth="1.5" />
          <path d="M85 52L100 25L115 52Z" fill="#b91c1c" />
          <circle cx="100" cy="22" r="5" fill="#fef08a" stroke="#dc2626" strokeWidth="1.5" />
          <circle cx="85" cy="45" r="3.5" fill="#dc2626" />
          <circle cx="115" cy="45" r="3.5" fill="#dc2626" />
          {/* Majestic Ears with Gold Kundan */}
          <path d="M68 68C42 62 25 85 36 112C46 130 70 120 75 106" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
          <path d="M132 68C158 62 175 85 164 112C154 130 130 120 125 106" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
          {/* Gold Ear Ornaments */}
          <circle cx="48" cy="98" r="6" fill="#fde047" stroke="#b45309" strokeWidth="2" />
          <circle cx="152" cy="98" r="6" fill="#fde047" stroke="#b45309" strokeWidth="2" />
          {/* Forehead Chandrakor & Red Trishul Tilak */}
          <path d="M88 68Q100 80 112 68" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="100" cy="65" r="3" fill="#fbbf24" />
          <line x1="100" y1="56" x2="100" y2="76" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          {/* Graceful Trunk (Sond) with Gold Rings */}
          <path d="M100 80C94 105 88 132 108 142C122 148 134 140 134 126C134 116 122 114 118 122" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" />
          <line x1="94" y1="108" x2="104" y2="108" stroke="#fde047" strokeWidth="3" />
          <line x1="97" y1="120" x2="107" y2="120" stroke="#fde047" strokeWidth="3" />
          {/* Golden Modak on Trunk Tip */}
          <path d="M142 122C142 122 152 112 158 124C160 134 148 140 142 136Z" fill="#fde047" stroke="#b45309" strokeWidth="2" />
          <defs>
            <radialGradient id="dagdu-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dagdu-gold" x1="70" y1="12" x2="130" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'ganesh-lalbaug-raja':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grand Throne Aura */}
          <circle cx="100" cy="90" r="75" fill="url(#lalbaug-glow)" opacity="0.5" />
          {/* Lalbaug Tall Crown */}
          <polygon points="100,10 75,55 125,55" fill="url(#lalbaug-crown)" stroke="#991b1b" strokeWidth="2" />
          <circle cx="100" cy="20" r="4.5" fill="#fef08a" />
          <rect x="85" y="48" width="30" height="7" rx="3" fill="#dc2626" />
          {/* Head & Broad Ears */}
          <path d="M72 65C45 60 30 85 42 110C52 125 72 115 76 102" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
          <path d="M128 65C155 60 170 85 158 110C148 125 128 115 124 102" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
          {/* Red Chandrakor Tilak */}
          <path d="M90 68Q100 80 110 68" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="62" r="3" fill="#fde047" />
          {/* Majestic Long Trunk */}
          <path d="M100 78C95 105 88 135 110 145C124 150 136 142 136 128C136 118 124 116 120 124" stroke="#c2410c" strokeWidth="8" strokeLinecap="round" />
          {/* Abhay Mudra Blessing Palm with Swastik */}
          <circle cx="152" cy="115" r="14" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
          <path d="M148 110V120M143 115H153" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
          {/* Yellow Shela (Stole) */}
          <path d="M45 140C65 125 135 125 155 140C145 155 55 155 45 140Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <defs>
            <radialGradient id="lalbaug-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lalbaug-crown" x1="75" y1="10" x2="125" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'ganesh-clay-ecofriendly':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Earth Aura */}
          <circle cx="100" cy="100" r="75" fill="#f0fdf4" opacity="0.6" />
          {/* Durva Grass Sprout at top */}
          <path d="M100 42C90 25 80 30 75 18C85 24 95 32 100 42Z" fill="#15803d" />
          <path d="M100 42C100 20 105 15 105 10C108 20 106 30 100 42Z" fill="#16a34a" />
          <path d="M100 42C110 25 120 30 125 18C115 24 105 32 100 42Z" fill="#15803d" />
          {/* Clay Crown / Pheta */}
          <path d="M78 54C88 44 112 44 122 54L118 64H82L78 54Z" fill="#9a3412" />
          {/* Shaadu Clay Head & Ears */}
          <path d="M72 70C50 65 38 85 46 108C54 122 72 114 78 102" stroke="#78350f" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M128 70C150 65 162 85 154 108C146 122 128 114 122 102" stroke="#78350f" strokeWidth="6.5" strokeLinecap="round" />
          {/* Organic Sandalwood Tilak */}
          <line x1="90" y1="68" x2="110" y2="68" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="100" cy="62" r="3.5" fill="#15803d" />
          {/* Clay Trunk with Natural Curves */}
          <path d="M100 80C94 105 88 132 108 142C122 148 134 140 134 126C134 116 122 114 118 122" stroke="#78350f" strokeWidth="7.5" strokeLinecap="round" />
          {/* Green Leaf Base with Dewdrops */}
          <path d="M40 160C70 145 130 145 160 160C140 178 60 178 40 160Z" fill="#16a34a" />
          <circle cx="90" cy="162" r="3" fill="#ffffff" opacity="0.8" />
          <circle cx="115" cy="160" r="2.5" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'ganesh-abstract-lineart':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cosmic Neon Ring */}
          <circle cx="100" cy="100" r="75" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
          {/* Continuous Gold Lineart Ganesha Om */}
          <path
            d="M95 30C125 30 145 50 140 75C135 95 110 100 100 115C90 130 92 155 115 160C130 162 145 152 145 138C145 128 135 125 130 132"
            stroke="#fbbf24"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Ear Arc */}
          <path d="M95 45C65 48 45 75 58 105C66 120 85 115 90 102" stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Crown Peak */}
          <path d="M90 32L105 15L118 32" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
          {/* Divine Bindu */}
          <circle cx="100" cy="58" r="4.5" fill="#dc2626" />
          <circle cx="140" cy="138" r="5" fill="#fde047" />
        </svg>
      );

    case 'ganesh-lotus-seat':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Halo Glow */}
          <circle cx="100" cy="80" r="65" fill="#fef3c7" opacity="0.5" />
          {/* Crown */}
          <path d="M82 45L100 18L118 45L110 52H90L82 45Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="100" cy="30" r="3.5" fill="#dc2626" />
          {/* Ganesha Face & Ears */}
          <path d="M74 65C52 60 40 82 48 102C56 115 72 108 76 98" stroke="#d97706" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M126 65C148 60 160 82 152 102C144 115 128 108 124 98" stroke="#d97706" strokeWidth="5.5" strokeLinecap="round" />
          {/* Tilak */}
          <path d="M92 65H108M90 70H110" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="62" r="2.5" fill="#dc2626" />
          {/* Trunk */}
          <path d="M100 75C96 95 90 120 108 128C118 132 126 126 126 116C126 108 116 106 112 114" stroke="#b45309" strokeWidth="6.5" strokeLinecap="round" />
          {/* Blooming Pink Lotus Seat */}
          <path d="M100 115C90 135 75 160 100 178C125 160 110 135 100 115Z" fill="#f43f5e" />
          <path d="M100 130C75 142 50 165 75 178C92 172 100 152 100 130Z" fill="#fb7185" />
          <path d="M100 130C125 142 150 165 125 178C108 172 100 152 100 130Z" fill="#fb7185" />
          <path d="M100 145C60 155 35 175 60 185C85 180 100 165 100 145Z" fill="#fda4af" />
          <path d="M100 145C140 155 165 175 140 185C115 180 100 165 100 145Z" fill="#fda4af" />
        </svg>
      );

    case 'ganesh-diya-aarti':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm आरती Glow */}
          <circle cx="100" cy="90" r="75" fill="url(#aarti-glow)" opacity="0.6" />
          {/* Ganesha Idol Silhouette */}
          <path d="M85 45L100 22L115 45H85Z" fill="#78350f" />
          <path d="M72 65C50 60 40 82 48 102C56 115 72 108 76 98" stroke="#78350f" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M128 65C150 60 160 82 152 102C144 115 128 108 124 98" stroke="#78350f" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M100 75C96 95 90 120 108 128C118 132 126 126 126 116" stroke="#78350f" strokeWidth="6.5" strokeLinecap="round" />
          <circle cx="100" cy="62" r="3" fill="#dc2626" />
          {/* Glowing Aarti Thali & Brass Lamps */}
          <ellipse cx="100" cy="165" rx="65" ry="12" fill="#d97706" stroke="#fef08a" strokeWidth="2" />
          {/* Left Diya */}
          <path d="M45 155C45 145 55 145 55 155C58 162 42 162 45 155Z" fill="#f59e0b" />
          <path d="M50 142C50 142 54 148 54 152C54 155 52 157 50 157C48 157 46 155 46 152C46 148 50 142 50 142Z" fill="#fef08a" />
          {/* Center Diya */}
          <path d="M95 152C95 142 105 142 105 152C108 160 92 160 95 152Z" fill="#f59e0b" />
          <path d="M100 138C100 138 105 145 105 149C105 153 103 155 100 155C97 155 95 153 95 149C95 145 100 138 100 138Z" fill="#fef08a" />
          {/* Right Diya */}
          <path d="M145 155C145 145 155 145 155 155C158 162 142 162 145 155Z" fill="#f59e0b" />
          <path d="M150 142C150 142 154 148 154 152C154 155 152 157 150 157C148 157 146 155 146 152C146 148 150 142 150 142Z" fill="#fef08a" />
          {/* Aarti Incense Smoke */}
          <path d="M90 130C85 115 95 105 90 90" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" strokeLinecap="round" />
          <path d="M110 130C115 115 105 105 110 90" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" strokeLinecap="round" />
          <defs>
            <radialGradient id="aarti-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'ganesh-trishul-tilak':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Divine Third-Eye Halo */}
          <circle cx="100" cy="100" r="75" fill="url(#trishul-halo)" opacity="0.5" />
          {/* Forehead Golden Brow Structure */}
          <path d="M60 70Q100 85 140 70" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          {/* Chandrakor Crescent */}
          <path d="M80 82C90 94 110 94 120 82C112 90 88 90 80 82Z" fill="#dc2626" />
          {/* Bold Sacred Trishul Tilak */}
          <path d="M100 45V105" stroke="#b91c1c" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 60C88 75 100 80 100 80C100 80 112 75 112 60" stroke="#b91c1c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="100" cy="38" r="5" fill="#fde047" stroke="#b91c1c" strokeWidth="2" />
          {/* Yellow Sandalwood Lines */}
          <line x1="75" y1="75" x2="125" y2="75" stroke="#fef08a" strokeWidth="3" opacity="0.8" />
          {/* Lower Trunk Arch */}
          <path d="M100 110C95 130 90 152 110 160C122 165 132 158 132 146" stroke="#ea580c" strokeWidth="7" strokeLinecap="round" />
          <defs>
            <radialGradient id="trishul-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'ganesh-marigold-toran':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Festive Garland Arch (Zendu Toran) */}
          {[25, 45, 65, 85, 105, 125, 145, 165, 185].map((x, i) => {
            const y = 30 + 15 * Math.sin((i / 8) * Math.PI);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="10" fill={i % 2 === 0 ? '#f59e0b' : '#ea580c'} stroke="#fef08a" strokeWidth="1" />
                <circle cx={x} cy={y} r="5" fill={i % 2 === 0 ? '#ea580c' : '#f59e0b'} />
                {/* Mango Leaf */}
                {i % 2 === 0 && (
                  <path d={`M${x} ${y + 8}C${x - 4} ${y + 22} ${x} ${y + 28} ${x} ${y + 28}C${x} ${y + 28} ${x + 4} ${y + 22} ${x} ${y + 8}Z`} fill="#15803d" />
                )}
              </g>
            );
          })}
          {/* Ganesha in Center */}
          <circle cx="100" cy="115" r="50" fill="#fef3c7" opacity="0.6" />
          <path d="M85 85L100 62L115 85H85Z" fill="#f59e0b" />
          <circle cx="100" cy="72" r="3" fill="#dc2626" />
          <path d="M76 100C58 95 48 112 55 128" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
          <path d="M124 100C142 95 152 112 145 128" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="98" r="3" fill="#dc2626" />
          <path d="M100 108C96 122 92 140 106 146C114 150 122 145 122 136" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'ganesh-modak-bhog':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Divine Gold Aura */}
          <circle cx="100" cy="95" r="75" fill="url(#modak-glow)" opacity="0.45" />
          {/* Ganesha Head & Mukut */}
          <polygon points="100,20 82,50 118,50" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="100" cy="32" r="3.5" fill="#dc2626" />
          <path d="M72 68C52 62 40 85 48 105" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M128 68C148 62 160 85 152 105" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M100 78C95 98 90 120 108 128" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
          {/* Golden Thal / Plate of Ukdiche Modak */}
          <ellipse cx="100" cy="160" rx="60" ry="12" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
          {/* Main Giant Modak */}
          <path d="M100 128C90 142 85 155 100 162C115 155 110 142 100 128Z" fill="#ffedd5" stroke="#ea580c" strokeWidth="2" />
          {/* Modak Folds (Kalyan) */}
          <path d="M100 128V162" stroke="#ea580c" strokeWidth="1.5" />
          <path d="M96 134C94 144 94 154 97 160" stroke="#ea580c" strokeWidth="1.5" />
          <path d="M104 134C106 144 106 154 103 160" stroke="#ea580c" strokeWidth="1.5" />
          {/* Side Modaks */}
          <path d="M68 145C62 152 60 160 70 164C80 160 76 152 68 145Z" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
          <path d="M132 145C126 152 124 160 134 164C144 160 140 152 132 145Z" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
          {/* Saffron (Kesar) Strands */}
          <line x1="100" y1="130" x2="100" y2="136" stroke="#dc2626" strokeWidth="2" />
          <defs>
            <radialGradient id="modak-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'ganesh-temple-arch':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Peshwai Temple Meghadambari Pillar & Arch */}
          <path d="M30 180V90C30 50 60 30 100 30C140 30 170 50 170 90V180" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M42 180V95C42 62 68 45 100 45C132 45 158 62 158 95V180" stroke="#fef08a" strokeWidth="2" strokeDasharray="5 3" />
          <polygon points="100,15 85,32 115,32" fill="#dc2626" />
          {/* Hanging Brass Bells */}
          <g transform="translate(48, 65)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#fde047" strokeWidth="2" />
            <path d="M-6 18H6L8 28H-8L-6 18Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <circle cx="0" cy="30" r="2.5" fill="#fde047" />
          </g>
          <g transform="translate(152, 65)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#fde047" strokeWidth="2" />
            <path d="M-6 18H6L8 28H-8L-6 18Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <circle cx="0" cy="30" r="2.5" fill="#fde047" />
          </g>
          {/* Enshrined Ganesha */}
          <circle cx="100" cy="110" r="42" fill="#fef3c7" opacity="0.8" />
          <path d="M85 82L100 62L115 82H85Z" fill="#f59e0b" />
          <circle cx="100" cy="74" r="3" fill="#dc2626" />
          <path d="M78 98C60 92 52 108 58 122" stroke="#d97706" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M122 98C140 92 148 108 142 122" stroke="#d97706" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M100 102C96 118 92 135 106 142C114 146 122 140 122 132" stroke="#b45309" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );

    case 'ganesh-mandala-cosmic':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cosmic Mandala Halo */}
          <circle cx="100" cy="100" r="75" stroke="#fde047" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="62" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="100" cy="100" r="50" stroke="#fde047" strokeWidth="1" strokeDasharray="3 3" />
          {/* 12 Mandala Petals */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <path
              key={i}
              d={`M100 100 L${100 + 72 * Math.cos((deg * Math.PI) / 180)} ${100 + 72 * Math.sin((deg * Math.PI) / 180)}`}
              stroke="#fbbf24"
              strokeWidth="1.5"
              opacity="0.7"
            />
          ))}
          {/* Center Ganesha Form */}
          <circle cx="100" cy="100" r="38" fill="#450a0a" stroke="#f59e0b" strokeWidth="2" />
          <path d="M88 78L100 60L112 78H88Z" fill="#fde047" />
          <circle cx="100" cy="70" r="2.5" fill="#dc2626" />
          <path d="M82 92C70 88 62 100 68 112" stroke="#fde047" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M118 92C130 88 138 100 132 112" stroke="#fde047" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M100 95C98 108 94 122 106 128C112 130 118 126 118 120" stroke="#fde047" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );

    case 'ganesh-dhol-tasha-utsav':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Saffron Bhagwa Glow */}
          <circle cx="100" cy="95" r="75" fill="url(#dhol-glow)" opacity="0.6" />
          {/* Puneri Dhol Drums at bottom */}
          <ellipse cx="60" cy="150" rx="30" ry="12" fill="#78350f" stroke="#fde047" strokeWidth="2" />
          <path d="M30 150V165C30 172 45 178 60 178C75 178 90 172 90 165V150" fill="#9a3412" stroke="#fde047" strokeWidth="2" />
          {/* Dhol sticks (Tiparu) */}
          <line x1="45" y1="130" x2="60" y2="152" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="75" y1="130" x2="62" y2="152" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
          {/* Saffron Bhagwa Zenda Flag waving */}
          <path d="M140 180V100L175 115L140 135" fill="#ea580c" stroke="#fde047" strokeWidth="2" />
          {/* Ganesha in Procession */}
          <circle cx="100" cy="75" r="42" fill="#fff7ed" opacity="0.9" />
          <polygon points="100,32 85,55 115,55" fill="#f59e0b" />
          <circle cx="100" cy="45" r="3" fill="#dc2626" />
          <path d="M78 72C62 68 55 82 60 95" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M122 72C138 68 145 82 140 95" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M100 78C96 92 92 108 104 114" stroke="#c2410c" strokeWidth="5.5" strokeLinecap="round" />
          <defs>
            <radialGradient id="dhol-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'ganesh-peacock-feather':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Divine Morpankh Crown */}
          <g transform="translate(100, 35)">
            {/* Outer Feather Fluff */}
            <path d="M0 0C-15 -25 0 -45 0 -45C0 -45 15 -25 0 0Z" fill="#047857" stroke="#10b981" strokeWidth="1" />
            {/* Turquoise Ring */}
            <circle cx="0" cy="-25" r="10" fill="#06b6d4" />
            {/* Royal Blue Eye */}
            <circle cx="0" cy="-25" r="6" fill="#1d4ed8" />
            {/* Gold Core */}
            <circle cx="0" cy="-25" r="2.5" fill="#fde047" />
          </g>
          {/* Gold Mukut */}
          <path d="M80 50L100 28L120 50H80Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          {/* Ganesha Face with Jewel Highlights */}
          <path d="M72 70C50 65 38 85 46 108" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M128 70C150 65 162 85 154 108" stroke="#0284c7" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="100" cy="62" r="3" fill="#059669" />
          <path d="M100 78C95 100 90 125 108 135C118 140 126 134 126 124" stroke="#0369a1" strokeWidth="6.5" strokeLinecap="round" />
          {/* Lotus Base */}
          <path d="M55 160C80 148 120 148 145 160C135 174 65 174 55 160Z" fill="#047857" />
        </svg>
      );

    case 'ganesh-swastik-manglik':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Manglik Swastik Core */}
          <circle cx="100" cy="100" r="75" fill="#fff1f2" opacity="0.8" />
          {/* Auspicious Red Swastik */}
          <g stroke="#dc2626" strokeWidth="5" strokeLinecap="round">
            <line x1="100" y1="50" x2="100" y2="150" />
            <line x1="50" y1="100" x2="150" y2="100" />
            <line x1="100" y1="50" x2="135" y2="50" />
            <line x1="100" y1="150" x2="65" y2="150" />
            <line x1="50" y1="100" x2="50" y2="65" />
            <line x1="150" y1="100" x2="150" y2="135" />
          </g>
          {/* 4 Sacred Bindus */}
          <circle cx="75" cy="75" r="4.5" fill="#dc2626" />
          <circle cx="125" cy="75" r="4.5" fill="#dc2626" />
          <circle cx="75" cy="125" r="4.5" fill="#dc2626" />
          <circle cx="125" cy="125" r="4.5" fill="#dc2626" />
          {/* Golden Ganesha Lineart Superimposed */}
          <path d="M100 68C92 88 88 110 105 118C112 122 118 116 118 108" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
          <polygon points="100,52 92,68 108,68" fill="#f59e0b" />
        </svg>
      );

    case 'ganesh-silver-chhatra':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Silver Royal Chhatra (Umbrella) */}
          <path d="M40 58C40 30 160 30 160 58H40Z" fill="url(#silver-grad)" stroke="#cbd5e1" strokeWidth="2" />
          <polygon points="100,12 92,30 108,30" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Hanging Pearl Drops */}
          {[48, 68, 88, 100, 112, 132, 152].map((px, i) => (
            <g key={i}>
              <line x1={px} y1="58" x2={px} y2="68" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx={px} cy="71" r="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            </g>
          ))}
          {/* Lord Ganesha under the Chhatra */}
          <circle cx="100" cy="120" r="48" fill="#f8fafc" opacity="0.9" />
          <path d="M85 92L100 72L115 92H85Z" fill="#94a3b8" />
          <circle cx="100" cy="82" r="3" fill="#dc2626" />
          <path d="M78 108C60 102 52 120 58 135" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
          <path d="M122 108C140 102 148 120 142 135" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 114C96 130 92 148 106 155C114 158 122 152 122 144" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          <defs>
            <linearGradient id="silver-grad" x1="40" y1="30" x2="160" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'ganesh-panchamrut-abhishek':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sacred Kalash Pouring Panchamrut */}
          <g transform="translate(100, 30)">
            <ellipse cx="0" cy="0" rx="18" ry="6" fill="#fde047" />
            <path d="M-15 0C-20 20 20 20 15 0Z" fill="#d97706" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Stream of Divine Milk / Panchamrut */}
            <path d="M0 10C-4 25 4 45 0 60" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          </g>
          {/* Ganesha Receiving Sacred Abhishek */}
          <circle cx="100" cy="120" r="50" fill="#fff7ed" opacity="0.85" />
          <path d="M85 92L100 70L115 92H85Z" fill="#f59e0b" />
          <circle cx="100" cy="80" r="3" fill="#dc2626" />
          <path d="M76 108C58 102 48 120 56 135" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
          <path d="M124 108C142 102 152 120 144 135" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 114C96 130 92 148 106 155" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
          {/* Base Silver Thali */}
          <ellipse cx="100" cy="172" rx="65" ry="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      );

    case 'ganesh-siddhivinayak':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Prabhadevi Siddhivinayak Gold Halo */}
          <circle cx="100" cy="95" r="75" fill="url(#siddhi-glow)" opacity="0.5" />
          {/* Classic Mukut with Golden Chhatra */}
          <polygon points="100,18 78,52 122,52" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          <circle cx="100" cy="28" r="4" fill="#dc2626" />
          {/* Left and Right Broad Golden Ears */}
          <path d="M72 68C48 62 35 85 45 108" stroke="#ea580c" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M128 68C152 62 165 85 155 108" stroke="#ea580c" strokeWidth="6.5" strokeLinecap="round" />
          {/* Tilak */}
          <path d="M90 68Q100 78 110 68" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="62" r="3" fill="#fde047" />
          {/* Right-Turned Trunk (उजव्या सोंडेचा गणपती — सिद्धिविनायक) */}
          <path d="M100 78C105 105 112 130 92 142C80 148 68 140 68 126C68 116 80 114 84 122" stroke="#c2410c" strokeWidth="8" strokeLinecap="round" />
          {/* Modak on Right Trunk Tip */}
          <circle cx="60" cy="126" r="7" fill="#fde047" stroke="#b45309" strokeWidth="2" />
          <defs>
            <radialGradient id="siddhi-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'ganesh-minimalist-silhouette':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Backlit Ambient Ring */}
          <circle cx="100" cy="100" r="72" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
          {/* Minimalist Pure White Stroke */}
          <path
            d="M80 60C100 40 120 40 130 65C138 85 120 100 108 115C98 128 98 145 115 150C128 152 136 142 134 132"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Minimal Ear Curve */}
          <path d="M80 72C60 75 48 95 56 115" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Red Tilak Dot */}
          <circle cx="100" cy="72" r="4.5" fill="#f43f5e" />
        </svg>
      );

    case 'ganesh-shree-calligraphy':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Saffron Aura */}
          <circle cx="100" cy="100" r="75" fill="#fff7ed" opacity="0.9" />
          {/* Calligraphic 'श्री' & Ganesha Trunk Form */}
          <path
            d="M75 50Q125 45 120 75Q115 105 85 110Q120 120 135 155"
            stroke="#ea580c"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M120 75Q150 75 145 110Q135 145 110 152" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Calligraphic Top Matra */}
          <path d="M60 48H140" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
          {/* Tilak & Modak */}
          <circle cx="100" cy="78" r="5" fill="#dc2626" />
          <circle cx="138" cy="155" r="7" fill="#fde047" stroke="#ea580c" strokeWidth="2" />
        </svg>
      );

    case 'ganesh-ashtavinayak-divine':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ashtavinayak 8 Temple Lights Circle */}
          <circle cx="100" cy="100" r="75" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const bx = 100 + 72 * Math.cos(rad);
            const by = 100 + 72 * Math.sin(rad);
            return (
              <circle key={i} cx={bx} cy={by} r="5" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
            );
          })}
          {/* Central Ashtavinayak Swaroop */}
          <circle cx="100" cy="100" r="48" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="100,58 88,78 112,78" fill="#f59e0b" />
          <circle cx="100" cy="70" r="3" fill="#dc2626" />
          <path d="M80 92C65 88 58 102 65 115" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M120 92C135 88 142 102 135 115" stroke="#ea580c" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M100 98C96 112 92 128 106 135" stroke="#c2410c" strokeWidth="5.5" strokeLinecap="round" />
        </svg>
      );

    case 'sale-discount':
    case 'business-growth':
    default:
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dynamic 3D Tag / Rocket */}
          <circle cx="100" cy="100" r="70" fill="url(#sale-glow)" opacity="0.25" />
          {/* Retail Tag */}
          <path d="M55 75L105 25H165V85L115 135L55 75Z" fill="url(#tag-grad)" stroke="#fde047" strokeWidth="3" />
          <circle cx="140" cy="50" r="8" fill="#ffffff" stroke="#b91c1c" strokeWidth="3" />
          {/* % Symbol */}
          <text x="100" y="92" fill="#ffffff" fontSize="28" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">%</text>
          {/* Star Sparkles */}
          <path d="M40 120L44 132L56 136L44 140L40 152L36 140L24 136L36 132Z" fill="#fbbf24" />
          <path d="M150 130L153 140L163 143L153 146L150 156L147 146L137 143L147 140Z" fill="#fbbf24" />
          <defs>
            <radialGradient id="sale-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="tag-grad" x1="55" y1="25" x2="165" y2="135" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
