from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found!")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app)

@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    if not request.json or 'image_data' not in request.json:
        return jsonify({"status": "error", "message": "No image data provided"}), 400

    image_data = request.json['image_data']

    try:
        prompt = (
            "You are an assistant generating a civic issue report for India. "
            "Write the description in clear, human-like bullet points. "
            "Each point should highlight a specific aspect of the issue (e.g., what the problem is, where it might occur, and its possible impact). "
            "Keep the tone natural and informative."
        )
        response = model.generate_content([
            {"mime_type": "image/jpeg", "data": base64.b64decode(image_data)},
            prompt
        ])
        description = response.text if response and response.text else "Could not generate a description."
    except Exception as e:
        return jsonify({"status": "error", "message": f"Gemini API error: {str(e)}"}), 500

    return jsonify({"status": "success", "description": description})

if __name__ == "__main__":
    print("INFO: Starting Flask server...")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
