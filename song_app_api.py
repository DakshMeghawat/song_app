import os
from flask import Flask, request, jsonify
from flask import send_from_directory
from flask_cors import CORS
from song_app_backend.business_logic.dowload_song import download_youtube_video

app = Flask(__name__)
CORS(app)

AUDIO_FOLDER = '/home/daksh/song_app/audio/'

@app.route('/download', methods=['POST'])
def download_song():
    data = request.get_json()
    song_name = data.get('song_name')

    if not song_name:
        return jsonify({"error": "Song name is required"}), 400

    audio_path, message = download_youtube_video(song_name)

    if audio_path is None:
        return jsonify({"error": message}), 404

    return jsonify({"message": message, "audio_path": audio_path}), 200

@app.route('/songs', methods=['GET'])
def list_songs():
    try:
        songs = [f for f in os.listdir(AUDIO_FOLDER) if f.endswith('.mp3')]
        return jsonify(songs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/audio/<filename>', methods=['GET'])
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)
