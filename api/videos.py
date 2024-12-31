import os
import uuid
import requests
from api.chat_gpt import summarize_to_one_word
from api.constants import CHATGPT_POTENTIAL_INSTRUCTION, VIDEO_DIR
from api.pixabay_api import find_pixabay_video


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
    

def auto_find_videos_task(items, task_id, tasks):
    used_video_ids = set()
    for item in items:
        if "video" in item:
            video = item["video"]
            if video is not None and "id" in video:
                used_video_ids.add(video["id"])
    
    updated_items = items.copy()
    for item in updated_items:
        if item.get("video"):
            continue
        
        item_text = item.get("text")
        item_id = item.get("id")
        audio_duration = item.get("audioDuration")
        
        if not audio_duration:
            print(f"No audio duration found for item {item_id}")
            continue
        
        choosen_video = None
        
        for _ in range(5):
            tags = summarize_to_one_word(CHATGPT_POTENTIAL_INSTRUCTION + " " + item_text + " ")
            query_tags = [tag for tag in tags if len(tag) <= 16]
            if query_tags:
                break
        
        if not query_tags:
            print(f"No query tags found for item {item_id}")
            continue 
        
        print("Query tags:", query_tags)
        
        for query_tag in query_tags:
            page = 1
            video_objects, total_results = find_pixabay_video(query_tag, max_results=4, page=page)
            total_pages = (total_results + 3) // 4
            
            while page <= total_pages:
                if total_results == 0:
                    break
                
                for video_object in video_objects:
                    video_id = video_object["id"]
                    video_duration = video_object["videoDuration"]
                    if video_id not in used_video_ids and video_duration > audio_duration:
                        choosen_video = video_object
                        used_video_ids.add(video_id)
                        break
                
                if choosen_video:
                    break
                
                page += 1
                video_objects, total_results = find_pixabay_video(query_tag, max_results=4, page=page)
            
            if choosen_video:
                break
        
        if not choosen_video:
            print(f"No suitable video found for item {item_id}")
            continue
        
        choosen_video_url = choosen_video["videos"][0]["url"]
        filename_id = uuid.uuid4()
        video_file_name = save_video(filename_id, choosen_video_url)
        choosen_video["videoFileName"] = video_file_name
        item["video"] = choosen_video
    
    tasks[task_id] = {"status": "completed", "updatedItems": updated_items}