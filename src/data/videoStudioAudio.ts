export interface AudioTrackItem {
  id: string;
  name: string;
  nameMarathi: string;
  category: 'festival' | 'ganesh' | 'birthday' | 'wedding' | 'business' | 'motivational' | 'celebration' | 'devotional';
  durationSeconds: number;
  bpm: number;
  tags: string[];
  description: string;
}

export const AUDIO_TRACKS_LIBRARY: AudioTrackItem[] = [
  // 1. Ganesh & Devotional
  {
    id: 'dhol_tasha_utsav',
    name: 'Dhol Tasha Mahautsav',
    nameMarathi: 'ढोल-ताशा महाउत्सव (पुणेरी ताल)',
    category: 'ganesh',
    durationSeconds: 30,
    bpm: 128,
    tags: ['ganesh', 'dhol', 'tasha', 'puneri', 'utsav'],
    description: 'High-energy traditional Puneri Dhol-Tasha beats with rhythmic cymbal crashes',
  },
  {
    id: 'bappa_morya_aarti',
    name: 'Bappa Morya Mangal Aarti',
    nameMarathi: 'बाप्पा मोरया मंगल आरती सूर',
    category: 'ganesh',
    durationSeconds: 30,
    bpm: 110,
    tags: ['ganesh', 'aarti', 'mangal', 'devotional'],
    description: 'Sacred temple bell chimes and soothing devotional tanpura drone',
  },
  {
    id: 'shehnai_mangal_sur',
    name: 'Shehnai Mangal Sur',
    nameMarathi: 'सनईचे मंगल सूर व नाद',
    category: 'devotional',
    durationSeconds: 30,
    bpm: 96,
    tags: ['shehnai', 'mangal', 'shubh', 'morning'],
    description: 'Auspicious classical Shehnai melodies evoking sacred blessings',
  },
  {
    id: 'shankh_temple_bells',
    name: 'Shankhanaad & Temple Bells',
    nameMarathi: 'शंखनाद व मंदिरातील घंटानाद',
    category: 'devotional',
    durationSeconds: 30,
    bpm: 85,
    tags: ['shankh', 'bells', 'puja', 'aarti'],
    description: 'Divine conch shell resonance layered with pure bronze temple bells',
  },

  // 2. Festival & Celebration
  {
    id: 'diwali_festive_sparkle',
    name: 'Diwali Festival Beats',
    nameMarathi: 'दिवाळी सण व रोषणाई संगीत',
    category: 'festival',
    durationSeconds: 30,
    bpm: 120,
    tags: ['diwali', 'festive', 'sparkles', 'joy'],
    description: 'Uplifting celebratory rhythm with bright sparkles and percussion',
  },
  {
    id: 'gulal_celebration',
    name: 'Gulal Utsav Celebration',
    nameMarathi: 'गुलाल उधळण व जल्लोष',
    category: 'celebration',
    durationSeconds: 30,
    bpm: 135,
    tags: ['celebration', 'dance', 'dhamaka', 'dj'],
    description: 'Vibrant celebratory street festival rhythm packed with energy',
  },

  // 3. Wedding & Shubh Vivah
  {
    id: 'shubh_vivah_choughada',
    name: 'Shubh Vivah Choughada',
    nameMarathi: 'शुभ विवाह सनई-चौघडा',
    category: 'wedding',
    durationSeconds: 30,
    bpm: 105,
    tags: ['wedding', 'vivah', 'sanai', 'akshata'],
    description: 'Traditional royal Marathi wedding celebration rhythm with Sanai-Choughada',
  },

  // 4. Birthday
  {
    id: 'birthday_dhamaka_beat',
    name: 'Vadhdivas Dhamaka Beat',
    nameMarathi: 'वाढदिवस सेलिब्रेशन ढोल बीट',
    category: 'birthday',
    durationSeconds: 30,
    bpm: 130,
    tags: ['birthday', 'vadhdivas', 'party', 'celebration'],
    description: 'Catchy festive beat perfect for birthday status and reels wishes',
  },

  // 5. Business & Corporate
  {
    id: 'business_modern_groove',
    name: 'Corporate Growth Beat',
    nameMarathi: 'बिझनेस ग्रोथ व कॉर्पोरेट बीट',
    category: 'business',
    durationSeconds: 30,
    bpm: 118,
    tags: ['business', 'promo', 'modern', 'clean'],
    description: 'Sleek, polished modern rhythm for product announcements and branding',
  },
  {
    id: 'motivational_cinematic',
    name: 'Inspiring Suvichar Anthem',
    nameMarathi: 'उत्साहवर्धक व प्रेरणादायी सूर',
    category: 'motivational',
    durationSeconds: 30,
    bpm: 90,
    tags: ['motivational', 'morning', 'suvichar', 'inspirational'],
    description: 'Gentle, uplifting orchestral swells for daily thoughts and motivation',
  },
];

