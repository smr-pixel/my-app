const express = require('express');
const session = require('express-session');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const CLIENT_ID = 'ac2f2d498d0145ada68b8db0ff357943';
const CLIENT_SECRET = '31914cd9cbdf47e9aff3da89ae8c4edb';
const REDIRECT_URI = 'http://localhost:8888/callback';

const app = express();
const port = 8888;

const cors = require('cors');
app.use(cors());


// Middleware to parse JSON requests
app.use(bodyParser.json());

// Initialize session middleware
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
}));

// Route to handle login and redirect to Spotify's login page
app.get('/login', async (req, res) => {
    try {
        const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
            client_id: CLIENT_ID,
            response_type: 'code',
            redirect_uri: REDIRECT_URI,
            scope: 'user-library-read user-top-read playlist-read-private',
        }).toString()}`;
        res.redirect(authorizeUrl);
    } catch (error) {
        console.error('Error during login:', error);
        res.send('Error during login');
    }
});

// Route to handle Spotify's redirect and exchange the code for tokens
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        }).toString());

        req.session.accessToken = response.data.access_token;
        req.session.refreshToken = response.data.refresh_token;
        res.redirect('/');
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.send('Error during login');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
