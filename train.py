import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

def main():
    print("Generating synthetic patient data...")
    # Features: Age, Glucose, BloodPressure, BMI, Fatigue (0 or 1), Fever (0 or 1)
    np.random.seed(42)
    n_samples = 1000
    
    age = np.random.randint(18, 90, n_samples)
    glucose = np.random.normal(100, 30, n_samples)
    blood_pressure = np.random.normal(120, 15, n_samples)
    bmi = np.random.normal(25, 5, n_samples)
    fatigue = np.random.randint(0, 2, n_samples)
    fever = np.random.randint(0, 2, n_samples)
    
    # Target: Risk Level (0: Low, 1: Medium, 2: High)
    # Simple logic to make it learnable
    risk_score = (age * 0.2) + (glucose * 0.5) + (blood_pressure * 0.3) + (bmi * 0.4) + (fatigue * 20) + (fever * 30)
    
    # Binning into 3 categories
    risk = pd.qcut(risk_score, q=3, labels=[0, 1, 2])
    
    X = pd.DataFrame({
        'Age': age,
        'Glucose': glucose,
        'BloodPressure': blood_pressure,
        'BMI': bmi,
        'Fatigue': fatigue,
        'Fever': fever
    })
    y = risk
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    accuracy = model.score(X_test, y_test)
    print(f"Model trained with accuracy: {accuracy:.2f}")
    
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, 'model/risk_model.pkl')
    print("Model saved to model/risk_model.pkl")

if __name__ == '__main__':
    main()
