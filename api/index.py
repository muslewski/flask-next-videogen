import os
from flask import Flask,request, jsonify, send_file
from flask_cors import CORS

from api.constants import AUDIO_DIR
from api.eleven_labs import check_client_limit, generate_blank_audio, generate_eleven_labs_audio
from pydub import AudioSegment
import uuid

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
        
        voice = item.get("voice")  # Get the voice object safely
        voice_id = voice.get("id") if voice else None  # Safely extract voice_id
        
        # Check if audio file already exists
        file_name = item.get("audioFileName")
        duration = item.get("audioDuration")
        
        if file_name and duration:
            continue
        elif not voice_id and duration:
            # Generate blank audio
            file_name, duration = generate_blank_audio(duration, item_id)
        else:
            # Generate Eleven Labs audio
            file_name, duration  = generate_eleven_labs_audio(item_text, item_id, voice_id)
        
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

@app.route("/api/eleven-labs-credits")
def check_eleven_labs_limit():
    character_count, character_limit = check_client_limit()
    
    return jsonify({"characterCount": character_count, "characterLimit": character_limit})


@app.route("/api/combine-audio", methods=["POST"])
def combine_audio():
    data = request.json
    text_items = data.get("textItems")
    
    if not text_items:
        return jsonify({"status": "error", "message": "No text items provided"}), 400
    
    try:
        combined_audio = AudioSegment.silent(duration=0)  # Start with a silent audio segment
        
        for item in text_items:
            audio_file_name = item.get("audioFileName")
            if not audio_file_name:
                return jsonify({"status": "error", "message": f"Missing audioFileName for item {item}"}), 400
            
            audio_file_path = os.path.join(AUDIO_DIR, audio_file_name)
            if not os.path.exists(audio_file_path):
                return jsonify({"status": "error", "message": f"Audio file {audio_file_name} not found"}), 404
            
            # Load the audio file and append it to the combined audio
            audio_segment = AudioSegment.from_file(audio_file_path)
            combined_audio += audio_segment
        
        # Save the combined audio to a file
        combined_audio_file_name = f"combined_{uuid.uuid4()}.mp3"
        combined_audio_file_path = os.path.join(AUDIO_DIR, combined_audio_file_name)
        combined_audio.export(combined_audio_file_path, format="mp3")
        
        return jsonify({
            "status": "success",
            "message": "Audio files combined successfully",
            "combinedAudioFileName": combined_audio_file_name
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
            