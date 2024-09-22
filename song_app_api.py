from flask import Flask, request, jsonify
from song_app_backend.business_logic.dowload_song import download_youtube_video

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
