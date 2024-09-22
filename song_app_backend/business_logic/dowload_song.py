import os
import sys
from youtubesearchpython import VideosSearch
import yt_dlp

def download_youtube_video(song_name):
    # Step 1: Search for the song on YouTube
    video_search = VideosSearch(song_name, limit=1)
    results = video_search.result()['result']
    
    if not results:
        print("No results found.")
        return None
    
    video_url = results[0]['link']
    print(f"URL: {video_url}")
    print(f"Found video: {results[0]['title']}")

    # Step 2: Set file paths
    audio_folder = '/home/daksh/song_app/audio/'
    audio_path = os.path.join(audio_folder, f"{results[0]['title']}")  # Change to mp3 directly

    # Step 3: Ensure directory exists
    os.makedirs(audio_folder, exist_ok=True)

    # Step 4: Download the audio directly
    ydl_opts = {
        'format': 'bestaudio',
        'outtmpl': audio_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

    print(f"Audio saved to: {audio_path}")
    return audio_path, "Download successful"
