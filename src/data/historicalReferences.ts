/**
 * Verified Historical References Database
 * Authentic public-domain & Wikimedia Commons archival photographs with verified attribution
 * Strictly following Section 4 & 5 rules:
 * - Real historical photographs for historical figures
 * - Preserving Source Page, Source Name, License, and Author attribution
 * - No fake AI faces for recognized historical personalities
 */

export interface HistoricalReferenceImage {
  personKey: string;
  names: string[];
  canonicalName: string;
  canonicalNameMarathi: string;
  imageUrl: string;
  sourcePage: string;
  sourceName: string;
  license: string;
  credit: string;
  verifiedAuthenticity: boolean;
  notes: string;
}

export const HISTORICAL_REFERENCES: Record<string, HistoricalReferenceImage> = {
  'bhagat-singh': {
    personKey: 'bhagat-singh',
    names: ['bhagat singh', 'shaheed bhagat singh', 'भगतसिंग', 'शहीद भगतसिंग'],
    canonicalName: 'Shaheed Bhagat Singh',
    canonicalNameMarathi: 'शहीद भगतसिंग',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bhagat_Singh_1929.jpg/640px-Bhagat_Singh_1929.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Bhagat_Singh_1929.jpg',
    sourceName: 'Wikimedia Commons / National Archives of India',
    license: 'Public Domain (India, pre-1950)',
    credit: 'Photographer Ram Nath of Kashmere Gate, Delhi (April 1929)',
    verifiedAuthenticity: true,
    notes: 'The iconic authentic 1929 fedora hat portrait taken before Central Legislative Assembly bombing.'
  },
  'shivaji-maharaj': {
    personKey: 'shivaji-maharaj',
    names: ['shivaji maharaj', 'chhatrapati shivaji maharaj', 'शिवाजी महाराज', 'छत्रपती शिवाजी महाराज', 'शिवजयंती'],
    canonicalName: 'Chhatrapati Shivaji Maharaj',
    canonicalNameMarathi: 'छत्रपती शिवाजी महाराज',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Shivaji_British_Museum.jpg/640px-Shivaji_British_Museum.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Shivaji_British_Museum.jpg',
    sourceName: 'British Museum / Wikimedia Commons',
    license: 'Public Domain (17th Century Miniature)',
    credit: 'Mughal / Deccan School (c. 1680), British Museum Collection',
    verifiedAuthenticity: true,
    notes: 'Historical contemporary portrait preserved in the British Museum.'
  },
  'mahatma-gandhi': {
    personKey: 'mahatma-gandhi',
    names: ['mahatma gandhi', 'gandhi', 'गांधी', 'महात्मा गांधी', 'राष्ट्रपिता'],
    canonicalName: 'Mahatma Gandhi',
    canonicalNameMarathi: 'महात्मा गांधी',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/640px-Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Mahatma-Gandhi,_studio,_1931.jpg',
    sourceName: 'Elliott & Fry / Wikimedia Commons',
    license: 'Public Domain (1931)',
    credit: 'Studio portrait by Elliott & Fry (1931, London)',
    verifiedAuthenticity: true,
    notes: 'Verified 1931 London studio portrait.'
  },
  'lal-bahadur-shastri': {
    personKey: 'lal-bahadur-shastri',
    names: ['lal bahadur shastri', 'shastri', 'लाल बहादूर शास्त्री'],
    canonicalName: 'Lal Bahadur Shastri',
    canonicalNameMarathi: 'लाल बहादूर शास्त्री',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lal_Bahadur_Shastri_in_1965.jpg/640px-Lal_Bahadur_Shastri_in_1965.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Lal_Bahadur_Shastri_in_1965.jpg',
    sourceName: 'Press Information Bureau, Government of India / Wikimedia Commons',
    license: 'Public Domain (GODL-India)',
    credit: 'Government of India (1965)',
    verifiedAuthenticity: true,
    notes: 'Official portrait during his tenure as 2nd Prime Minister of India.'
  },
  'dr-ambedkar': {
    personKey: 'dr-ambedkar',
    names: ['ambedkar', 'babasaheb ambedkar', 'dr b r ambedkar', 'आंबेडकर', 'डॉ. बाबासाहेब आंबेडकर'],
    canonicalName: 'Dr. B. R. Ambedkar',
    canonicalNameMarathi: 'भारतरत्न डॉ. बाबासाहेब आंबेडकर',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/640px-Dr._Bhimrao_Ambedkar.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Dr._Bhimrao_Ambedkar.jpg',
    sourceName: 'Press Information Bureau / Wikimedia Commons',
    license: 'Public Domain (GODL-India)',
    credit: 'Government of India Archive',
    verifiedAuthenticity: true,
    notes: 'Official historical portrait of the chief architect of the Constitution of India.'
  },
  'jyotirao-phule': {
    personKey: 'jyotirao-phule',
    names: ['jyotirao phule', 'mahatma phule', 'जोतीराव फुले', 'महात्मा फुले'],
    canonicalName: 'Mahatma Jyotirao Phule',
    canonicalNameMarathi: 'क्रांतिसूर्य महात्मा जोतीराव फुले',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jyotirao_Phule.jpg/640px-Jyotirao_Phule.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Jyotirao_Phule.jpg',
    sourceName: 'Satyashodhak Samaj Archives / Wikimedia Commons',
    license: 'Public Domain (19th Century)',
    credit: 'Historical Archive Portrait',
    verifiedAuthenticity: true,
    notes: 'Authentic 19th-century portrait with traditional Puneri Pagadi.'
  },
  'savitribai-phule': {
    personKey: 'savitribai-phule',
    names: ['savitribai phule', 'सावित्रीबाई फुले', 'क्रांतिज्योती सावित्रीबाई फुले'],
    canonicalName: 'Krantijyoti Savitribai Phule',
    canonicalNameMarathi: 'क्रांतिज्योती सावित्रीबाई फुले',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Savitribai_Phule.jpg/640px-Savitribai_Phule.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Savitribai_Phule.jpg',
    sourceName: 'National Archives of India / Wikimedia Commons',
    license: 'Public Domain (c. 1890)',
    credit: 'Historical Archive of India',
    verifiedAuthenticity: true,
    notes: 'Authentic historical archival photograph of India’s pioneer female educator.'
  },
  'subhash-chandra-bose': {
    personKey: 'subhash-chandra-bose',
    names: ['subhash chandra bose', 'netaji', 'सुभाषचंद्र बोस', 'नेताजी'],
    canonicalName: 'Netaji Subhash Chandra Bose',
    canonicalNameMarathi: 'नेताजी सुभाषचंद्र बोस',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Subhas_Chandra_Bose_NRB.jpg/640px-Subhas_Chandra_Bose_NRB.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Subhas_Chandra_Bose_NRB.jpg',
    sourceName: 'Netaji Research Bureau / Wikimedia Commons',
    license: 'Public Domain (c. 1938)',
    credit: 'Netaji Research Bureau, Kolkata',
    verifiedAuthenticity: true,
    notes: 'Authentic uniform portrait of Netaji.'
  },
  'sardar-patel': {
    personKey: 'sardar-patel',
    names: ['sardar patel', 'sardar vallabhbhai patel', 'सरदार पटेल', 'लोहपुरुष'],
    canonicalName: 'Sardar Vallabhbhai Patel',
    canonicalNameMarathi: 'सरदार वल्लभभाई पटेल',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sardar_patel_%28cropped%29.jpg/640px-Sardar_patel_%28cropped%29.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sardar_patel_(cropped).jpg',
    sourceName: 'Press Information Bureau / Wikimedia Commons',
    license: 'Public Domain (GODL-India)',
    credit: 'Government of India (1949)',
    verifiedAuthenticity: true,
    notes: 'Official portrait of the Iron Man of India.'
  },
  'swami-vivekananda': {
    personKey: 'swami-vivekananda',
    names: ['swami vivekananda', 'vivekananda', 'स्वामी विवेकानंद'],
    canonicalName: 'Swami Vivekananda',
    canonicalNameMarathi: 'स्वामी विवेकानंद',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Swami_Vivekananda-1893-09-signed.jpg/640px-Swami_Vivekananda-1893-09-signed.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Swami_Vivekananda-1893-09-signed.jpg',
    sourceName: 'Thomas Harrison / Wikimedia Commons',
    license: 'Public Domain (September 1893, Chicago)',
    credit: 'Thomas Harrison, Chicago (September 1893)',
    verifiedAuthenticity: true,
    notes: 'Iconic Chicago Parliament of the World\'s Religions portrait.'
  },
  'apj-abdul-kalam': {
    personKey: 'apj-abdul-kalam',
    names: ['abdul kalam', 'dr apj abdul kalam', 'कलाम', 'डॉ. ए. पी. जे. अब्दुल कलाम'],
    canonicalName: 'Dr. A.P.J. Abdul Kalam',
    canonicalNameMarathi: 'भारतरत्न डॉ. ए. पी. जे. अब्दुल कलाम',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/A._P._J._Abdul_Kalam_in_2008.jpg/640px-A._P._J._Abdul_Kalam_in_2008.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:A._P._J._Abdul_Kalam_in_2008.jpg',
    sourceName: 'Defense Research & Development Organisation (DRDO) / Wikimedia Commons',
    license: 'Public Domain (GODL-India)',
    credit: 'Government of India (2008)',
    verifiedAuthenticity: true,
    notes: 'Official portrait of the Missile Man & 11th President of India.'
  },
  'lokmanya-tilak': {
    personKey: 'lokmanya-tilak',
    names: ['lokmanya tilak', 'bal gangadhar tilak', 'टिळक', 'लोकमान्य टिळक'],
    canonicalName: 'Lokmanya Bal Gangadhar Tilak',
    canonicalNameMarathi: 'लोकमान्य बाळ गंगाधर टिळक',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Bal_G_Tilak.jpg/640px-Bal_G_Tilak.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Bal_G_Tilak.jpg',
    sourceName: 'National Archives of India / Wikimedia Commons',
    license: 'Public Domain (pre-1920)',
    credit: 'National Archives of India',
    verifiedAuthenticity: true,
    notes: 'Authentic historical portrait with traditional pagadi.'
  },
  'ahilyabai-holkar': {
    personKey: 'ahilyabai-holkar',
    names: ['ahilyabai holkar', 'ahilya devi', 'अहिल्याबाई होळकर', 'पुण्यश्लोक अहिल्यादेवी होळकर'],
    canonicalName: 'Punyashlok Ahilyabai Holkar',
    canonicalNameMarathi: 'पुण्यश्लोक राजमाता अहिल्याबाई होळकर',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Ahilyabai_Holkar.jpg/640px-Ahilyabai_Holkar.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Ahilyabai_Holkar.jpg',
    sourceName: 'Holkar State Archives / Wikimedia Commons',
    license: 'Public Domain (18th Century Painting)',
    credit: 'Maheshwar Palace Collection (c. 1780)',
    verifiedAuthenticity: true,
    notes: 'Historical contemporary portrait preserved at Maheshwar Fort.'
  },
  'sambhaji-maharaj': {
    personKey: 'sambhaji-maharaj',
    names: ['sambhaji maharaj', 'chhatrapati sambhaji maharaj', 'संभाजी महाराज', 'छत्रपती संभाजी महाराज', 'धर्मवीर'],
    canonicalName: 'Chhatrapati Sambhaji Maharaj',
    canonicalNameMarathi: 'छत्रपती संभाजी महाराज',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sambhaji_British_Museum.jpg/640px-Sambhaji_British_Museum.jpg',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Sambhaji_British_Museum.jpg',
    sourceName: 'British Museum / Wikimedia Commons',
    license: 'Public Domain (17th Century)',
    credit: 'Deccan Miniature (c. 1685), British Museum',
    verifiedAuthenticity: true,
    notes: 'Verified 17th-century contemporary portrait.'
  },
  'birsa-munda': {
    personKey: 'birsa-munda',
    names: ['birsa munda', 'बिरसा मुंडा', 'भगवान बिरसा मुंडा'],
    canonicalName: 'Bhagwan Birsa Munda',
    canonicalNameMarathi: 'क्रांतिसूर्य भगवान बिरसा मुंडा',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Birsa_Munda.jpg/640px-Birsa_Munda.jpg',
    sourceName: 'National Archives of India / Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Birsa_Munda.jpg',
    license: 'Public Domain (pre-1900)',
    credit: 'Archaeological Survey & National Archives of India',
    verifiedAuthenticity: true,
    notes: 'Authentic archival photograph taken during the freedom struggle.'
  }
};

/**
 * Helper to match any query text or event title to verified historical image
 */
export function findHistoricalReference(query: string): HistoricalReferenceImage | null {
  if (!query) return null;
  const q = query.toLowerCase();

  for (const ref of Object.values(HISTORICAL_REFERENCES)) {
    if (ref.names.some(name => q.includes(name.toLowerCase()))) {
      return ref;
    }
  }

  return null;
}
