import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Send,
  Filter,
  Search,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { PlayStoreReview } from '../../types';
import { MOCK_PLAY_STORE_REVIEWS } from '../../data/adminMockData';

export const AdminReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<PlayStoreReview[]>(MOCK_PLAY_STORE_REVIEWS);
  const [replyInput, setReplyInput] = useState<{ [id: string]: string }>({});
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const handleReplySubmit = (reviewId: string) => {
    const text = replyInput[reviewId];
    if (!text || !text.trim()) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, replyText: text, repliedAt: new Date().toISOString() }
          : r
      )
    );

    setReplyInput((prev) => ({ ...prev, [reviewId]: '' }));
  };

  const filteredReviews = reviews.filter((r) => {
    return filterRating === 'all' || r.rating === filterRating;
  });

  return (
    <div className="space-y-6">
      {/* Top Play Store Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <div className="text-4xl font-black text-amber-400">4.8</div>
          <div className="flex items-center gap-1 my-1.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-semibold">14,280 Play Store Ratings</span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {[
            { star: 5, pct: 82, count: '11.7K' },
            { star: 4, pct: 12, count: '1.7K' },
            { star: 3, pct: 4, count: '570' },
            { star: 2, pct: 1, count: '140' },
            { star: 1, pct: 1, count: '170' },
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-400 font-mono flex items-center gap-1">
                <span>{bar.star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-12 text-right text-slate-400 font-mono">{bar.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Play Store Reviews & Reply Workflow</span>
        </h4>

        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-300 px-3 py-1.5 rounded-xl"
        >
          <option value="all">सर्व रेटिंग्ज (All Stars)</option>
          <option value="5">5 Star Reviews</option>
          <option value="4">4 Star Reviews</option>
          <option value="3">3 Star Reviews</option>
          <option value="1">1-2 Star Negative</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{rev.userName}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                  <span>{rev.date}</span>
                  <span>•</span>
                  <span>{rev.device}</span>
                  <span>•</span>
                  <span>{rev.appVersion}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  rev.sentiment === 'positive'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : rev.sentiment === 'negative'
                    ? 'bg-rose-500/15 text-rose-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                {rev.sentiment.toUpperCase()}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{rev.reviewText}</p>

            {/* Official Admin Reply If Present */}
            {rev.replyText && (
              <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/20 text-xs space-y-1">
                <span className="font-bold text-indigo-400 block text-[11px]">
                  GrowView Developer Response:
                </span>
                <p className="text-slate-300">{rev.replyText}</p>
              </div>
            )}

            {/* Reply Composer if not replied */}
            {!rev.replyText && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput[rev.id] || ''}
                  onChange={(e) =>
                    setReplyInput({ ...replyInput, [rev.id]: e.target.value })
                  }
                  placeholder="Play Store वर थेट उत्तर पाठवा (उदा. धन्यवाद सचिनजी)..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleReplySubmit(rev.id)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
