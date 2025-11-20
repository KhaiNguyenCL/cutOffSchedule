# backend/app.py
from flask import Flask, jsonify, request # pyright: ignore[reportMissingImports]
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Cho phép frontend React truy cập API

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Python backend!"})

@app.route('/api/hello')
def hello():
    return jsonify({"msg": "Hello from Flask backend!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
