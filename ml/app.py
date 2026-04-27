import numpy as np
from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

X = np.array([
    [1,1],[2,1],[3,1],
    [5,2],[10,2],[15,3],
    [20,4],[25,5],[30,5]
])

y = np.array([1,2,3,3,5,6,7,8,10])

model = LinearRegression()
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    length = data.get("length", 0)
    serviceRate = data.get("serviceRate", 1)

    prediction = model.predict([[length, serviceRate]])[0]

    return jsonify({
        "predicted_wait": round(float(prediction), 2)
    })

@app.route('/')
def home():
    return "ML Server Running"

if __name__ == "__main__":
    app.run(port=5001)