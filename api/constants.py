import os

# Get the directory of the current script
current_dir = os.path.dirname(__file__)

# Get the directory two levels above the current script
root_dir = os.path.dirname(current_dir)

# Construct the paths to the desired directories
AUDIO_DIR = os.path.join(root_dir, 'files/audios')
VIDEO_DIR = os.path.join(root_dir, 'files/videos')
OUTPUT_DIR = os.path.join(root_dir, 'files/output')

CHATGPT_POTENTIAL_INSTRUCTION = """Please extract exactly three single keywords from the following video script. The keywords should be:
- keywords can only be in English language,
- Common english words suitable for stock media searches (e.g., on Pixabay or Pexels)
- Separated by commas
- Simple nouns or verbs that capture the main themes
- No phrases or complex terms
- Example response format: "tree, water, sunset"

Return only result from:"""

# Ensure output directories exist
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)