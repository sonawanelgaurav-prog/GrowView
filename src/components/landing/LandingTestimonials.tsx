import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

interface LandingTestimonialsProps {
  title: string;
  subtitle: string;
}

export const LandingTestimonials: React.FC<LandingTestimonialsProps> = ({ title, subtitle }) => {
  const reviews = [
    {
      name: 'Nitin Deshmukh',
      role: 'Owner, Deshmukh Sweets & Bakery (Pune)',
      comment:
        'GrowView has completely transformed how I wish my customers on festivals! I make Marathi Shivaji Maharaj Jayanti and Diwali posters in under 1 minute with my shop logo.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Dr. Sneha Kulkarni',
      role: 'Dental Clinic Director (Nashik)',
      comment:
        'The healthcare and festival templates look extremely professional. The 27 color frames give me a fresh look for my clinic on WhatsApp Status daily.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Pravin Shinde',
      role: 'Founder, Shinde Real Estate (Kolhapur)',
      comment:
        'Auto branding saves me so much money on graphic designers. My property listings and festival greetings look super clean and high definition.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
  ];

  return (
    <section id="section-testimonials" className="py-16 md:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
            {title || 'Loved by 50,000+ Business Owners'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border border-amber-500/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-slate-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
