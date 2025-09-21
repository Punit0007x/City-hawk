from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import base64
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import google.generativeai as genai
import os
from dotenv import load_dotenv

# --- API Key Loading ---
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found! Please set it in your .env file (for local use) or in Render environment variables.")

# --- Setup Gemini & Other Models ---
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")

# --- Flask App ---
app = Flask(__name__)
CORS(app)

@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    if not request.json or 'image_data' not in request.json:
        return jsonify({"status": "error", "message": "No image data provided"}), 400

    image_data = request.json['image_data']
    
    try:
        image_bytes = io.BytesIO(base64.b64decode(image_data))
        image = Image.open(image_bytes).convert("RGB")
    except Exception as e:
        return jsonify({"status": "error", "message": f"Invalid image data: {str(e)}"}), 400

    try:
        inputs = processor(image, return_tensors="pt")
        output = blip_model.generate(**inputs, max_length=100)
        blip_caption = processor.decode(output[0], skip_special_tokens=True)
    except Exception as e:
        return jsonify({"status": "error", "message": f"BLIP model error: {str(e)}"}), 500

    try:
        prompt = (
            f"Image context: {blip_caption}\n\n"
            "You are an assistant generating a civic issue report for India. "
            "Write the description in clear, human-like bullet points. "
            "Each point should highlight a specific aspect of the issue (e.g., what the problem is, where it might occur, and its possible impact). "
            "Keep the tone natural and informative."
        )
        response = model.generate_content(prompt)
        description = response.text if response and response.text else "Could not generate a description."
    except Exception as e:
        return jsonify({"status": "error", "message": f"Gemini API error: {str(e)}"}), 500

    return jsonify({"status": "success", "description": description})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
