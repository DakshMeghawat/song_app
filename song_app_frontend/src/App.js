import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [songName, setSongName] = useState('');
  const [message, setMessage] = useState('');
  const [audioPath, setAudioPath] = useState('');
  const [audio, setAudio] = useState(null);
  const [songs, setSongs] = useState([]);

  // Fetch songs from the backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/songs');
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        setMessage('Error fetching songs.');
      }
    };

    fetchSongs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAudioPath('');

    try {
      const response = await fetch('http://127.0.0.1:5000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ song_name: songName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setAudioPath(data.audio_path);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error occurred while downloading the song.');
    }
  };

  const playSong = (path) => {
    if (audio) {
      audio.pause(); // Stop current audio
      audio.currentTime = 0; // Reset the time if needed
    }

    const newAudio = new Audio(path);
    newAudio.play();
    setAudio(newAudio);

    // Clean up when the audio ends
    newAudio.onended = () => setAudio(null);
  };

  const stopSong = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset the time
      setAudio(null);
    }
  };

  return (
    <div className="App">
      <h1>Song Downloader</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter song name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          required
        />
        <button type="submit">Download</button>
      </form>
      {message && <p>{message}</p>}
      {audioPath && (
        <div>
          <h2>Download Link:</h2>
          <a href={audioPath} target="_blank" rel="noopener noreferrer">Download Audio</a>
          <button onClick={() => playSong(audioPath)}>Play</button>
          <button onClick={stopSong}>Stop</button>
        </div>
      )}
      <h2>Available Songs:</h2>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            {song}
            <button onClick={() => playSong(`http://127.0.0.1:5000/audio/${song}`)}>Play</button>
            <button onClick={stopSong}>Stop</button> {/* Stop button for each song */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
