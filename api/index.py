import os
from pydoc import text
from flask import Flask,request, jsonify, send_file
from flask_cors import CORS

from api.constants import AUDIO_DIR
from api.eleven_labs import generate_eleven_labs_audio

app = Flask(__name__)
CORS(app)

@app.route("/api/generate-audio", methods=["POST"])
def generate_audio():
    data = request.json
    text_items = data.get("textItems")
    
    print(text_items)
    
    new_text_items = text_items.copy()
    for item in new_text_items:
        # Extract item values
        item_id = item.get("id")
        item_text = item.get("text")
        
        # Check if audio file already exists
        file_name = item.get("audioFileName")
        duration = item.get("audioDuration")
        
        if file_name and duration:
            continue
        else:
            # Generate Eleven Labs audio
            file_name, duration  = generate_eleven_labs_audio(item_text, item_id)
        
        # Update item values
        item["audioFileName"] = file_name
        item["audioDuration"] = duration
    
    return jsonify({"status": "success", "newTextItems": new_text_items})

@app.route("/api/get-audio/<audio_file_name>")
def get_audio(audio_file_name):
    audio_file_path = os.path.join(AUDIO_DIR, audio_file_name)
    return send_file(audio_file_path)

@app.route("/api/remove-audio/<audio_file_name>", methods=["DELETE"])
def remove_audio(audio_file_name):
    audio_file_path = os.path.join(AUDIO_DIR, audio_file_name)
    
    if os.path.exists(audio_file_path):
        os.remove(audio_file_path)
        return jsonify({"status": "success", "message": "Audio file removed"})
    else:
        return jsonify({"status": "error", "message": "Audio file not found"})