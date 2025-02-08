import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './Wayfinderlogo.png';
import './App.css';
import { Songsearch } from './components/Songsearch';

const HUGGINGFACE_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;


function App() {

  const [apiResult, setApiResult] = useState(null); // State to store API response
  const [loading, setLoading] = useState(false);   // State to track loading
  
  // Function to make the API call
  async function testHuggingFaceAPI() {
    setLoading(true); // Set loading state to true before API call
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
        { inputs: "Describe the mood of an energetic, high-BPM song." },
        {
          headers: {
            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
          }
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

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <header className="App-header">
        <h1> </h1>
      </header>
      <p>Copy and paste a song's Spotify link to view song metrics and similar songs.</p>

      <section className="section" style={{ height: '100vh' }}>
        <h2>Section 1</h2>
        <p>This is the first section of the page. Scroll down to see more!</p>
        
        <div>
    </div>


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

          <Songsearch />
          <div className="input-wrapper">
            <div>SearchResults</div>
          </div>
    

          <footer className="App-footer">
            <p>
              Developed for TartanHacks 
            </p>
            <p>
              By the Hackstreet Boys <span role="img" aria-label="heart">❤️</span>
              Advaitha Agastheeswaran, Gabby Flynn, Alex Mcculloch, and Sarah Reyer
            </p>
          </footer>
        </div>
      );
    }

export default App;
