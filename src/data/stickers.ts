export interface StickerItem {
  id: string;
  name: string;
  category: 'festive' | 'offer' | 'badges' | 'devotional';
  text?: string;
  svgIcon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const STICKERS: StickerItem[] = [
  // Festive & Devotional
  {
    id: 'st-ganesh',
    name: 'Shree Ganeshay Namah',
    category: 'devotional',
    text: '।। श्री गणेशाय नमः ।।',
    svgIcon: 'om',
    bgColor: 'bg-amber-600',
    textColor: 'text-amber-100',
    borderColor: 'border-amber-400'
  },
  {
    id: 'st-shubh-labh',
    name: 'Shubh Labh',
    category: 'devotional',
    text: 'शुभ • लाभ',
    svgIcon: 'sparkles',
    bgColor: 'bg-red-700',
    textColor: 'text-yellow-200',
    borderColor: 'border-yellow-400'
  },
  {
    id: 'st-shubhechha',
    name: 'Hardik Shubhechha',
    category: 'festive',
    text: 'हार्दिक शुभेच्छा',
    svgIcon: 'award',
    bgColor: 'bg-orange-600',
    textColor: 'text-white',
    borderColor: 'border-orange-300'
  },
  {
    id: 'st-jai-hind',
    name: 'Jai Hind',
    category: 'festive',
    text: 'जय हिन्द • Vande Mataram',
    svgIcon: 'flag',
    bgColor: 'bg-gradient-to-r from-orange-600 via-white to-green-600',
    textColor: 'text-blue-900',
    borderColor: 'border-white'
  },
  {
    id: 'st-ram',
    name: 'Jai Shree Ram',
    category: 'devotional',
    text: '।। जय श्री राम ।।',
    svgIcon: 'sun',
    bgColor: 'bg-amber-700',
    textColor: 'text-amber-100',
    borderColor: 'border-amber-300'
  },

  // Offers & Commercial
  {
    id: 'st-offer-50',
    name: '50% Flat Off',
    category: 'offer',
    text: 'FLAT 50% OFF',
    svgIcon: 'percent',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    borderColor: 'border-yellow-300'
  },
  {
    id: 'st-limited-offer',
    name: 'Limited Time Offer',
    category: 'offer',
    text: '⚡ LIMITED TIME OFFER',
    svgIcon: 'zap',
    bgColor: 'bg-amber-500',
    textColor: 'text-black',
    borderColor: 'border-black'
  },
  {
    id: 'st-grand-opening',
    name: 'Grand Opening',
    category: 'offer',
    text: '🎉 GRAND OPENING',
    svgIcon: 'gift',
    bgColor: 'bg-purple-700',
    textColor: 'text-yellow-200',
    borderColor: 'border-yellow-400'
  },
  {
    id: 'st-festive-discount',
    name: 'Festive Special Offer',
    category: 'offer',
    text: '🎁 FESTIVE SPECIAL DISCOUNT',
    svgIcon: 'sparkle',
    bgColor: 'bg-emerald-600',
    textColor: 'text-white',
    borderColor: 'border-emerald-300'
  },
  {
    id: 'st-verified',
    name: '100% Genuine Quality',
    category: 'badges',
    text: '★ 100% TRUSTED & CERTIFIED ★',
    svgIcon: 'shield-check',
    bgColor: 'bg-blue-700',
    textColor: 'text-white',
    borderColor: 'border-blue-300'
  }
];
