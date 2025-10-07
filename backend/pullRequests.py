import json
import finnhub
import requests
import os

finnhub_client = finnhub.Client(api_key='d3gjgopr01qpep675jm0d3gjgopr01qpep675jmg')
api_key = "6FSASNSYFY0JHJWD"

tickers = ["AAPL", "AMZN", "BA", "BAC", "CAT", "CVX", "GE", "GOOG", "GS", "INTC", "JNJ", "JPM", "KO", "MA", "META", "MRNA", "MSFT", "NKE", "NVDA", "PEP", "PFE", "SBUX", "TSLA", "V", "WMT", "XON"]

for ticker in tickers:
    insider_sentiment = finnhub_client.stock_insider_sentiment(ticker, "2022-01-01", "2025-09-30")

    directory = "HistoricalData"
    filename1 = f"{ticker}_Insider_Sentiment.json"
    filepath1 = os.path.join(directory, filename1)
    filename2 = f"{ticker}_Historical.json"
    filepath2 = os.path.join(directory, filename2)

    with open(filepath1, 'w') as f:
        json.dump(insider_sentiment, f)
        print("saved data 1")

    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={ticker}&interval=5min&apikey=" + api_key
    r = requests.get(url)
    data = r.json()

    with open(filepath2, 'w') as f:
        json.dump(data, f)
        print("saved data 2")