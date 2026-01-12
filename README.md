# TrafficTrend - Foot Traffic Prediction & Staffing Application

This project is a full-stack application designed to forecast pedestrian foot traffic and optimize staffing schedules. It consists of an Angular frontend, a Spring Boot backend, and a Python Flask microservice for machine learning predictions.

## Project Structure

```
SpringBootAngularProj/
├── angular-frontend/        # Angular 17+ Frontend Application
├── SpringBootBackend/       # Spring Boot Java Backend (API Gateway & Business Logic)
└── PythonBackend/           # Python Flask Microservice (ML & Forecasting)
```

## Prerequisites

- **Java JDK 17+**
- **Node.js 18+ & npm**
- **Python 3.9+**
- **Angular CLI** (`npm install -g @angular/cli`)

## Setup & Running

### 1. Python Backend (ML Microservice)
This service handles traffic predictions using Prophet and TensorFlow.

**Dependencies:**
- flask
- prophet
- pandas
- numpy
- tensorflow
- joblib

**Instructions:**
```bash
cd PythonBackend
# Recommended: Create and activate a virtual environment
# python -m venv venv
# source venv/bin/activate  (or venv\Scripts\activate on Windows)

pip install flask prophet pandas numpy tensorflow joblib

# Run the server (Defaults to port 5002)
python main.py
```

### 2. Spring Boot Backend
The main backend service that interfaces with the database and the Python microservice.

**Instructions:**
```bash
cd SpringBootBackend/SpringBootBackend

# Build and Run
./gradlew bootRun
```
The server will start on port `8080` (default).

### 3. Angular Frontend
The user interface to view forecasts and staffing recommendations.

**Instructions:**
```bash
cd angular-frontend

# Install dependencies
npm install

# Run the development server
ng serve
```
Navigate to `http://localhost:4200` to view the application.

## CI/CD Service
A `Jenkinsfile` is included in the root directory to automate the build process for both the frontend and backend components.

## API Overview
- **POST /api/Auth/register:** User registration.
- **POST /api/Auth/login:** User authentication.
- **POST /api/Survey/forecast:** Get traffic forecasts (Proxies to Python service).
- **POST /api/Survey/staffing:** Get staffing recommendations (Proxies to Python service).
