import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from moviepy.editor import AudioFileClip, VideoFileClip, concatenate_videoclips
import uuid

from api.constants import AUDIO_DIR, OUTPUT_DIR, VIDEO_DIR

import moviepy.config as conf
conf.change_settings({"FFMPEG_BINARY": "/usr/bin/ffmpeg"})


def load_audio(audio_file_name):
    """Load an audio file."""
    audio_file_path = os.path.join(AUDIO_DIR, audio_file_name)
    if not os.path.exists(audio_file_path):
        raise FileNotFoundError(f"Audio file {audio_file_name} not found")
    return AudioFileClip(audio_file_path)

def load_video(video_file_name):
    """Load a video file."""
    video_file_path = os.path.join(VIDEO_DIR, video_file_name)
    if not os.path.exists(video_file_path):
        raise FileNotFoundError(f"Video file {video_file_name} not found")
    return VideoFileClip(video_file_path)

def combine_audio_with_video(audio, video):
    """Combine audio with video and trim video to match audio duration."""
    trimmed_video = video.subclip(0, audio.duration)
    trimmed_video = trimmed_video.set_audio(audio)
    
    # Calculate the aspect ratio and resize the video while maintaining the aspect ratio
    target_height = 1080
    target_width = 1920
    aspect_ratio = video.size[0] / video.size[1]
    
    if aspect_ratio > 1:  # Landscape
        new_width = target_width
        new_height = target_width / aspect_ratio
    else:  # Portrait or square
        new_height = target_height
        new_width = target_height * aspect_ratio
    
    trimmed_video = trimmed_video.resize(newsize=(new_width, new_height))
    
    
    return trimmed_video


def process_item(item):
    """Process an item by taking care of loading, checking errors, and combining audio with video."""
    audio_file_name = item.get("audioFileName")
    video_object = item.get("video")
    
    if not audio_file_name:
        print(f"Missing audioFileName for item {item}")
        return

    if not video_object:
        print(f"Missing video object for item {item}")
        return
    
    video_file_name = video_object.get("videoFileName")
    
    if not video_file_name:
        print(f"Missing videoFileName for item {item}")
        return
    
    # Load audio and video files
    audio_clip = load_audio(audio_file_name)
    video_clip = load_video(video_file_name)
    
    # Combine audio with video and trim
    combined_clip = combine_audio_with_video(audio_clip, video_clip)
    
    return combined_clip
    
    


def combine_media_together(items, task_id, tasks, executor, transition_duration=0.2):
    try:
        combined_clips = [None] * len(items)
        
        # Process each item in parallel
        futures = {executor.submit(process_item, item): index for index, item in enumerate(items)}
        for future in as_completed(futures):
            index = futures[future]
            combined_clip = future.result()
            if combined_clip:
                combined_clips[index] = combined_clip
                
        combined_clips = [clip for clip in combined_clips if clip is not None]
        
        
         # Add a simple crossfade transition between clips
        if len(combined_clips) > 1:
            for i in range(len(combined_clips) - 1):
                combined_clips[i] = combined_clips[i].crossfadeout(transition_duration)
                combined_clips[i + 1] = combined_clips[i + 1].crossfadein(transition_duration)
        
            
        # Concatenate all combined clips
        final_clip = concatenate_videoclips(combined_clips, method="compose")
        
            
        # Export the final video
        combined_media_file_name = f"combined_{uuid.uuid4()}.mp4"
        combined_media_file_path = os.path.join(OUTPUT_DIR, combined_media_file_name)
        
        final_clip.write_videofile(
            combined_media_file_path, 
            codec="h264_nvenc", 
            audio_codec="aac", 
            preset="slow", 
            bitrate="4000k", 
            threads=24, 
            ffmpeg_params=["-pix_fmt", "yuv420p"]
        )
        
        # Update the task status
        tasks[task_id] = {"status": "completed", "fileName": combined_media_file_name}
        print("Media files combined successfully")
        
    except Exception as e:
        tasks[task_id] = {"status": "error", "message": str(e)}
        print(f"Error: {str(e)}")
        
    finally:
        # Shutdown the executor
        executor.shutdown(wait=True)
        print("Executor shut down successfully")