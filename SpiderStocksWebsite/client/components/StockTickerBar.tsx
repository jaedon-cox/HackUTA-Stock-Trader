import { cn } from "@/lib/utils";

interface StockTickerBarProps {
  tickers: string[];
  activeTicker: string | null;
  onSelect: (ticker: string) => void;
  disabled?: boolean;
}

export function StockTickerBar({
  tickers,
  activeTicker,
  onSelect,
  disabled = false,
}: StockTickerBarProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto px-4 py-3 no-scrollbar">
      {tickers.map((ticker) => {
        const isActive = ticker === activeTicker;
        return (
          <button
            key={ticker}
            type="button"
            aria-pressed={isActive}
            disabled={disabled}
            onClick={() => onSelect(ticker)}
            className={cn(
              "rounded-full border border-white/20 px-4 py-2 text-sm font-semibold uppercase transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                : "bg-white/5 text-foreground hover:bg-white/10",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            {ticker}
          </button>
        );
      })}
    </div>
  );
}
