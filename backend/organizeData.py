#Inputs within the first layer of a network
#1-5. Open, High, Low, Close, Volume
#6-10. Daily Return, SMA 5, SMA 20, EMA 10, EMA 50
#11-15. MA Diff, RSI 14, MACD, MACD signal, BB PCT
#16-20. ATR 14, Volatility 5, Volume Change, MSPR, Market Return

import json
import pandas as pd
import numpy as np
import os

tickers = ["AAPL", "AMZN", "BA", "BAC", "CAT", "CVX", "GE", "GOOG", "GS", "INTC", "JNJ", "JPM", "KO", "MA", "META", "MRNA", "MSFT", "NKE", "NVDA", "PEP", "PFE", "SBUX", "TSLA", "V", "WMT", "XON"]

for ticker in tickers:
    with open(f"HistoricalData/{ticker}_Historical.json", "r") as f:
        historical_data = json.load(f)

    time_series = historical_data[("Time Series (Daily)")]

    df = pd.DataFrame.from_dict(time_series, orient="index")
    df = df.rename(columns={
        "1. open": "open",
        "2. high": "high",
        "3. low": "low",
        "4. close": "close",
        "5. volume": "volume"
    }).astype(float)

    df = df.sort_index()

    #BASE FEATURES
    df["price_change"] = df["close"] - df["open"]
    df["range"] = df["high"] - df["low"]
    df["volatility"] = df["range"] / df["open"]
    df["return_pct"] = df["close"].pct_change()
    df["volume_change"] = df["volume"].pct_change()

    #MOVING AVERAGES
    df["SMA_5"] = df["close"].rolling(window=5).mean()
    df["SMA_10"] = df["close"].rolling(window=10).mean()
    df["EMA_10"] = df["close"].ewm(span=10, adjust=False).mean()
    df["EMA_20"] = df["close"].ewm(span=20, adjust=False).mean()

    #RSI 14 DAY
    delta = df["close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(window=14, min_periods=14).mean()
    avg_loss = loss.rolling(window=14, min_periods=14).mean()
    rs = avg_gain / avg_loss
    df["RSI_14"] = 100 - (100 / (1 + rs))

    #MACD
    ema12 = df["close"].ewm(span=12, adjust=False).mean()
    ema26 = df["close"].ewm(span=26, adjust=False).mean()
    df["MACD"] = ema12 - ema26
    df["MACD_signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

    #BOLLINGER BANDS
    sma20 = df["close"].rolling(window=20).mean()
    std20 = df["close"].rolling(window=20).std()
    df["BB_upper"] = sma20 + (2 * std20)
    df["BB_lower"] = sma20 - (2 * std20)

    #ROLLING VITALITY
    df["rolling_volatility"] = df["return_pct"].rolling(window=10).std()

    #TARGET
    df["target"] = (df["close"].diff() > 0).astype(int)

    #CLEAN DATA
    df = df.dropna()

    #SELECT FEATURES
    features = ["open", "high", "low", "close", "volume", "price_change", "range", "return_pct", "volume_change", "volatility", "SMA_5", "SMA_10", "EMA_10", "EMA_20", "RSI_14", "MACD", "MACD_signal", "BB_upper", "BB_lower", "rolling_volatility"]

    train_x = df[features].values
    train_y = df["target"].values

    train_x = train_x[-51:]
    train_y = train_y[-50:]
    train_x = train_x[:-1]

    directory = "DataTraining"
    filename1 = f"{ticker}_x_train.npy"
    filename2 = f"{ticker}_y_train.npy"
    filepath1 = os.path.join(directory, filename1)
    filepath2 = os.path.join(directory, filename2)

    np.save(filepath1, train_x)
    np.save(filepath2, train_y)


