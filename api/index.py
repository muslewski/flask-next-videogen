from concurrent.futures import ThreadPoolExecutor
import os
from flask import Flask,request, jsonify, send_file
from flask_cors import CORS

from api.chat_gpt import summarize_to_one_word
from api.constants import AUDIO_DIR, OUTPUT_DIR, VIDEO_DIR
from api.eleven_labs import check_client_limit, generate_blank_audio, generate_eleven_labs_audio
import uuid

from api.helper import combine_media_together
from api.pixabay_api import find_pixabay_video
from api.videos import save_video

app = Flask(__name__)
CORS(app)

cpu_count = os.cpu_count()
executor = ThreadPoolExecutor(max_workers=(2 * cpu_count) + 1)
tasks = {}

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

@app.route("/api/get-video/<video_file_name>")
def get_video(video_file_name):
    video_file_path = os.path.join(VIDEO_DIR, video_file_name)
    return send_file(video_file_path)

@app.route("/api/get-output/<output_file_name>")
def get_output(output_file_name):
    output_file_path = os.path.join(OUTPUT_DIR, output_file_name)
    return send_file(output_file_path)


@app.route("/api/remove-audio/<audio_file_name>", methods=["DELETE"])
def remove_audio(audio_file_name):
    audio_file_path = os.path.join(AUDIO_DIR, audio_file_name)
    
    if os.path.exists(audio_file_path):
        os.remove(audio_file_path)
        return jsonify({"status": "success", "message": "Audio file removed"})
    else:
        return jsonify({"status": "error", "message": "Audio file not found"})
    
    
@app.route("/api/remove-video/<video_file_name>", methods=["DELETE"])
def remove_video(video_file_name):
    video_file_path = os.path.join(VIDEO_DIR, video_file_name)
    
    if os.path.exists(video_file_path):
        os.remove(video_file_path)
        return jsonify({"status": "success", "message": "Video file removed"})
    else:
        return jsonify({"status": "error", "message": "Video file not found"})
    
@app.route("/api/remove-output/<output_file_name>", methods=["DELETE"])
def remove_output(output_file_name):
    output_file_path = os.path.join(OUTPUT_DIR, output_file_name)
    
    print("output_file_path", output_file_path)
    
    if os.path.exists(output_file_path):
        os.remove(output_file_path)
        return jsonify({"status": "success", "message": "Output file removed"})
    else:
        return jsonify({"status": "error", "message": "Output file not found"})

@app.route("/api/eleven-labs-credits")
def check_eleven_labs_limit():
    character_count, character_limit = check_client_limit()
    
    return jsonify({"characterCount": character_count, "characterLimit": character_limit})


@app.route("/api/combine-media", methods=["POST"])
def combine_media():
    data = request.json
    items = data.get("items")
    
    if not items:
        return jsonify({"status": "error", "message": "No text items provided"}), 400
    
    task_id = uuid.uuid4()
    tasks[task_id] = {"status": "processing"}
    executor.submit(combine_media_together, items, task_id, tasks, executor)
    return jsonify({"status": "success", "message": "Media processing started in background", "taskId": task_id}), 202

@app.route("/api/task-status/<task_id>", methods=["GET"])
def task_status(task_id):
    try: 
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        return jsonify({"status": "error", "message": "Invalid task ID"}), 404
    
    task = tasks.get(task_uuid)
    if not task:
        return jsonify({"status": "error", "message": "Invalid task ID"}), 404
    return jsonify(task)
            
            
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
    video_objects, total_results = find_pixabay_video(query_tag, page=page)
    
    return jsonify({
        "status": "success",
        "message": "Video found",
        "videoObjects": video_objects,
        "totalResults": total_results
        })
    

@app.route("/api/save-video", methods=["POST"])
def save_video_route():
    data = request.json
    # change id to uuid
    id = uuid.uuid4()
    video_url = data.get("videoUrl")
    
    if not video_url:
        return jsonify({"status": "error", "message": "No videoUrl provided"}), 400
    
    try:
        video_file_name = save_video(id, video_url)
        return jsonify({"status": "success", "message": "Video saved successfully", "videoFileName": video_file_name})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500