import { getPredictionDirectionLabel } from "@/lib/stock-api";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface PredictionSummaryProps {
  dailyChange: number;
  confidence: string;
  ticker: string;
}

export function PredictionSummary({
  dailyChange,
  confidence,
  ticker,
}: PredictionSummaryProps) {
  const direction = getPredictionDirectionLabel(dailyChange);
  const isHigher = direction === "higher";

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 via-white/4 to-white/2 p-6 backdrop-blur">
      <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-slate-200/80">
        <span className="h-2 w-2 rounded-full bg-primary"></span>
        Prediction insight
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white"
            aria-hidden
          >
            {isHigher ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-300/70">
              {ticker} outlook
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              Expected to close {direction} today
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2 rounded-2xl bg-black/30 px-4 py-3 text-white shadow-inner">
          <span className="text-sm font-medium uppercase tracking-widest text-slate-200/60">
            Confidence
          </span>
          <span className="text-3xl font-bold leading-none">{confidence}</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-200/80">
        The model continuously ingests the latest market signals across volume,
        volatility, and macro indicators to project the day&apos;s close. Keep an
        eye on rapid swings—confidence adjusts in real-time as new data arrives.
      </p>
    </div>
  );
}
