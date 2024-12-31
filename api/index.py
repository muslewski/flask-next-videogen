from calendar import c
from concurrent.futures import ThreadPoolExecutor
import os
from flask import Flask,request, jsonify, send_file
from flask_cors import CORS

from api.chat_gpt import summarize_to_one_word
from api.constants import AUDIO_DIR, CHATGPT_POTENTIAL_INSTRUCTION, OUTPUT_DIR, VIDEO_DIR
from api.eleven_labs import check_client_limit, generate_blank_audio, generate_eleven_labs_audio
import uuid

from api.helper import combine_media_together
from api.pixabay_api import find_pixabay_video
from api.videos import auto_find_videos_task, save_video

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

@app.route("/api/generate-single-audio", methods=["POST"])
def generate_single_audio():
    data = request.json
    item = data.get("item")
    
    # Extract item values
    item_id = item.get("id")
    item_text = item.get("text")
    
    voice = item.get("voice")
    
    voice_id = voice.get("id") if voice else None
    
    # generate blank
    if not voice_id:
        file_name, duration = generate_blank_audio(item.get("audioDuration"), item_id)
    else:
        # Generate Eleven Labs audio
        file_name, duration = generate_eleven_labs_audio(item_text, item_id, voice_id)
    
    # Update item values
    item["audioFileName"] = file_name
    item["audioDuration"] = duration
    
    return jsonify({"status": "success", "newItem": item})
    
    

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
    

@app.route("/api/auto-find-videos", methods=["POST"])
def auto_find_videos():
    data = request.json
    items = data.get("items")
    
    if not items:
        return jsonify({"status": "error", "message": "No items provided"}), 400
    
    task_id = uuid.uuid4()
    tasks[task_id] = {"status": "processing"}
    executor.submit(auto_find_videos_task, items, task_id, tasks)
    return jsonify({"status": "success", "message": "Auto-find videos started in background", "taskId": task_id}), 202
    

# @app.route("/api/auto-find-videos", methods=["POST"])
# def auto_find_videos():
#     data = request.json
#     items = data.get("items")
    
#     used_video_ids = set()
#     for item in items:
#          # Check if 'video' key exists in the item
#         if "video" in item:
#             video = item["video"]
#             # Check if the 'video' value is not None and contains the 'id' key
#             if video is not None and "id" in video:
#                 # Add the video ID to the set of used video IDs
#                 used_video_ids.add(video["id"])
    
#     if not items:
#         return jsonify({"status": "error", "message": "No items provided"}), 400
    
#     updated_items = items.copy()
#     for item in updated_items:
#         # skip if video already exists
#         if item.get("video"):
#             continue
        
#         #Extract item values
#         item_text = item.get("text")
#         item_id = item.get("id")
#         audio_duration = item.get("audioDuration")
        
#         # Check if audio duration is provided
#         if not audio_duration:
#             print(f"No audio duration found for item {item_id}")
#             # Skip to the next item
#             continue
        
#         # define empty Choosen Video object
#         choosen_video = None
        
#         # Check if query tags are found
#         for _ in range(5):
#             tags = summarize_to_one_word(CHATGPT_POTENTIAL_INSTRUCTION + " " + item_text + " ")
#             # Ensure query tags are not longer than 16 characters
#             query_tags = [tag for tag in tags if len(tag) <= 16]
#             if query_tags:
#                 break
        
#         if not query_tags:
#             print(f"No query tags found for item {item_id}")
#             # Skip to the next item
#             continue 
        
#         print("Query tags:", query_tags)
        
#         # Loop through query tags to find video
#         for query_tag in query_tags:
#             page = 1
#             video_objects, total_results = find_pixabay_video(query_tag, max_results=4, page=page)
#             total_pages = (total_results + 3) // 4 # Calculate total number of pages
            
#             while page <= total_pages:
#                 if total_results == 0:
#                     break
                
#                 # Check if any video found and not already used
#                 for video_object in video_objects:
#                     video_id = video_object["id"]
#                     video_duration = video_object["videoDuration"]
#                     if video_id not in used_video_ids and video_duration > audio_duration:
#                         choosen_video = video_object
#                         used_video_ids.add(video_id)
#                         break
                    
#                 # If video is found, break out of the loop of pages
#                 if choosen_video:
#                     break
                
#                 # Try the next page
#                 page += 1
#                 video_objects, total_results = find_pixabay_video(query_tag, max_results=4, page=page)
            
#             # If a video is found, break out of the loop of query tags
#             if choosen_video:
#                 break
            
#         # If no video is found, skip to the next item
#         if not choosen_video:
#             print(f"No suitable video found for item {item_id}")
#             # Skip to the next item
#             continue
            
#         # Get choosen video url
#         choosen_video_url = choosen_video["videos"][0]["url"] # Get best quality video
#         # Generate filename id
#         filename_id = uuid.uuid4()
        
#         # Save video
#         video_file_name = save_video(filename_id, choosen_video_url)
        
#         # Update choosen video object with video file name and duration
#         choosen_video["videoFileName"] = video_file_name
       
#         # Update item with choosen video
#         item["video"] = choosen_video
        
#     return jsonify({"status": "success", "message": "Videos found", "updatedItems": updated_items})
    

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

