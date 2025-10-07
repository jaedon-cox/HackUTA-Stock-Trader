import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";

import { PredictionSummary } from "@/components/PredictionSummary";
import { StockChart } from "@/components/StockChart";
import { StockTickerBar } from "@/components/StockTickerBar";
import { fetchStockPredictions, StockPrediction } from "@/lib/stock-api";

function generateAccentColor(ticker: string | null): string {
  if (!ticker) {
    return "#3bc9db";
  }
  let hash = 0;
  for (let i = 0; i < ticker.length; i += 1) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 84% 62%)`;
}

export default function Index() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StockPrediction[]>({
    queryKey: ["stock-predictions"],
    queryFn: fetchStockPredictions,
    retry: 1,
  });

  useEffect(() => {
    if (data && data.length > 0 && !selectedTicker) {
      setSelectedTicker(data[0].ticker);
    }
  }, [data, selectedTicker]);

  const activeStock = useMemo(
    () => data?.find((stock) => stock.ticker === selectedTicker) ?? null,
    [data, selectedTicker],
  );

  const accentColor = useMemo(
    () => generateAccentColor(activeStock?.ticker ?? null),
    [activeStock?.ticker],
  );

  const tickers = useMemo(
    () => (data ? data.map((stock) => stock.ticker) : []),
    [data],
  );

  const latestClose = activeStock?.closing_values.at(-1) ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-18%] top-[30%] h-[600px] w-[600px] rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[10%] h-[480px] w-[520px] rounded-full bg-secondary/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-20 pt-14 lg:px-12">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-white/10 p-3 backdrop-blur">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary via-primary/60 to-secondary shadow-lg shadow-primary/40" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Spider Stocks
              </h1>
              <p className="text-sm uppercase tracking-[0.42em] text-slate-300/70">
                live predictive intelligence
              </p>
            </div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-100/80 backdrop-blur">
            Powered by Spider Stocks forecasting API
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.48em] text-slate-300/80">
              watchlist
            </span>
            <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur">
              <StockTickerBar
                tickers={tickers}
                activeTicker={selectedTicker}
                onSelect={setSelectedTicker}
                disabled={isLoading || Boolean(isError)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <div className="h-[320px] w-full animate-pulse rounded-3xl bg-white/10" />
              </div>
              <div className="flex h-full flex-col gap-4 lg:col-span-2">
                <div className="h-40 animate-pulse rounded-3xl bg-white/10" />
                <div className="h-20 animate-pulse rounded-3xl bg-white/10" />
              </div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-destructive/40 bg-destructive/10 p-10 text-center text-destructive-foreground">
              <p className="text-lg font-semibold">Unable to load stock insights</p>
              <p className="max-w-md text-sm text-destructive-foreground/80">
                {(error as Error)?.message ?? "An unexpected error occurred while contacting the forecasting API."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90"
              >
                <RefreshCcw size={16} /> Retry
              </button>
            </div>
          ) : activeStock ? (
            <>
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <StockChart values={activeStock.closing_values} stroke={accentColor} name={activeStock.ticker} />
                </div>
                <div className="flex flex-col justify-between gap-6 lg:col-span-2">
                  <PredictionSummary
                    ticker={activeStock.ticker}
                    dailyChange={activeStock.daily_change}
                    confidence={activeStock.prediction}
                  />
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200/90 backdrop-blur">
                    <p className="font-semibold uppercase tracking-[0.32em] text-slate-300/80">
                      closing values snapshot
                    </p>
                    <p className="mt-3 text-4xl font-bold text-white">
                      {latestClose !== null ? `$${latestClose.toFixed(2)}` : "No data"}
                    </p>
                    <p className="mt-3 leading-relaxed text-slate-200/70">
                      This chart visualizes the last 50 daily closes. Use it to
                      understand current momentum and confirm the model&apos;s
                      directional call before making moves.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-200/80 backdrop-blur">
              <p className="text-lg font-semibold text-white">
                No symbols returned from the predictive API
              </p>
              <p className="mt-2 text-sm text-slate-300/80">
                Add tickers to your data source to see real-time analysis here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