// Web Audio API Synthesizer Engine for real-time preview and video track mixing
class VideoStudioAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;

  public getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTrack(trackId: string, volume: number = 0.8) {
    this.stop();
    const ctx = this.getContext();
    this.isPlaying = true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    let step = 0;
    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;

      if (trackId === 'dhol_tasha_utsav') {
        // Dhol: Deep booming base
        if (step % 2 === 0) {
          this.triggerDrum(ctx, masterGain, now, 85, 38, 0.4, 0.7);
        }
        // Tasha: Crisp snappy high strike
        if (step % 4 === 1 || step % 4 === 3) {
          this.triggerTasha(ctx, masterGain, now, 0.15, 0.4);
        }
        // Jhanj: Metallic shimmer
        if (step % 8 === 0) {
          this.triggerShimmer(ctx, masterGain, now, 0.6, 0.25);
        }
      } else if (trackId === 'bappa_morya_aarti' || trackId === 'shankh_temple_bells') {
        // Temple Bell
        if (step % 4 === 0) {
          this.triggerBell(ctx, masterGain, now, 1046.5, 1.8, 0.4); // C6 bell
        }
        if (step % 8 === 4) {
          this.triggerBell(ctx, masterGain, now, 1318.5, 1.4, 0.3); // E6 bell
        }
        // Shankh warm drone
        if (step % 16 === 0) {
          this.triggerDrone(ctx, masterGain, now, 196, 2.5, 0.2); // G3 drone
        }
      } else if (trackId === 'shehnai_mangal_sur' || trackId === 'shubh_vivah_choughada') {
        // Shehnai melody notes (Sa, Re, Ga, Pa, Dha)
        const notes = [440, 493.88, 554.37, 659.25, 739.99, 880];
        const note = notes[step % notes.length];
        this.triggerShehnai(ctx, masterGain, now, note, 0.4, 0.3);
        if (step % 2 === 0) {
          this.triggerDrum(ctx, masterGain, now, 110, 55, 0.25, 0.35);
        }
      } else if (trackId === 'business_modern_groove') {
        // Electronic modern kick & soft chime
        if (step % 4 === 0) {
          this.triggerDrum(ctx, masterGain, now, 130, 45, 0.2, 0.6);
        }
        if (step % 4 === 2) {
          this.triggerTasha(ctx, masterGain, now, 0.1, 0.25);
        }
        const chordFreqs = [523.25, 659.25, 783.99]; // C Major
        this.triggerBell(ctx, masterGain, now, chordFreqs[step % 3], 0.3, 0.15);
      } else if (trackId === 'motivational_cinematic') {
        // Peaceful Night / Serene Suvichar ambient chimes & celestial resonance
        if (step % 8 === 0) {
          this.triggerBell(ctx, masterGain, now, 523.25, 2.2, 0.25); // C5 crystal chime
        }
        if (step % 8 === 4) {
          this.triggerBell(ctx, masterGain, now, 659.25, 2.0, 0.2); // E5 crystal chime
        }
        if (step % 16 === 0) {
          this.triggerDrone(ctx, masterGain, now, 130.81, 3.2, 0.14); // C3 warm night pad
        }
        if (step % 16 === 8) {
          this.triggerDrone(ctx, masterGain, now, 174.61, 3.0, 0.12); // F3 harmonic chord
        }
      } else {
        // Default energetic celebratory rhythm
        if (step % 2 === 0) {
          this.triggerDrum(ctx, masterGain, now, 95, 42, 0.3, 0.5);
        }
        if (step % 2 === 1) {
          this.triggerTasha(ctx, masterGain, now, 0.12, 0.3);
        }
      }

      step = (step + 1) % 64;
    }, 180);
  }

  private triggerDrum(
    ctx: AudioContext,
    dest: AudioNode,
    time: number,
    startFreq: number,
    endFreq: number,
    duration: number,
    gainLevel: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerTasha(ctx: AudioContext, dest: AudioNode, time: number, duration: number, gainLevel: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + duration);

    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerBell(ctx: AudioContext, dest: AudioNode, time: number, freq: number, duration: number, gainLevel: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerDrone(ctx: AudioContext, dest: AudioNode, time: number, freq: number, duration: number, gainLevel: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    // Filter to soften the sawtooth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerShehnai(ctx: AudioContext, dest: AudioNode, time: number, freq: number, duration: number, gainLevel: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.02, time + duration);

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, time);
    filter.Q.setValueAtTime(3, time);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerShimmer(ctx: AudioContext, dest: AudioNode, time: number, duration: number, gainLevel: number) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    whiteNoise.start(time);
    whiteNoise.stop(time + duration);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public createAudioDestinationStream(trackId: string, durationSeconds: number) {
    const ctx = this.getContext();
    const dest = ctx.createMediaStreamDestination();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, ctx.currentTime);
    masterGain.connect(dest);

    // Schedule audio playback nodes across duration
    let step = 0;
    const interval = 0.18; // ~180ms
    const totalSteps = Math.ceil(durationSeconds / interval);

    for (let i = 0; i < totalSteps; i++) {
      const scheduledTime = ctx.currentTime + i * interval;
      if (trackId === 'dhol_tasha_utsav') {
        if (step % 2 === 0) {
          this.triggerDrum(ctx, masterGain, scheduledTime, 85, 38, 0.4, 0.7);
        }
        if (step % 4 === 1 || step % 4 === 3) {
          this.triggerTasha(ctx, masterGain, scheduledTime, 0.15, 0.4);
        }
        if (step % 8 === 0) {
          this.triggerShimmer(ctx, masterGain, scheduledTime, 0.6, 0.25);
        }
      } else if (trackId === 'bappa_morya_aarti' || trackId === 'shankh_temple_bells') {
        if (step % 4 === 0) {
          this.triggerBell(ctx, masterGain, scheduledTime, 1046.5, 1.8, 0.4);
        }
        if (step % 8 === 4) {
          this.triggerBell(ctx, masterGain, scheduledTime, 1318.5, 1.4, 0.3);
        }
        if (step % 16 === 0) {
          this.triggerDrone(ctx, masterGain, scheduledTime, 196, 2.5, 0.2);
        }
      } else if (trackId === 'motivational_cinematic') {
        if (step % 8 === 0) {
          this.triggerBell(ctx, masterGain, scheduledTime, 523.25, 2.2, 0.25);
        }
        if (step % 8 === 4) {
          this.triggerBell(ctx, masterGain, scheduledTime, 659.25, 2.0, 0.2);
        }
        if (step % 16 === 0) {
          this.triggerDrone(ctx, masterGain, scheduledTime, 130.81, 3.2, 0.14);
        }
        if (step % 16 === 8) {
          this.triggerDrone(ctx, masterGain, scheduledTime, 174.61, 3.0, 0.12);
        }
      } else {
        if (step % 2 === 0) {
          this.triggerDrum(ctx, masterGain, scheduledTime, 95, 42, 0.3, 0.5);
        }
        if (step % 2 === 1) {
          this.triggerTasha(ctx, masterGain, scheduledTime, 0.12, 0.3);
        }
      }
      step = (step + 1) % 64;
    }

    return dest.stream;
  }
}

export const videoStudioAudioEngine = new VideoStudioAudioSynthesizer();
