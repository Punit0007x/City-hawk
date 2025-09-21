from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import base64
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import google.generativeai as genai
import os
from dotenv import load_dotenv

# --- Robust API Key Loading ---
GEMINI_API_KEY = None
print("INFO: Attempting to load API key...")

# Method 1: Standard .env loading (Best Practice)
try:
    if os.path.exists('.env'):
        print("INFO: .env file found. Loading variables.")
        load_dotenv()
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    else:
        print("WARNING: .env file not found in the current directory.")
except Exception as e:
    print(f"ERROR: An error occurred while loading .env file: {e}")

# Method 2: Manual Fallback (If standard method fails)
if not GEMINI_API_KEY:
    print("INFO: API key not found in environment. Attempting manual fallback...")
    try:
        with open('.env', 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    GEMINI_API_KEY = line.strip().split('=', 1)[1]
                    # Remove quotes if they exist
                    if GEMINI_API_KEY.startswith('"') and GEMINI_API_KEY.endswith('"'):
                        GEMINI_API_KEY = GEMINI_API_KEY[1:-1]
                    print("INFO: Successfully loaded API key using manual fallback.")
                    break
    except FileNotFoundError:
        print("ERROR: Manual fallback failed. .env file does not exist.")
    except Exception as e:
        print(f"ERROR: An error occurred during manual fallback: {e}")

# Final Check: If key is still not found, raise an error.
if not GEMINI_API_KEY:
    error_message = (
        "FATAL: GEMINI_API_KEY could not be loaded after all attempts.\n"
        "Please double-check the following:\n"
        "1. The file is named EXACTLY '.env' (with the dot).\n"
        "2. It is in the SAME directory as this script.\n"
        "3. Its content is EXACTLY: GEMINI_API_KEY=\"YOUR_KEY_HERE\"\n"
        "4. The file has a blank line at the end."
    )
    raise ValueError(error_message)

print("SUCCESS: Gemini API Key loaded successfully.")

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
    print("INFO: Starting Flask server...")
    app.run(host="0.0.0.0", port=5000, debug=True)

