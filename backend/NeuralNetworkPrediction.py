import json
import joblib
import tensorflow as tf
import numpy as np
import os
import pandas as pd
from fastapi import FastAPI

app = FastAPI()

tickers = ["AAPL", "AMZN", "BA", "BAC", "CAT", "CVX", "GE", "GOOG", "GS", "INTC", "JNJ", "JPM", "KO", "MA", "META", "MRNA", "MSFT", "NKE", "NVDA", "PEP", "PFE", "SBUX", "TSLA", "V", "WMT", "XON"]

model_filename = "StockTraderNetwork2.keras"
scaler_filename = os.path.join("DataTraining", "scaler.pkl")
stock_network = tf.keras.models.load_model(model_filename)

pred_filepath = os.path.join("DataTraining", "x_pred.npy")
x_pred = np.load(pred_filepath)
scaler = joblib.load(scaler_filename)
x_pred = scaler.transform(x_pred)

predictions = stock_network.predict(x_pred)

for ticker, p in zip(tickers, predictions.flatten()):
    if p < .5:
        print(f"{ticker}: {(1-p)*100:.2f}% chance to drop")
    else:
        print(f"{ticker}: {p*100:.2f}% chance to jump")


@app.get("/stock_prediction")
def stock_prediction():

    data = []

    for t, p in zip(tickers, predictions.flatten()):
        print(t, p)
        estimate = 1
        if p < .5:
            p = 1-p
            estimate = 0
        p_string = f"{p*100:.2f}"

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
        df = df[-50:]

        entry = {
            "ticker": t,
            "daily_change": estimate,
            "prediction": p_string,
            "closing_values": df["close"].tolist()
        }
        data.append(entry)
    return data