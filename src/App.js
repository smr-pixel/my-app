import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './Wayfinderlogo.png';
import './App.css';
import './components/Songsearch.css';
import { Songsearch } from './components/Songsearch';
import { SearchResult } from './components/SearchResult.js';

const HUGGINGFACE_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;

function App() {
  const [apiResult, setApiResult] = useState(null); // State to store API response
  const [results, setResults] = useState([]); // State to store search results
  const [loading, setLoading] = useState(false); // State to track loading

  const [spotifyLink, setSpotifyLink] = useState('');
  const [trackInfo, setTrackInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here, like fetching the track info
    console.log('Spotify Link:', spotifyLink);
    setTrackInfo('Track Info will be displayed here.');
  };

  // Function to make the API call to Hugging Face
  async function testHuggingFaceAPI() {
    setLoading(true); // Set loading state to true before API call
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
        { inputs: "Describe the mood of an energetic, high-BPM song." },
        {
          headers: {
            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setApiResult(response.data); // Store response data in state
    } catch (error) {
      console.error("Error calling Hugging Face API:", error);
    } finally {
      setLoading(false); // Set loading state to false after API call
    }
  }

  // Make the API call when the component mounts
  useEffect(() => {
    async function fetchData() {
      await testHuggingFaceAPI(); // Calls the async function
    }
    fetchData();
  }, []);

  // Fetch song data from your backend
  const fetchSongData = async (songUrl) => {
    setLoading(true);
    try {
      const response = await axios.get("/your-backend-endpoint", { params: { songUrl } });
      setApiResult(response.data);
    } catch (error) {
      console.error("Error fetching song data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <header className="App-header">
        <h1>Wayvefinder</h1>
      </header>


      <a href="http://localhost:8888/login" className="login-btn">
        <button>Login with Spotify</button>
      </a>

      {/* Spotify Track ID Form */}
      <form id="spotify-form" onSubmit={handleSubmit}>
        <label htmlFor="spotify-link">Enter Spotify Track ID:</label>
        <input
          type="text"
          id="spotify-link"
          name="spotify-link"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
          required
        />
        <button type="submit">Find Your WayveLength...</button>
      </form>

      {/* Track Info Display */}
      <div id="track-info">
        {trackInfo && <p>{trackInfo}</p>}
      </div>



      <p>Copy and paste a song's Spotify link to view song metrics and similar songs.</p>

      <div>
        <Songsearch setResults={setResults} fetchSongData={fetchSongData} />
        <SearchResult results={results} />
      </div>

      <section className="section" style={{ height: '100vh' }}>
        <h2>Section 1</h2>
        <p>This is the first section of the page. Scroll down to see more!</p>

        <div>
          {/* Display the loading state */}
          {loading && <p>Loading...</p>}

          {/* Display Hugging Face response once loaded */}
          {apiResult && (
            <div>
              <h3>Hugging Face Response:</h3>
              <pre>{JSON.stringify(apiResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </section>

      <footer className="App-footer">
        <p>Developed for TartanHacks</p>
        <p>
          By the Hackstreet Boys ❤️
          Advaitha Agastheeswaran, Gabby Flynn, Alex Mcculloch, and Sarah Reyer
        </p>
      </footer>
    </div>
  );
}

export default App;
