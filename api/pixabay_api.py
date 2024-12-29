from calendar import c
import os
import re
import requests

PIXABAY_API = os.getenv("PIXABAY_API_KEY")
url = "https://pixabay.com/api/videos/"

def find_pixabay_video(query, max_results=4, page=1):
    params = {
        "key": PIXABAY_API,
        "q": query,
        "lang": "en",
        "per_page": max_results,
        "page": page,
        "pretty": "true"  # pretty for development, remove for production
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        
        hits = data["hits"]
        total_results = data["totalHits"]
        
        video_objects = []

        for hit in hits:
            id = hit["id"]
            tags = hit["tags"].split(", ")
            video_duration = hit["duration"]
            page_url = hit["pageURL"]
            videos = hit["videos"]
            video_items = list(videos.values())
                
            video_object = {
                "id": str(id),
                "videoFileName": "",
                "videoDuration": video_duration,
                "videos": video_items,
                "tags": tags,
                "pageUrl": page_url,
            }
            
            video_objects.append(video_object)
        
        return video_objects, total_results

    except Exception as e:
        print(f"Error fetching videos: {e}")
        return []