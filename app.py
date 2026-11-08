from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
MODEL = "llama3.2:1b"

SYSTEM_PROMPT = (
    "You are WHITE HOLE, a helpful personal AI assistant created by Sushim. "
    "Be friendly, clear, and honest. If you do not know something, say so."
)

@app.get("/")
def home():
    return render_template("index.html")

@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    messages = data.get("messages", [])
    if not isinstance(messages, list):
        return jsonify(error="Invalid message format."), 400

    ollama_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for item in messages[-20:]:
        role = item.get("role")
        content = item.get("content", "")
        if role in ("user", "assistant") and isinstance(content, str):
            ollama_messages.append({
                "role": "assistant" if role == "assistant" else "user",
                "content": content[:6000]
            })

    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": MODEL, "messages": ollama_messages, "stream": False},
            timeout=120
        )
        response.raise_for_status()
        result = response.json()
        answer = result.get("message", {}).get("content", "").strip()
        if not answer:
            return jsonify(error="The AI returned an empty response."), 502
        return jsonify(reply=answer)
    except requests.exceptions.ConnectionError:
        return jsonify(error="Ollama is not running. Open the Ollama app, then try again."), 503
    except requests.exceptions.Timeout:
        return jsonify(error="WHITE HOLE took too long to respond. Please try again."), 504
    except requests.exceptions.RequestException as exc:
        return jsonify(error=f"Ollama error: {exc}"), 502

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
