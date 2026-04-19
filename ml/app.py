from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)


X = np.array([[1], [2], [3], [4], [5], [10], [15], [20]])
y = np.array([2, 4, 6, 8, 10, 20, 30, 40])

model = LinearRegression()
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    length = data.get("length", 0)

    prediction = model.predict([[length]])[0]

    return jsonify({
        "predicted_wait": round(float(prediction), 2)
    })

@app.route('/')
def home():
    return "ML Server Running 🚀"

if __name__ == "__main__":
    app.run(port=5001)