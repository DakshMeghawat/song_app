import os
from youtubesearchpython import VideosSearch
import yt_dlp
from moviepy.editor import VideoFileClip

def download_youtube_video(song_name):
    # Step 1: Search for the song on YouTube
    video_search = VideosSearch(song_name, limit=1)
    results = video_search.result()['result']
    
    if not results:
        return None, "No results found."
    
    video_url = results[0]['link']
    
    # Step 2: Set file paths
    video_folder = '/home/daksh/song_app/video/'
    audio_folder = '/home/daksh/song_app/audio/'
    video_path = os.path.join(video_folder, f"{song_name}.mp4")
    audio_path = os.path.join(audio_folder, f"{song_name}.wav")

    # Step 3: Ensure directories exist
    os.makedirs(video_folder, exist_ok=True)
    os.makedirs(audio_folder, exist_ok=True)

    # Step 4: Download the YouTube video
    # ydl_opts = {
    #     'format': 'best',
    #     'outtmpl': video_path
    # }
    ydl_opts = {
    'format': 'bestaudio',
    'outtmpl': audio_path,
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',  # Change to 'mp3' for better quality
        'preferredquality': '192',  # Bitrate for mp3
    }],
}


    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

    # Step 5: Extract the audio from the downloaded video
    video_clip = VideoFileClip(video_path)
    audio_file = video_clip.audio
    audio_file.write_audiofile(audio_path)

    return audio_path, "Audio extracted and saved."
