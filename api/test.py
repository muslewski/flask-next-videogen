from moviepy import ColorClip

# Generate and save a blank video
def generate_blank_video(output_path="test_video.mp4", duration=5, resolution=(1920, 1080), color=(0, 0, 0)):
    """
    Generate a blank video with specified duration, resolution, and color.
    """
    clip = ColorClip(size=resolution, color=color, duration=duration)
    clip.write_videofile(output_path, fps=24, codec="libx264")
    clip.close()