import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

VIDEO_DIR = os.path.abspath('videos')

@app.route("/api/get-videos")
def get_videos():
    folder = os.path.join(VIDEO_DIR, "new-videos")
    video_files = []
    
    for file in os.listdir(folder):
        if file.endswith('.mp4'):
            video_files.append(os.path.join("new-videos", file))
    
    return jsonify(video_files)


@app.route('/api/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory(VIDEO_DIR, filename)

