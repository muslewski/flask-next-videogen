import time
from tracemalloc import start
from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv
from pydub import AudioSegment

from api.constants import AUDIO_DIR


load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVEN_LABS_API_KEY"), 
)

def check_client_limit():
    character_count = client.user.get_subscription().character_count
    character_limit = client.user.get_subscription().character_limit
    
    return character_count, character_limit

    
def generate_eleven_labs_audio(text, item_id, voice_id):
    audio = client.generate(
        text=text,
        voice=voice_id,
        model="eleven_multilingual_v2"
    )
    
    # Convert the generator to bytes
    audio_bytes = b''.join(audio)
    
    audio_file_name = f"{item_id}.mp3"
    audio_file_path = os.path.join(AUDIO_DIR, audio_file_name)
    
    # Save the audio file
    with open(audio_file_path, "wb") as audio_file:
        audio_file.write(audio_bytes)
        
    # Calculate audio duration
    audio = AudioSegment.from_file(audio_file_path)
    audio_duration = len(audio) / 1000.0
        
    return audio_file_name, audio_duration
    

def generate_blank_audio(duration, item_id):
    # Generate silent audio
    silent_audio = AudioSegment.silent(duration=int(duration * 1000))
    
    audio_file_name = f"blank_{item_id}.mp3"
    audio_file_path = os.path.join(AUDIO_DIR, audio_file_name)
    
    # Export the silent audio
    silent_audio.export(audio_file_path, format="mp3")
    
    return audio_file_name, duration
    