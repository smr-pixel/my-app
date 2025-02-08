import React from "react";

import { FaSearch } from "react-icons/fa";

export const Songsearch = () => {
    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input placeholder="Enter Spotify song url" />
        </div>
    )
}