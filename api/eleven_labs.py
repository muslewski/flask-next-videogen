from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv
from pydub import AudioSegment

from api.constants import AUDIO_DIR


load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVEN_LABS_API_KEY"), 
)

def generate_eleven_labs_audio(text, item_id):
    audio = client.generate(
        text=text,
        voice="D38z5RcWu1voky8WS1ja", # Fin (Legacy) voice
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
    