/**
 * Comprehensive Vector SVG motif generator for Canvas & Web rendering.
 * Contains clean vector paths for all Marathi festival, deity, business, and auspicious motifs.
 */

export function getMotifSvgXml(
  type: string = 'ganesh-murti',
  primaryColor: string = '#f59e0b',
  accentColor: string = '#ef4444'
): string {
  const norm = (type || '').toLowerCase().trim();

  // 1. Night & Good Night Motifs (Crescent Moon, Clouds, Galaxy, Candle, etc.)
  if (norm.includes('night-crescent-clouds') || (norm.includes('crescent') && norm.includes('cloud')) || norm.includes('sweet-dreams')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nc-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="nc-crescent" x1="70" y1="50" x2="142" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="50%" stop-color="#fde047"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <linearGradient id="nc-cloud" x1="50" y1="100" x2="150" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#312e81" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <!-- Soft Moonlight Aura -->
      <circle cx="100" cy="85" r="65" fill="url(#nc-glow)"/>
      <!-- Glowing Crescent Moon -->
      <path d="M115 50C90 50 70 70 70 95C70 120 90 140 115 140C125 140 134 136 142 130C120 128 102 110 102 88C102 68 116 52 135 52C128 50 122 50 115 50Z" fill="url(#nc-crescent)"/>
      <!-- Dreamy Cloud drifting in front -->
      <path d="M50 135C50 122 62 112 75 112C78 102 88 95 100 95C114 95 125 105 127 118C138 118 147 126 147 137C147 148 138 155 127 155H60C50 155 50 145 50 135Z" fill="url(#nc-cloud)" stroke="#818cf8" stroke-width="2.5"/>
      <!-- Sparkling Stars -->
      <path d="M145 55L147 62L154 64L147 66L145 73L143 66L136 64L143 62Z" fill="#fef08a"/>
      <path d="M55 75L56 80L61 81L56 82L55 87L54 82L49 81L54 80Z" fill="#fef08a"/>
      <path d="M152 100L153 103L156 104L153 105L152 108L151 105L148 104L151 103Z" fill="#ffffff"/>
      <circle cx="160" cy="115" r="3" fill="#ffffff"/>
      <circle cx="42" cy="115" r="2.5" fill="#fef08a"/>
      <circle cx="85" cy="50" r="2" fill="#e0e7ff"/>
    </svg>`;
  }

  if (norm.includes('night-full-moon-lake') || norm.includes('full-moon')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fm-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#fde047" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="75" r="60" fill="url(#fm-glow)"/>
      <circle cx="100" cy="75" r="42" fill="#fef9c3" stroke="#fde047" stroke-width="2"/>
      <circle cx="85" cy="65" r="6" fill="#fef08a" opacity="0.6"/>
      <circle cx="112" cy="80" r="8" fill="#fef08a" opacity="0.5"/>
      <circle cx="95" cy="92" r="5" fill="#fef08a" opacity="0.5"/>
      <!-- Lake reflection waves -->
      <path d="M30 145H170M50 155H150M70 165H130M85 175H115" stroke="#93c5fd" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <!-- Starry sky -->
      <circle cx="35" cy="50" r="2" fill="#ffffff"/>
      <circle cx="165" cy="45" r="2.5" fill="#ffffff"/>
      <circle cx="150" cy="85" r="1.5" fill="#fef08a"/>
    </svg>`;
  }

  if (norm.includes('night-starry-galaxy') || norm.includes('galaxy') || norm.includes('stars')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="75" ry="32" transform="rotate(-30 100 100)" stroke="#a855f7" stroke-width="3" opacity="0.7"/>
      <ellipse cx="100" cy="100" rx="55" ry="22" transform="rotate(-30 100 100)" stroke="#c084fc" stroke-width="2.5"/>
      <circle cx="100" cy="100" r="18" fill="#fef08a"/>
      <circle cx="100" cy="100" r="28" fill="#ec4899" opacity="0.35"/>
      <!-- Twinkling stars -->
      <path d="M50 50L53 58L61 60L53 62L50 70L47 62L39 60L47 58Z" fill="#ffffff"/>
      <path d="M150 140L152 146L158 147L152 149L150 155L148 149L142 147L148 146Z" fill="#fef08a"/>
      <circle cx="140" cy="60" r="3" fill="#ffffff"/>
      <circle cx="60" cy="150" r="2" fill="#ffffff"/>
    </svg>`;
  }

  if (norm.includes('night-candle-lamp') || norm.includes('candle') || norm.includes('lamp')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cl-glow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#ea580c" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="65" r="50" fill="url(#cl-glow)"/>
      <!-- Flame -->
      <path d="M100 35C100 35 110 55 110 68C110 76 105 82 100 82C95 82 90 76 90 68C90 55 100 35 100 35Z" fill="#fef08a" stroke="#ea580c" stroke-width="2"/>
      <path d="M100 50C100 50 105 60 105 68C105 72 102 76 100 76C98 76 95 72 95 68C95 60 100 50 100 50Z" fill="#ffffff"/>
      <line x1="100" y1="82" x2="100" y2="92" stroke="#451a03" stroke-width="3" stroke-linecap="round"/>
      <!-- Candle Cylinder -->
      <rect x="75" y="92" width="50" height="75" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Wax drip -->
      <path d="M88 92V115C88 118 92 118 92 115V92" fill="#e2e8f0"/>
      <!-- Candle Holder Base -->
      <ellipse cx="100" cy="168" rx="42" ry="12" fill="#ca8a04"/>
    </svg>`;
  }

  if (norm.includes('night-city-skyline') || norm.includes('skyline') || norm.includes('city')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="55" r="26" fill="#fef08a" opacity="0.9"/>
      <!-- Buildings -->
      <rect x="30" y="85" width="30" height="85" fill="#1e1b4b" stroke="#312e81" stroke-width="1.5"/>
      <rect x="65" y="60" width="35" height="110" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <rect x="105" y="95" width="28" height="75" fill="#1e1b4b" stroke="#312e81" stroke-width="1.5"/>
      <rect x="138" y="75" width="32" height="95" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <!-- Lit windows -->
      <rect x="72" y="70" width="6" height="8" fill="#fde047"/>
      <rect x="85" y="70" width="6" height="8" fill="#fde047"/>
      <rect x="72" y="90" width="6" height="8" fill="#fde047"/>
      <rect x="85" y="110" width="6" height="8" fill="#fde047"/>
      <rect x="145" y="90" width="6" height="8" fill="#fde047"/>
      <rect x="145" y="115" width="6" height="8" fill="#fde047"/>
      <rect x="38" y="105" width="5" height="7" fill="#fde047"/>
    </svg>`;
  }

  if (norm.includes('night-dream-catcher') || norm.includes('dream-catcher')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="80" r="45" stroke="#c084fc" stroke-width="4"/>
      <circle cx="100" cy="80" r="30" stroke="#fde047" stroke-width="2" stroke-dasharray="6 4"/>
      <circle cx="100" cy="80" r="12" stroke="#e879f9" stroke-width="2"/>
      <circle cx="100" cy="80" r="4" fill="#fef08a"/>
      <!-- Feathers -->
      <path d="M100 125V170M100 170C95 155 105 145 100 135M100 170C105 155 95 145 100 135" stroke="#c084fc" stroke-width="3" stroke-linecap="round"/>
      <path d="M75 115V155M75 155C70 145 80 135 75 125" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M125 115V155M125 155C120 145 130 135 125 125" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Hanging Beads -->
      <circle cx="75" cy="120" r="3" fill="#fde047"/>
      <circle cx="100" cy="130" r="4" fill="#fde047"/>
      <circle cx="125" cy="120" r="3" fill="#fde047"/>
    </svg>`;
  }

  if (norm.includes('night-moon-silhouette') || norm.includes('night-aurora') || norm.includes('night')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="90" r="55" fill="#fef08a" opacity="0.3"/>
      <path d="M110 45C85 45 65 68 65 95C65 122 85 145 110 145C120 145 129 141 137 135C115 132 98 112 98 88C98 66 112 48 132 47C125 45 118 45 110 45Z" fill="#fef08a"/>
      <path d="M135 50L137 56L143 58L137 60L135 66L133 60L127 58L133 56Z" fill="#ffffff"/>
      <circle cx="50" cy="110" r="2.5" fill="#ffffff"/>
      <circle cx="155" cy="105" r="2.5" fill="#ffffff"/>
      <circle cx="70" cy="60" r="2" fill="#fde047"/>
    </svg>`;
  }

  // 2. Ganesh Motifs (Lord Ganesha / Bappa)
  if (norm.includes('ganesh') || norm.includes('dagdusheth') || norm.includes('lalbaug') || norm.includes('bappa') || norm.includes('modak') || norm.includes('ashtavinayak') || norm.includes('siddhivinayak')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="g-gold" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="95" r="75" fill="url(#g-halo)"/>
      <circle cx="100" cy="95" r="72" stroke="#fde047" stroke-width="2" stroke-dasharray="6 4" opacity="0.8"/>
      <!-- Crown Mukut -->
      <path d="M80 48L100 20L120 48L112 58L88 58Z" fill="url(#g-gold)"/>
      <circle cx="100" cy="35" r="4" fill="#dc2626"/>
      <!-- Ears & Face -->
      <path d="M70 70C50 65 35 85 45 105C55 120 75 110 80 98" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
      <path d="M130 70C150 65 165 85 155 105C145 120 125 110 120 98" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
      <!-- Tilak Trishul -->
      <path d="M92 65H108M90 70H110M94 75H106" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="100" cy="62" r="3" fill="#dc2626"/>
      <line x1="100" y1="58" x2="100" y2="78" stroke="#eab308" stroke-width="2"/>
      <!-- Trunk Sond -->
      <path d="M100 78C95 100 90 125 105 135C115 142 125 138 126 128C126 120 118 116 114 122" stroke="#f59e0b" stroke-width="7" stroke-linecap="round"/>
      <!-- Modak -->
      <path d="M138 122C138 122 148 115 152 125C154 132 144 138 138 134Z" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
      <!-- Lotus Base -->
      <path d="M60 160C80 150 120 150 140 160C130 172 70 172 60 160Z" fill="#e11d48" opacity="0.9"/>
    </svg>`;
  }

  // 3. Diya / Deepavali Motifs
  if (norm.includes('diya') || norm.includes('diwali') || norm.includes('deep') || norm.includes('lighting')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="d-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="d-flame" x1="100" y1="25" x2="100" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#dc2626"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="80" r="45" fill="url(#d-glow)" opacity="0.6"/>
      <path d="M100 25C100 25 118 65 118 85C118 100 110 108 100 108C90 108 82 100 82 85C82 65 100 25 100 25Z" fill="url(#d-flame)"/>
      <path d="M100 45C100 45 110 70 110 85C110 94 105 100 100 100C95 100 90 94 90 85C90 70 100 45 100 45Z" fill="#ffedd5"/>
      <path d="M40 105C45 138 75 160 100 160C125 160 155 138 160 105C160 105 135 118 100 118C65 118 40 105 40 105Z" fill="#b45309"/>
      <path d="M45 108C60 120 140 120 155 108" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="70" cy="128" r="4" fill="#fef08a"/>
      <circle cx="100" cy="135" r="5" fill="#fef08a"/>
      <circle cx="130" cy="128" r="4" fill="#fef08a"/>
      <path d="M45 45L48 55L58 58L48 61L45 71L42 61L32 58L42 55Z" fill="#fde047" opacity="0.8"/>
      <path d="M155 45L158 55L168 58L158 61L155 71L152 61L142 58L152 55Z" fill="#fde047" opacity="0.8"/>
    </svg>`;
  }

  // 4. Shiva / Mahadev Trishul Motifs
  if (norm.includes('shiva') || norm.includes('trishul') || norm.includes('mahadev') || norm.includes('shivratri')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="#0284c7" opacity="0.15"/>
      <path d="M125 35C115 35 105 45 105 60C105 75 118 85 132 82C120 80 115 70 115 60C115 48 122 40 125 35Z" fill="#e0f2fe" opacity="0.9"/>
      <path d="M100 25V175" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round"/>
      <path d="M70 45C70 75 90 90 100 90C110 90 130 75 130 45" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round"/>
      <path d="M68 45L64 35L76 40Z" fill="${primaryColor}"/>
      <path d="M132 45L136 35L124 40Z" fill="${primaryColor}"/>
      <path d="M100 25L94 15L106 15Z" fill="${primaryColor}"/>
      <path d="M85 105L115 125H85L115 105H85Z" fill="#b45309" stroke="#fde047" stroke-width="2"/>
      <circle cx="100" cy="115" r="3" fill="#fde047"/>
    </svg>`;
  }

  // 5. Krishna / Flute Motifs
  if (norm.includes('krishna') || norm.includes('flute') || norm.includes('janmashtami') || norm.includes('bansuri') || norm.includes('peacock')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M120 40C150 20 170 50 150 80C135 100 115 110 115 110" stroke="#059669" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="140" cy="55" rx="18" ry="24" transform="rotate(30 140 55)" fill="#0284c7"/>
      <ellipse cx="140" cy="55" rx="10" ry="14" transform="rotate(30 140 55)" fill="#0f172a"/>
      <circle cx="140" cy="55" r="5" fill="#eab308"/>
      <rect x="35" y="115" width="130" height="14" rx="7" transform="rotate(-25 35 115)" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="85" cy="98" r="3" fill="#451a03"/>
      <circle cx="105" cy="89" r="3" fill="#451a03"/>
      <circle cx="125" cy="80" r="3" fill="#451a03"/>
      <circle cx="145" cy="71" r="3" fill="#451a03"/>
    </svg>`;
  }

  // 6. Shivaji Maharaj / Saffron Flag Motifs
  if (norm.includes('shivaji') || norm.includes('maratha') || norm.includes('saffron') || norm.includes('bhagwa')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="#f97316" opacity="0.2"/>
      <!-- Saffron Double Swallowing Tail Flag Zenda -->
      <path d="M50 30V175" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
      <path d="M54 35L160 70L125 90L160 110L54 135Z" fill="#ea580c" stroke="#fde047" stroke-width="2.5"/>
      <circle cx="100" cy="75" r="14" fill="#fde047" opacity="0.9"/>
      <circle cx="50" cy="30" r="6" fill="#fde047"/>
    </svg>`;
  }

  // 7. Tiranga / Independence / Republic Motifs
  if (norm.includes('flag') || norm.includes('independence') || norm.includes('republic') || norm.includes('chakra')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#1e3a8a" opacity="0.1"/>
      <path d="M30 65C60 50 140 80 170 65C170 85 140 100 170 120L30 120Z" fill="#ff9933" opacity="0.9"/>
      <rect x="25" y="85" width="150" height="30" fill="#ffffff"/>
      <path d="M30 115C60 100 140 130 170 115C170 135 140 150 170 170L30 170Z" fill="#138808" opacity="0.9"/>
      <circle cx="100" cy="100" r="14" stroke="#000080" stroke-width="2" fill="#ffffff"/>
      <circle cx="100" cy="100" r="2.5" fill="#000080"/>
    </svg>`;
  }

  // 8. Garba / Dandiya / Navratri Motifs
  if (norm.includes('garba') || norm.includes('navratri') || norm.includes('dandiya')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="#ec4899" opacity="0.25"/>
      <rect x="45" y="150" width="130" height="12" rx="6" transform="rotate(-45 45 150)" fill="#ec4899" stroke="#fef08a" stroke-width="2"/>
      <rect x="55" y="55" width="130" height="12" rx="6" transform="rotate(45 55 55)" fill="#06b6d4" stroke="#fef08a" stroke-width="2"/>
      <circle cx="65" cy="140" r="7" fill="#fde047"/>
      <circle cx="135" cy="140" r="7" fill="#fde047"/>
    </svg>`;
  }

  // 9. Morning Sun / Good Morning / Nature Motifs
  if (norm.includes('morning-tea') || norm.includes('morning-coffee') || norm.includes('tea') || norm.includes('coffee')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="tea-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#tea-glow)"/>
      <!-- Steam -->
      <path d="M85 55Q92 40 85 28M100 52Q108 35 100 24M115 55Q122 40 115 28" stroke="#fde047" stroke-width="3" stroke-linecap="round"/>
      <!-- Cup Body -->
      <path d="M55 75H145L135 140C135 152 120 160 100 160C80 160 65 152 65 140L55 75Z" fill="#b45309" stroke="#fef08a" stroke-width="3"/>
      <!-- Cup Handle -->
      <path d="M142 88H158C168 88 172 98 172 108C172 120 162 128 138 126" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
      <!-- Saucer plate -->
      <ellipse cx="100" cy="165" rx="55" ry="10" fill="#78350f" stroke="#fde047" stroke-width="2.5"/>
    </svg>`;
  }

  if (norm.includes('morning') || norm.includes('sun') || norm.includes('mountain') || norm.includes('peaks')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="105" r="46" fill="#f59e0b"/>
      <path d="M15 175L75 95L120 150L150 115L185 175H15Z" fill="#0f766e"/>
      <path d="M75 95L60 120L75 125L90 120Z" fill="#fde047" opacity="0.6"/>
      <path d="M45 55Q52 46 60 55Q68 46 75 55" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M130 45Q136 38 142 45Q148 38 155 45" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  // 10. Business & Promotional Motifs
  if (norm.includes('business') || norm.includes('growth') || norm.includes('sale') || norm.includes('discount')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="#0284c7" opacity="0.2"/>
      <rect x="40" y="110" width="22" height="50" rx="3" fill="#0ea5e9"/>
      <rect x="72" y="90" width="22" height="70" rx="3" fill="#38bdf8"/>
      <rect x="104" y="65" width="22" height="95" rx="3" fill="#0284c7"/>
      <rect x="136" y="40" width="22" height="120" rx="3" fill="#f59e0b"/>
      <path d="M35 105L70 75L105 50L155 25" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
      <path d="M155 25L138 25M155 25L155 42" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  // 10. Real Estate / Housing / Architecture Motifs (Villa, Roof, Skyline, Key)
  if (
    norm.includes('real-estate') ||
    norm.includes('house') ||
    norm.includes('home') ||
    norm.includes('property') ||
    norm.includes('plot') ||
    norm.includes('flat') ||
    norm.includes('villa') ||
    norm.includes('builder') ||
    norm.includes('architect')
  ) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="reh-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="75" fill="url(#reh-glow)"/>
      <!-- Modern Architectural Skyline & Villa -->
      <rect x="40" y="70" width="40" height="100" fill="#0284c7" opacity="0.8" rx="4"/>
      <rect x="90" y="50" width="45" height="120" fill="#0369a1" rx="4"/>
      <rect x="145" y="90" width="30" height="80" fill="#38bdf8" opacity="0.85" rx="4"/>
      <!-- House Roof Accent Line -->
      <path d="M30 110L100 40L170 110" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
      <!-- Windows -->
      <rect x="100" y="70" width="10" height="10" fill="#fef08a" rx="1"/>
      <rect x="115" y="70" width="10" height="10" fill="#fef08a" rx="1"/>
      <rect x="100" y="90" width="10" height="10" fill="#fef08a" rx="1"/>
      <rect x="115" y="90" width="10" height="10" fill="#fef08a" rx="1"/>
      <!-- Key with Ribbon -->
      <circle cx="150" cy="55" r="12" stroke="#f59e0b" stroke-width="3.5" fill="#ffffff"/>
      <path d="M158 63L175 80M170 75L176 69M165 70L171 64" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;
  }

  // 11. Jewelry / Gold / Diamond Motifs
  if (norm.includes('jewelry') || norm.includes('gold') || norm.includes('diamond') || norm.includes('jewel') || norm.includes('necklace')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jewel-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="jewel-gold" x1="60" y1="70" x2="140" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="jewel-facet" x1="75" y1="65" x2="125" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#jewel-glow)"/>
      <path d="M60 70C80 50 120 50 140 70C155 110 120 150 100 160C80 150 45 110 60 70Z" stroke="url(#jewel-gold)" stroke-width="5"/>
      <path d="M100 65L125 90L100 125L75 90L100 65Z" fill="url(#jewel-facet)" stroke="#fef08a" stroke-width="2.5"/>
      <line x1="75" y1="90" x2="125" y2="90" stroke="#fef08a" stroke-width="2"/>
      <line x1="100" y1="65" x2="100" y2="125" stroke="#ffffff" stroke-width="2"/>
      <circle cx="65" cy="85" r="5" fill="#fde047" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="135" cy="85" r="5" fill="#fde047" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="80" cy="120" r="5" fill="#fde047" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="120" cy="120" r="5" fill="#fde047" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="100" cy="155" r="7" fill="#dc2626" stroke="#fde047" stroke-width="2"/>
    </svg>`;
  }

  // 12. Doctor / Medical / Healthcare Motifs
  if (norm.includes('doctor') || norm.includes('medical') || norm.includes('health') || norm.includes('hospital') || norm.includes('clinic')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#fee2e2" opacity="0.8"/>
      <!-- Red Cross -->
      <rect x="88" y="45" width="24" height="110" rx="6" fill="#ef4444"/>
      <rect x="45" y="88" width="110" height="24" rx="6" fill="#ef4444"/>
      <!-- Heart Beat Wave -->
      <path d="M35 140H75L85 115L95 165L105 125L115 140H165" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Stethoscope -->
      <path d="M60 60C60 90 90 90 90 90M140 60C140 90 110 90 110 90V110C110 130 130 130 130 130" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="130" cy="130" r="8" fill="#0284c7" stroke="#ffffff" stroke-width="2.5"/>
    </svg>`;
  }

  // 13. Restaurant / Food / Cafe Motifs
  if (norm.includes('restaurant') || norm.includes('food') || norm.includes('cafe') || norm.includes('dining') || norm.includes('hotel')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#fef3c7" opacity="0.8"/>
      <!-- Steam Lines -->
      <path d="M85 45C80 55 90 65 85 75" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M100 40C95 50 105 60 100 70" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M115 45C110 55 120 65 115 75" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Cloche Dome -->
      <path d="M40 130C40 85 160 85 160 130H40Z" fill="#b45309" stroke="#fef08a" stroke-width="3.5"/>
      <circle cx="100" cy="80" r="8" fill="#fde047" stroke="#b45309" stroke-width="2"/>
      <rect x="30" y="130" width="140" height="12" rx="6" fill="#78350f" stroke="#fef08a" stroke-width="2.5"/>
    </svg>`;
  }

  // 14. Education / Coaching / Books Motifs
  if (norm.includes('education') || norm.includes('coaching') || norm.includes('school') || norm.includes('book') || norm.includes('academy')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#eff6ff" opacity="0.9"/>
      <!-- Graduation Cap -->
      <polygon points="100,45 160,75 100,100 40,75" fill="#1e3a8a"/>
      <polygon points="100,100 145,82 145,115 100,135 55,115 55,82" fill="#1d4ed8"/>
      <path d="M150 78V125" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="150" cy="128" r="4.5" fill="#f59e0b"/>
      <!-- Open Book -->
      <path d="M50 145C70 135 100 140 100 155C100 140 130 135 150 145V170C130 160 100 165 100 175C100 165 70 160 50 170V145Z" fill="#fde047" stroke="#b45309" stroke-width="2.5"/>
    </svg>`;
  }

  // 15. Salon / Beauty / Spa Motifs
  if (norm.includes('salon') || norm.includes('beauty') || norm.includes('spa') || norm.includes('parlour') || norm.includes('makeup')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#fdf2f8" opacity="0.9"/>
      <!-- Scissors -->
      <circle cx="70" cy="140" r="14" stroke="#ec4899" stroke-width="4.5" fill="none"/>
      <circle cx="130" cy="140" r="14" stroke="#ec4899" stroke-width="4.5" fill="none"/>
      <line x1="80" y1="130" x2="140" y2="50" stroke="#db2777" stroke-width="5" stroke-linecap="round"/>
      <line x1="120" y1="130" x2="60" y2="50" stroke="#db2777" stroke-width="5" stroke-linecap="round"/>
      <circle cx="100" cy="90" r="5" fill="#fde047"/>
      <!-- Sparkles -->
      <path d="M140 45L143 55L153 58L143 61L140 71L137 61L127 58L137 55Z" fill="#f59e0b"/>
      <path d="M55 55L57 63L65 65L57 67L55 75L53 67L45 65L53 63Z" fill="#f59e0b"/>
    </svg>`;
  }

  // 16. Travel / Adventure Motifs
  if (norm.includes('travel') || norm.includes('tour') || norm.includes('trip') || norm.includes('tourism')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#f0f9ff" opacity="0.9"/>
      <!-- Globe Arc -->
      <circle cx="100" cy="100" r="58" stroke="#38bdf8" stroke-width="3" stroke-dasharray="8 6"/>
      <!-- Airplane -->
      <path d="M85 85L135 50L125 95L150 110L145 118L115 105L95 125L95 138L85 130L88 115L70 102L72 95L85 98Z" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
      <!-- Mountain Peak Base -->
      <polygon points="40,165 80,120 110,145 140,110 170,165" fill="#0284c7" opacity="0.75"/>
    </svg>`;
  }

  // 17. Kisan / Farmer / Agriculture Motifs
  if (norm.includes('kisan') || norm.includes('farmer') || norm.includes('agriculture') || norm.includes('crop') || norm.includes('shetkari')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#fefce8" opacity="0.9"/>
      <circle cx="100" cy="70" r="35" fill="#f59e0b" opacity="0.4"/>
      <!-- Wheat Stalks -->
      <path d="M100 170V60" stroke="#ca8a04" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M80 80C90 75 98 80 100 85C102 80 110 75 120 80" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
      <path d="M75 105C85 100 95 105 100 110C105 105 115 100 125 105" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
      <path d="M72 130C82 125 95 130 100 135C105 130 118 125 128 130" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
      <!-- Green Field furrow -->
      <path d="M30 160C60 145 140 145 170 160V175H30V160Z" fill="#15803d"/>
    </svg>`;
  }

  // 18. Birthday / Celebration / Cake Motifs
  if (norm.includes('birthday') || norm.includes('cake') || norm.includes('anniversary')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#fdf2f8" opacity="0.8"/>
      <!-- Cake Base -->
      <rect x="50" y="125" width="100" height="40" rx="8" fill="#f43f5e"/>
      <rect x="65" y="90" width="70" height="35" rx="6" fill="#fb7185"/>
      <!-- Frosting drips -->
      <path d="M50 125Q60 135 70 125Q80 135 90 125Q100 135 110 125Q120 135 130 125Q140 135 150 125" stroke="#ffffff" stroke-width="4" fill="none"/>
      <!-- Candles -->
      <rect x="80" y="65" width="6" height="25" fill="#fde047"/>
      <rect x="100" y="60" width="6" height="30" fill="#38bdf8"/>
      <rect x="120" y="65" width="6" height="25" fill="#fde047"/>
      <!-- Flames -->
      <path d="M83 50C83 50 88 56 83 62C78 56 83 50 83 50Z" fill="#f59e0b"/>
      <path d="M103 45C103 45 108 51 103 57C98 51 103 45 103 45Z" fill="#f59e0b"/>
      <path d="M123 50C123 50 128 56 123 62C118 56 123 50 123 50Z" fill="#f59e0b"/>
    </svg>`;
  }

  // 19. Rakhi / Raksha Bandhan Motifs
  if (norm.includes('rakhi') || norm.includes('raksha')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="#fef2f2" opacity="0.8"/>
      <!-- Thread -->
      <path d="M20 100H70M130 100H180" stroke="#dc2626" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="45" cy="100" r="4" fill="#fde047"/>
      <circle cx="155" cy="100" r="4" fill="#fde047"/>
      <!-- Central Floral Dial -->
      <circle cx="100" cy="100" r="32" fill="#e11d48" stroke="#fde047" stroke-width="3"/>
      <circle cx="100" cy="100" r="22" fill="#f59e0b"/>
      <circle cx="100" cy="100" r="12" fill="#ffffff"/>
      <circle cx="100" cy="100" r="6" fill="#dc2626"/>
    </svg>`;
  }

  // 20. Holi / Pichkari / Gulal Motifs
  if (norm.includes('holi') || norm.includes('gulal') || norm.includes('pichkari') || norm.includes('rangpanchami')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Splashes of color -->
      <circle cx="60" cy="65" r="28" fill="#ec4899" opacity="0.75"/>
      <circle cx="140" cy="70" r="26" fill="#eab308" opacity="0.75"/>
      <circle cx="80" cy="140" r="25" fill="#06b6d4" opacity="0.75"/>
      <circle cx="130" cy="135" r="24" fill="#10b981" opacity="0.75"/>
      <!-- Pichkari -->
      <rect x="50" y="115" width="105" height="18" rx="8" transform="rotate(-35 50 115)" fill="#f97316" stroke="#fde047" stroke-width="2.5"/>
      <rect x="135" y="55" width="25" height="6" rx="3" transform="rotate(-35 135 55)" fill="#eab308"/>
    </svg>`;
  }

  // 21. Makar Sankranti / Kite Motifs
  if (norm.includes('kite') || norm.includes('makar') || norm.includes('sankranti') || norm.includes('patang')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#f0f9ff" opacity="0.8"/>
      <!-- Diamond Kite -->
      <polygon points="100,25 155,80 100,145 45,80" fill="#f43f5e" stroke="#fde047" stroke-width="3"/>
      <polygon points="100,25 155,80 100,80" fill="#e11d48"/>
      <polygon points="100,80 100,145 45,80" fill="#fde047"/>
      <!-- Tail -->
      <polygon points="100,145 90,165 110,165" fill="#0284c7"/>
      <!-- Bow Spine line -->
      <line x1="100" y1="25" x2="100" y2="145" stroke="#ffffff" stroke-width="2.5"/>
      <path d="M45 80Q100 110 155 80" stroke="#ffffff" stroke-width="2.5" fill="none"/>
    </svg>`;
  }

  // 22. Eid / Crescent Moon / Mosque Motifs
  if (norm.includes('eid') || norm.includes('ramzan') || norm.includes('mubarak')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#064e3b" opacity="0.15"/>
      <!-- Crescent -->
      <path d="M125 45C95 45 70 70 70 100C70 130 95 155 125 155C138 155 150 150 158 142C132 140 110 118 110 92C110 68 126 48 150 47C142 45 134 45 125 45Z" fill="#10b981"/>
      <!-- 8-point Star -->
      <polygon points="145,65 150,75 160,75 152,82 155,92 145,86 135,92 138,82 130,75 140,75" fill="#fde047"/>
      <!-- Hanging Lantern -->
      <line x1="90" y1="50" x2="90" y2="85" stroke="#fde047" stroke-width="2"/>
      <polygon points="85,85 95,85 100,105 80,105" fill="#f59e0b"/>
    </svg>`;
  }

  // 23. Nature / Flowers (Rose, Sunflower, Lotus)
  if (norm.includes('rose') || norm.includes('flower') || norm.includes('blooming')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="#fdf2f8" opacity="0.9"/>
      <!-- Rose Petals layered -->
      <circle cx="100" cy="95" r="45" fill="#e11d48"/>
      <circle cx="95" cy="90" r="35" fill="#f43f5e"/>
      <circle cx="102" cy="92" r="25" fill="#fb7185"/>
      <circle cx="98" cy="94" r="15" fill="#fda4af"/>
      <path d="M98 94Q103 88 98 84Q93 88 98 94Z" fill="#ffffff"/>
      <!-- Stem & Leaves -->
      <path d="M100 140V175" stroke="#15803d" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M100 155Q125 150 130 140Q120 160 100 162" fill="#16a34a"/>
      <path d="M100 160Q75 155 70 145Q80 165 100 167" fill="#16a34a"/>
    </svg>`;
  }

  if (norm.includes('sunflower')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#fefce8" opacity="0.9"/>
      <!-- Golden Petals -->
      <polygon points="100,35 108,70 92,70" fill="#facc15"/>
      <polygon points="100,165 108,130 92,130" fill="#facc15"/>
      <polygon points="35,100 70,108 70,92" fill="#facc15"/>
      <polygon points="165,100 130,108 130,92" fill="#facc15"/>
      <polygon points="54,54 82,78 72,88" fill="#eab308"/>
      <polygon points="146,146 118,122 128,112" fill="#eab308"/>
      <polygon points="146,54 118,78 128,88" fill="#eab308"/>
      <polygon points="54,146 82,122 72,112" fill="#eab308"/>
      <!-- Seed Center -->
      <circle cx="100" cy="100" r="32" fill="#78350f" stroke="#b45309" stroke-width="3"/>
      <circle cx="100" cy="100" r="24" fill="#451a03"/>
    </svg>`;
  }

  if (norm.includes('ocean') || norm.includes('wave')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#f0f9ff" opacity="0.85"/>
      <circle cx="100" cy="80" r="38" fill="#f59e0b" opacity="0.8"/>
      <!-- Waves -->
      <path d="M25 130Q60 110 95 130T165 130T235 130" stroke="#0284c7" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M15 150Q50 130 85 150T155 150T225 150" stroke="#0369a1" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M25 170Q60 150 95 170T165 170T235 170" stroke="#0c4a6e" stroke-width="6" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  if (norm.includes('yoga') || norm.includes('wellness')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#f0fdf4" opacity="0.85"/>
      <!-- Lotus Base -->
      <path d="M60 145C75 135 100 135 100 155C100 135 125 135 140 145C125 158 75 158 60 145Z" fill="#10b981"/>
      <!-- Meditating Silhouette -->
      <circle cx="100" cy="70" r="14" fill="#047857"/>
      <path d="M85 92C85 85 115 85 115 92V125H85V92Z" fill="#047857"/>
      <path d="M70 125C70 105 85 100 85 100L70 120H130L115 100C115 100 130 105 130 125H70Z" fill="#047857"/>
    </svg>`;
  }

  // 24. Night City & Dream Catcher
  if (norm.includes('city') || norm.includes('skyline')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="#0f172a" opacity="0.9"/>
      <circle cx="140" cy="65" r="22" fill="#fde047" opacity="0.85"/>
      <!-- City Skyscrapers -->
      <rect x="35" y="100" width="28" height="70" fill="#1e293b"/>
      <rect x="68" y="75" width="32" height="95" fill="#334155"/>
      <rect x="105" y="90" width="26" height="80" fill="#1e293b"/>
      <rect x="135" y="110" width="30" height="60" fill="#334155"/>
      <!-- Glowing windows -->
      <circle cx="80" cy="90" r="2" fill="#fde047"/>
      <circle cx="90" cy="90" r="2" fill="#fde047"/>
      <circle cx="80" cy="110" r="2" fill="#fde047"/>
      <circle cx="90" cy="110" r="2" fill="#fde047"/>
      <circle cx="48" cy="115" r="2" fill="#fde047"/>
      <circle cx="120" cy="105" r="2" fill="#fde047"/>
    </svg>`;
  }

  if (norm.includes('candle') || norm.includes('lamp')) {
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="80" r="55" fill="#fef08a" opacity="0.25"/>
      <!-- Candle Flame -->
      <path d="M100 40C100 40 112 60 112 72C112 80 106 86 100 86C94 86 88 80 88 72C88 60 100 40 100 40Z" fill="#f59e0b"/>
      <path d="M100 55C100 55 106 66 106 72C106 76 103 80 100 80C97 80 94 76 94 72C94 66 100 55 100 55Z" fill="#fef08a"/>
      <!-- Candle Body -->
      <rect x="80" y="90" width="40" height="75" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="100" cy="90" rx="20" ry="6" fill="#f8fafc"/>
      <path d="M80 165H120" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  // 25. Fallback Selection: Divine vs Commercial / Neutral
  // If the user's template is commercial, business, service, shop or company - NEVER use Om!
  const isCommercialOrBusiness =
    norm.includes('business') ||
    norm.includes('shop') ||
    norm.includes('store') ||
    norm.includes('company') ||
    norm.includes('service') ||
    norm.includes('real-estate') ||
    norm.includes('estate') ||
    norm.includes('house') ||
    norm.includes('home') ||
    norm.includes('property') ||
    norm.includes('sale') ||
    norm.includes('offer') ||
    norm.includes('discount') ||
    norm.includes('market') ||
    norm.includes('brand') ||
    norm.includes('corporate') ||
    norm.includes('agency');

  if (isCommercialOrBusiness) {
    // Dynamic 3D Tag / Growth Rocket / Starburst Emblem for Business
    return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" fill="${primaryColor}" opacity="0.2"/>
      <circle cx="100" cy="100" r="68" stroke="${primaryColor}" stroke-width="3" stroke-dasharray="8 4"/>
      <!-- Growth Trendline & Star -->
      <path d="M50 135L85 105L115 120L150 75" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="150,75 135,78 148,90" fill="${primaryColor}"/>
      <circle cx="85" cy="105" r="5" fill="#ffffff" stroke="${primaryColor}" stroke-width="3"/>
      <circle cx="115" cy="120" r="5" fill="#ffffff" stroke="${primaryColor}" stroke-width="3"/>
      <circle cx="150" cy="75" r="6" fill="#fde047" stroke="${primaryColor}" stroke-width="2"/>
    </svg>`;
  }

  // Auspicious Om / Kalash / Divine Motif for spiritual/festival themes
  return `<svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="75" fill="${primaryColor}" opacity="0.15"/>
    <circle cx="100" cy="100" r="65" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="100" y="125" font-family="'Noto Sans Devanagari', 'Baloo 2', sans-serif" font-size="75" font-weight="bold" fill="${primaryColor}" text-anchor="middle">ॐ</text>
  </svg>`;
}

