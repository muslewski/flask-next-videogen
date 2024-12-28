import os
from flask import Flask,request, jsonify, send_file
from flask_cors import CORS

from api.chat_gpt import summarize_to_one_word
from api.constants import AUDIO_DIR
from api.eleven_labs import check_client_limit, generate_blank_audio, generate_eleven_labs_audio
from pydub import AudioSegment
import uuid

from api.pixabay_api import find_pixabay_video

app = Flask(__name__)
CORS(app)

@app.route("/api/generate-audio", methods=["POST"])
def generate_audio():
    data = request.json
    items = data.get("items")
    
    new_items = items.copy()
    for item in new_items:
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
    
    return jsonify({"status": "success", "newItems": new_items})

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
    items = data.get("items")
    
    if not items:
        return jsonify({"status": "error", "message": "No text items provided"}), 400
    
    try:
        combined_audio = AudioSegment.silent(duration=0)  # Start with a silent audio segment
        
        for item in items:
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
            
            
@app.route("/api/find-word-chat-gpt", methods=["POST"])
def find_word_chat_gpt():
    data = request.json
    message = data["finalMessage"]
    
    words = summarize_to_one_word(message)
    
    return jsonify({"status": "success", "queryTags": words})


@app.route("/api/find-video-pixabay", methods=['POST'])
def find_video_pixabay_route():
    data = request.json
    query_tag = data.get("queryTag")
    page = data.get("page", 1)
    
    # Check if queryTag is provided
    if not query_tag:
        return jsonify({"status": "error", "message": "No queryTag provided"}), 400
    
    # find video on pixabay
    video_objects = find_pixabay_video(query_tag, page=page)
    
    return jsonify({
        "status": "success",
        "message": "Video found",
        "videoObjects": video_objects
        })