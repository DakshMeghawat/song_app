import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [songName, setSongName] = useState('');
  const [message, setMessage] = useState('');
  const [audioPath, setAudioPath] = useState('');
  const [audio, setAudio] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioElementRef = useRef(null);

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
      // Check if the song already exists in the list of songs
      const songExists = songs.some(song => song.includes(songName));
  
      if (songExists) {
        setMessage('The song is already available for playing.');
        return; // Exit the function to prevent downloading
      }
  
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
    setAudio(newAudio);
  
    // Extract the song title before the first " | "
    const fullTitle = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    const songTitle = fullTitle.split(' | ')[0]; // Get only the part before the first " | "
  
    setCurrentSong(songTitle); // Set only the song title
  
    // Event listener to update the time and duration
    newAudio.addEventListener('timeupdate', () => {
      setCurrentTime(newAudio.currentTime);
    });
  
    newAudio.addEventListener('loadedmetadata', () => {
      setDuration(newAudio.duration);
    });
  
    newAudio.play();
  
    // Clean up when the audio ends
    newAudio.onended = () => {
      setAudio(null);
      setCurrentSong(null);
      setCurrentTime(0);
      setDuration(0);
    };
  };
  
  

  const stopSong = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset the time
      setAudio(null);
      setCurrentSong(null);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audio) {
      audio.currentTime = seekTime;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
        </div>
      )}

      {currentSong && (
        <div className="player">
          <h2>Now Playing: {currentSong}</h2> {/* This now shows only the title */}
          <p>
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
          <input
            type="range"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
          />
          <button onClick={stopSong}>Stop</button>
        </div>
      )}


      <h2>Available Songs:</h2>
      <ul>
        {songs.map((song, index) => {
          const songTitle = song.split('|')[0]; // Extract title
          return (
            <li key={index} className="song-item">
               <span>{songTitle}</span>
            <div>
              <button onClick={() => playSong(`http://127.0.0.1:5000/audio/${song}`)}>Play</button>
              <button onClick={stopSong}>Stop</button>
            </div>
          </li>
        );
      })}
      </ul>
    </div>
  );
}

export default App;
