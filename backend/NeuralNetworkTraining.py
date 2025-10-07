import tensorflow as tf
import numpy as np
import os
from sklearn.utils import shuffle
from sklearn.preprocessing import StandardScaler

x_train = []
y_train = []

tickers = ["AAPL", "AMZN", "BA", "BAC", "CAT", "CVX", "GE", "GOOG", "GS", "INTC", "JNJ", "JPM", "KO", "MA", "META", "MRNA", "MSFT", "NKE", "NVDA", "PEP", "PFE", "SBUX", "TSLA", "V", "WMT", "XON"]
for ticker in tickers:
    x_temp = np.load(os.path.join("DataTraining", f"{ticker}_x_train.npy"))
    y_temp = np.load(os.path.join("DataTraining", f"{ticker}_y_train.npy"))
    x_train.append(x_temp)
    y_train.append(y_temp)

x_train = np.vstack(x_train)
y_train = np.concatenate(y_train)
x_train, y_train = shuffle(x_train, y_train, random_state=42)
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)

print(x_train.shape)
print(y_train.shape)

network_filename = "StockTraderNetwork2.keras"

if not os.path.exists(network_filename):
    stock_network = tf.keras.models.Sequential()
    stock_network.add(tf.keras.layers.Dense(32, activation='relu', input_shape=(20,)))
    #stock_network.add(tf.keras.layers.Dense(32, activation='relu'))
    stock_network.add(tf.keras.layers.Dense(16, activation='relu'))
    stock_network.add(tf.keras.layers.Dense(1, activation='sigmoid'))

    stock_network.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    stock_network.fit(x_train, y_train, epochs=50, batch_size=24)

    stock_network.save(network_filename)
else:
    stock_network = tf.keras.models.load_model(network_filename)