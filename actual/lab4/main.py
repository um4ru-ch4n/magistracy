import matplotlib.pyplot as plt
import numpy as np
import keras
import tensorflow as tf
from sklearn.metrics import mean_squared_error

def f(x):
    return np.log(x)-x+1.8

x = np.linspace(1, 5, 100)

fig, ax = plt.subplots()

ax.plot(x, f(x), linewidth=2.0)

ax.set(xlim=(0, 8), xticks=np.arange(1, 8),
        ylim=(0, 8), yticks=np.arange(1, 8))

ax.set_xlabel('x')
ax.set_ylabel('y')

plt.show()

tf.keras.layers.Dense

model = Sequential(
    [
        Dense(64, activation="relu", input_shape=(1,), name="hidden_dense_1"),
        Dense(32, activation="tanh", name="hidden_dense_2"),
        Dense(16, activation="relu", name="hidden_dense_3"),
        Dense(8, activation="tanh", name="hidden_dense_4"),
        Dense(1, activation='linear', name="output"),
    ]
)
model.compile(loss='mse', optimizer='sgd', metrics=['mse'])

print(mean_squared_error(y_test, y_pred))