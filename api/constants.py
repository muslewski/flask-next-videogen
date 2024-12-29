import os

# Get the directory of the current script
current_dir = os.path.dirname(__file__)

# Get the directory two levels above the current script
root_dir = os.path.dirname(current_dir)

# Construct the paths to the desired directories
AUDIO_DIR = os.path.join(root_dir, 'files/audios')
VIDEO_DIR = os.path.join(root_dir, 'files/videos')
OUTPUT_DIR = os.path.join(root_dir, 'files/output')

# Ensure output directories exist
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)