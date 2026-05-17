from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Load model if it exists
MODEL_PATH = 'model/risk_model.pkl'
model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not found. Please train the model first.'}), 500
        
    try:
        data = request.json
        
        # Extract features
        age = float(data.get('age', 0))
        glucose = float(data.get('glucose', 0))
        blood_pressure = float(data.get('bloodPressure', 0))
        bmi = float(data.get('bmi', 0))
        fatigue = int(data.get('fatigue', 0))
        fever = int(data.get('fever', 0))
        
        # Prepare for prediction
        input_data = pd.DataFrame([{
            'Age': age,
            'Glucose': glucose,
            'BloodPressure': blood_pressure,
            'BMI': bmi,
            'Fatigue': fatigue,
            'Fever': fever
        }])
        
        # Predict
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        
        # Format output
        categories = ['Low Risk', 'Medium Risk', 'High Risk']
        result_category = categories[prediction]
        max_prob = float(probabilities[prediction] * 100)
        
        return jsonify({
            'category': result_category,
            'probability': round(max_prob, 2),
            'all_probabilities': [float(p) for p in probabilities]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
