import { sampleStockPayload } from "@/mock/sample-stock-data";
import { z } from "zod";

const stockPredictionSchema = z.object({
  ticker: z.string().min(1),
  daily_change: z.number().int().min(0).max(1),
  prediction: z.string().min(1),
  closing_values: z.array(z.number()),
});

const stockPredictionArraySchema = z.array(stockPredictionSchema);

export type StockPrediction = z.infer<typeof stockPredictionSchema>;

const STOCK_API_URL = import.meta.env.VITE_STOCK_API_URL?.trim();

function normalizeStockPayload(payload: unknown): StockPrediction[] {
  const parsed = stockPredictionArraySchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("Received unexpected data shape from stock API");
  }

  return parsed.data.map((entry) => ({
    ...entry,
    closing_values: entry.closing_values.slice(-50),
  }));
}

const FALLBACK_STOCK_DATA = (() => {
  try {
    return normalizeStockPayload(sampleStockPayload);
  } catch (error) {
    console.error("Invalid sample stock payload", error);
    return [] as StockPrediction[];
  }
})();

export async function fetchStockPredictions(): Promise<StockPrediction[]> {
  if (!STOCK_API_URL) {
    if (FALLBACK_STOCK_DATA.length === 0) {
      throw new Error(
        "Stock API URL is not configured and no fallback data is available.",
      );
    }

    console.warn(
      "VITE_STOCK_API_URL is not set. Using embedded sample stock data instead.",
    );
    return FALLBACK_STOCK_DATA;
  }

  try {
    const response = await fetch(STOCK_API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to load stock data (${response.status})`);
    }

    const payload = await response.json();
    return normalizeStockPayload(payload);
  } catch (error) {
    console.warn("Falling back to sample stock data due to API error.", error);
    if (FALLBACK_STOCK_DATA.length === 0) {
      throw error instanceof Error ? error : new Error(String(error));
    }

    return FALLBACK_STOCK_DATA;
  }
}

export function getPredictionDirectionLabel(dailyChange: number): "higher" | "lower" {
  return dailyChange === 0 ? "lower" : "higher";
}
