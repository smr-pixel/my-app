import React, {useState} from "react";
import { FiAnchor } from "react-icons/fi";
import "./Songsearch.css";


export const Songsearch = ({setResults}) => {
    const [input, setInput] = useState("");

    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then(json => {
            const results = json.filter((user) => {
                return user && user.name && user.name.toLowerCase().includes(value);
            });
            setResults(results);
        });
    }

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    }

    return (
        <div className="input-wrapper">
            <FiAnchor id="anchor-icon" />
            <input 
                placeholder="Enter Spotify song url"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};