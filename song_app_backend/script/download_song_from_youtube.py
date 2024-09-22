import os
import sys
from youtubesearchpython import VideosSearch
import yt_dlp
from moviepy.editor import VideoFileClip
import argparse

def download_youtube_video(song_name):
    # song_name = "Teri Aahatein"
    
    # Step 1: Search for the song on YouTube
    video_search = VideosSearch(song_name, limit=1)
    results = video_search.result()['result']
    
    if not results:
        print("No results found.")
        return None
    
    video_url = results[0]['link']
    print(f"URL : {video_url}")
    print(f"Found video: {results[0]['title']}")

    # Step 2: Set file paths
    video_folder = f'//home/daksh/song_app/video/'
    audio_folder = f'/audio/'
    video_path = os.path.join(video_folder, f"{song_name}.mp4")
    audio_path = os.path.join(audio_folder, f"{song_name}.wav")

    # Step 3: Ensure directories exist
    os.makedirs(video_folder, exist_ok=True)
    os.makedirs(audio_folder, exist_ok=True)

    # Step 4: Download the YouTube video
    ydl_opts = {
        'format': 'best',
        'outtmpl': video_path
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

    # Step 5: Extract the audio from the downloaded video
    video_clip = VideoFileClip(video_path)
    audio_file = video_clip.audio
    audio_file.write_audiofile(audio_path)

    print(f"Audio extracted and saved to: {audio_path}")




def main():
    parser = argparse.ArgumentParser(description="Script to verify profile matches created by create_matched_profiles_for_all")
    parser.add_argument('--song_name', help='Song name to download', required=True)
    args = parser.parse_args()
    download_youtube_video(args.song_name)

if __name__ == "__main__":
    main()
