import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './Wayfinderlogo.png';
import './App.css';
import './components/Songsearch.css';
import AudioVisualizer from './components/AudioVisualizer';

function App() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [results, setResults] = useState([]);
  const [bpm, setBpm] = useState('');
  const [key, setKey] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleConvert = async () => {
    const response = await fetch('http://localhost:3000/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: youtubeLink }),
    });
    const data = await response.json();
    if (data.success) {
      setBpm(data.bpm);
      setKey(data.key);
      setAudioUrl(data.downloadUrl);
    } else {
      alert('Conversion failed');
    }
  };

  const fetchSongData = async (query) => {
    // Your existing fetchSongData implementation
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <header className="App-header">
        <h1>Wayvefinder</h1>
      </header>
      <div className="youtube-converter">
        <input
          type="text"
          placeholder="Enter YouTube link"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
        />
        <button onClick={handleConvert}>Find Your WayveLength...</button>
      </div>
      <p>Paste a Song's Youtube URL to view song metrics and similar songs.</p>
      {bpm && key && (
        <div>
          <p>BPM: {bpm}</p>
          <p>Key: {key}</p>
        </div>
      )}
      {audioUrl && <AudioVisualizer audioUrl={audioUrl} />}
      <footer className="App-footer">
        <p>Developed for TartanHacks</p>
        <p>
          By: The Hackstreet Boys ❤️
          Advaitha Agastheeswaran, Gabby Flynn, Alex Mcculloch, and Sarah Reyer
        </p>
      </footer>
    </div>
  );
}

export default App;
