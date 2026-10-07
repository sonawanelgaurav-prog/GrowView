import React, { useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Sun, 
  Layers,
  X,
  Check
} from 'lucide-react';
import { DayCalendarEvent, isTemplateForSelectedCalendarDate } from '../../data/calendarFestivals';
import { PosterTemplate } from '../../types';

interface BrandsLiveCalendarStripProps {
  days: DayCalendarEvent[];
  selectedDate: string | null; // 'YYYY-MM-DD' or null for all
  onSelectDate: (dateStr: string | null, dayEvent?: DayCalendarEvent) => void;
  templates: PosterTemplate[];
  activeFestivalFilter?: string | null;
  onSelectFestivalFilter?: (festivalName: string | null) => void;
  currentRefDate?: string;
  onChangeRefDate?: (newDateStr: string) => void;
  onOpenAIFestivalModal?: () => void;
}

export const BrandsLiveCalendarStrip: React.FC<BrandsLiveCalendarStripProps> = ({
  days,
  selectedDate,
  onSelectDate,
  templates,
  activeFestivalFilter,
  onSelectFestivalFilter,
  currentRefDate,
  onChangeRefDate,
  onOpenAIFestivalModal,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Calculate poster counts for each day strictly using isTemplateForSelectedCalendarDate
  const getPosterCountForDay = (day: DayCalendarEvent): number => {
    const dStr = day.dateStr;
    const count = templates.filter((t) => isTemplateForSelectedCalendarDate(t, dStr, day)).length;
    return count;
  };

  const selectedDayEvent = days.find((d) => d.dateStr === selectedDate);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-2xl border border-amber-500/30 p-3 sm:p-4 shadow-lg text-white">
      {/* Calendar Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
            <CalendarIcon className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
                आगामी ८ दिवसांचे सण कॅलेंडर (Upcoming 8-Day Calendar)
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-500/30">
                ऑटोमॅटिक अपडेट
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              कालचा १ दिवस, आज आणि पुढील ८ दिवसांचे सण आपोआप अपडेट होतात • १-क्लिकवर पोस्टर्स मिळवा
            </p>
          </div>
        </div>

        {/* Scroll Nav & Date Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onChangeRefDate && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold hidden md:inline">आजची तारीख:</span>
              <input
                type="date"
                value={currentRefDate || ''}
                onChange={(e) => {
                  if (e.target.value) onChangeRefDate(e.target.value);
                }}
                className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
                title="आजची तारीख निवडा (कॅलेंडर त्वरित अपडेट होईल)"
              />
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                  onChangeRefDate(todayStr);
                }}
                className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-black px-2 py-0.5 rounded border border-emerald-500/30 transition-colors"
                title="आजच्या चालू तारखेवर रीसेट करा"
              >
                आज (Live)
              </button>
              <button
                type="button"
                onClick={() => onChangeRefDate('2026-09-14')}
                className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-black px-1.5 py-0.5 rounded border border-amber-500/30 transition-colors hidden sm:inline-block"
                title="१४ सप्टेंबर (उदा. गणेश चतुर्थी) निवडा"
              >
                १४ सप्टें
              </button>
            </div>
          )}

          {onOpenAIFestivalModal && (
            <button
              type="button"
              onClick={onOpenAIFestivalModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3 py-1 rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title="✨ AI Festival Auto Creator - ७ दिवसांचे AI पोस्टर्स बनवा"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950 animate-bounce" />
              <span>✨ AI पोस्टर्स बनवा (Auto)</span>
            </button>
          )}

          {selectedDate && (
            <button
              type="button"
              onClick={() => onSelectDate(null)}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-slate-800/90 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 transition-all"
            >
              <X className="w-3 h-3" />
              <span>सर्व पोस्ट्स पहा (All)</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="मागे स्क्रोल करा"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="पुढे स्क्रोल करा"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8-Day Horizontal Date Cards Strip */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 pt-0.5 px-0.5 no-scrollbar scroll-smooth"
      >
        {/* 'All' Reset Card */}
        <button
          type="button"
          onClick={() => onSelectDate(null)}
          className={`shrink-0 w-24 sm:w-28 rounded-xl p-2.5 flex flex-col justify-between items-center text-center transition-all duration-200 border cursor-pointer ${
            selectedDate === null
              ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25 scale-[1.02] font-black'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
            सर्व सण
          </div>
          <div className="my-1">
            <Layers className={`w-5 h-5 mx-auto ${selectedDate === null ? 'text-slate-950' : 'text-amber-400'}`} />
          </div>
          <span className="text-[11px] font-bold">
            सर्व पोस्ट्स ({templates.length})
          </span>
        </button>

        {/* The 8 Days */}
        {days.map((day) => {
          const isSelected = selectedDate === day.dateStr;
          const posterCount = getPosterCountForDay(day);
          const hasMultipleFestivals = day.festivals.length > 1;

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : day.dateStr, day)}
              className={`shrink-0 w-32 sm:w-36 rounded-xl p-2.5 flex flex-col justify-between text-left transition-all duration-200 border cursor-pointer relative group ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/20 via-orange-600/25 to-slate-900 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-amber-500/40'
              }`}
            >
              {/* Day / Status Header */}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                    day.isToday
                      ? 'bg-red-500 text-white animate-pulse shadow-sm shadow-red-500/40'
                      : day.isTomorrow
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40 font-bold'
                      : day.isYesterday
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 font-bold'
                      : isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 font-semibold'
                  }`}
                >
                  {day.isToday
                    ? 'आज (TODAY)'
                    : day.isTomorrow
                    ? 'उद्या (TOMORROW)'
                    : day.isYesterday
                    ? 'काल (YESTERDAY)'
                    : day.weekdayShortMarathi}
                </span>

                {posterCount > 0 && (
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-300 font-black' : 'text-slate-400'}`}>
                    {posterCount} पोस्ट्स
                  </span>
                )}
              </div>

              {/* Date Number & Month */}
              <div className="my-1.5 flex items-baseline gap-1.5">
                <span
                  className={`text-2xl sm:text-3xl font-black leading-none tracking-tight ${
                    isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-200'
                  }`}
                >
                  {day.dayNumber}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {day.monthShortMarathi}
                </span>
              </div>

              {/* Festival Name / Badges (Highlighted e.g. 14 Sep: Ganesh Chaturthi & Hartalika) */}
              <div className="w-full space-y-1 mt-0.5">
                {day.festivals.map((fest, fIdx) => (
                  <div
                    key={fest.id || fIdx}
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded truncate flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                        : fIdx === 0 && hasMultipleFestivals
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : fIdx === 1 && hasMultipleFestivals
                        ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                    title={fest.nameMarathi}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="truncate">{fest.nameMarathi}</span>
                  </div>
                ))}
              </div>

              {/* Selected Check Indicator */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Date Context & Multi-Festival Filter Toolbar */}
      {selectedDayEvent && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in slide-in-from-top-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {selectedDayEvent.dayNumber} {selectedDayEvent.monthNameMarathi} ({selectedDayEvent.weekdayNameMarathi})
                {selectedDayEvent.isToday && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-black text-[10px] border border-red-500/30">• आज (Today)</span>}
                {selectedDayEvent.isTomorrow && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-[10px] border border-orange-500/30">• उद्या (Tomorrow)</span>}
                {selectedDayEvent.isYesterday && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-bold text-[10px] border border-slate-600">• काल (Yesterday)</span>}
              </span>
            </span>

            {/* Festival Badges on this Day */}
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedDayEvent.festivals.map((fest) => {
                const isFestActive = activeFestivalFilter === fest.category || activeFestivalFilter === fest.nameMarathi;
                return (
                  <button
                    key={fest.id}
                    type="button"
                    onClick={() => {
                      if (onSelectFestivalFilter) {
                        onSelectFestivalFilter(isFestActive ? null : fest.category);
                      }
                    }}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                      isFestActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 font-black shadow-sm'
                        : 'bg-slate-800 text-amber-300 border-amber-500/30 hover:bg-slate-750'
                    }`}
                  >
                    <span>{fest.nameMarathi}</span>
                    {fest.badge && (
                      <span className="text-[9px] opacity-80">({fest.badge})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              या तारखेचे पोस्टर्स फिल्टर झाले आहेत
            </span>
            <button
              type="button"
              onClick={() => onSelectDate(null)}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline font-bold"
            >
              रीसेट करा
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
