
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "LLMAPI backend is running"
    }), 200


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()

    if not data or not data.get("prompt", "").strip():
        return jsonify({
            "status": "error",
            "message": "A prompt is required"
        }), 400

    prompt = data["prompt"].strip()

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )

        response.raise_for_status()
        result = response.json()

        return jsonify({
            "status": "success",
            "prompt": prompt,
            "response": result["response"]
        }), 200

    except requests.RequestException as error:
        return jsonify({
            "status": "error",
            "message": f"LLM request failed: {str(error)}"
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
