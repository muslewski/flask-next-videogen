import os
import requests
from api.constants import VIDEO_DIR


def save_video(id, video_url):
    video_file_name = f"{id}.mp4"
    video_file_path = os.path.join(VIDEO_DIR, video_file_name)
    
    response = requests.get(video_url, stream=True)
    if response.status_code == 200:
        with open(video_file_path, "wb") as video_file:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    video_file.write(chunk)
        return video_file_name
    else:
        print(f"Failed to download video: {response.status_code}")
        return None