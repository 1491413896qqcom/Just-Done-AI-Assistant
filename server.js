
import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import qs from 'querystring';

const app = express();
app.use(cookieParser());

// Configuration from Environment Variables
const {
  PORT = 3000,
  BASE_URL = 'http://localhost:3000', // Front-end/Back-end base URL
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  JWT_SECRET = 'your-fallback-secret-key-change-me',
  COOKIE_DOMAIN
} = process.env;

// Helper: Generate random state for CSRF protection
function genState() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * GOOGLE OAUTH FLOW
 */

// 1. Redirect to Google Authorization URL
app.get('/auth/google', (req, res) => {
  const state = genState();
  
  // Store state in a short-lived cookie to verify later
  res.cookie('oauth_state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    maxAge: 10 * 60 * 1000 // 10 minutes
  });

  const params = {
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline', // Request refresh token
    prompt: 'consent'
  };

  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + qs.stringify(params);
  res.redirect(authUrl);
});

// 2. Google Callback Handler
app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies['oauth_state'];

    // State Validation
    if (!state || !savedState || state !== savedState) {
      console.error('State mismatch', { received: state, saved: savedState });
      return res.status(403).send('Authentication failed: State mismatch. Please try again.');
    }

    // Exchange authorization code for access token
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: qs.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/auth/google/callback`,
        grant_type: 'authorization_code'
      })
    });

    const tokenJson = await tokenResp.json();
    if (!tokenJson.access_token) {
      console.error('Google token exchange error:', tokenJson);
      return res.status(500).send('Authentication failed during token exchange.');
    }

    // Retrieve user profile
    const profileResp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` }
    });
    const profile = await profileResp.json();

    // In a real app, you would look up or create the user in your DB here.
    // user = await db.findOrCreate({ provider: 'google', id: profile.id, email: profile.email ... })
    const userPayload = {
      id: `google:${profile.id}`,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      provider: 'google'
    };

    // Create Session Token (JWT)
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    // Set Secure Session Cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: COOKIE_DOMAIN, // Set this if you have subdomains
      maxAge: 30 * 24 * 3600 * 1000 // 30 days
    });

    // Clear state cookie
    res.clearCookie('oauth_state');

    // Redirect to Frontend
    res.redirect('/');

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).send('Internal Server Error during Google Authentication');
  }
});


/**
 * GITHUB OAUTH FLOW
 */

// 1. Redirect to GitHub Authorization URL
app.get('/auth/github', (req, res) => {
  const state = genState();

  res.cookie('oauth_state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    maxAge: 10 * 60 * 1000 
  });

  const params = {
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${BASE_URL}/auth/github/callback`,
    scope: 'read:user user:email',
    state
  };

  const authUrl = 'https://github.com/login/oauth/authorize?' + qs.stringify(params);
  res.redirect(authUrl);
});

// 2. GitHub Callback Handler
app.get('/auth/github/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies['oauth_state'];

    if (!state || !savedState || state !== savedState) {
      console.error('State mismatch', { received: state, saved: savedState });
      return res.status(403).send('Authentication failed: State mismatch.');
    }

    // Exchange code for token
    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        Accept: 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${BASE_URL}/auth/github/callback`,
        state
      })
    });

    const tokenJson = await tokenResp.json();
    if (!tokenJson.access_token) {
      console.error('GitHub token exchange error:', tokenJson);
      return res.status(500).send('Authentication failed during token exchange.');
    }

    // Retrieve User Profile
    const profileResp = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `token ${tokenJson.access_token}`,
        'User-Agent': 'JustDone-App'
      }
    });
    const profile = await profileResp.json();

    // Retrieve Email (GitHub emails can be private)
    const emailsResp = await fetch('https://api.github.com/user/emails', {
      headers: { 
        Authorization: `token ${tokenJson.access_token}`,
        'User-Agent': 'JustDone-App' 
      }
    });
    const emails = await emailsResp.json();
    // Find primary verified email
    const primaryEmailObj = Array.isArray(emails) 
      ? emails.find(e => e.primary && e.verified) || emails[0]
      : { email: null };

    const userPayload = {
      id: `github:${profile.id}`,
      email: primaryEmailObj.email,
      name: profile.name || profile.login,
      picture: profile.avatar_url,
      provider: 'github'
    };

    // Create JWT Session
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: COOKIE_DOMAIN,
      maxAge: 30 * 24 * 3600 * 1000
    });

    res.clearCookie('oauth_state');
    res.redirect('/');

  } catch (error) {
    console.error('GitHub Auth Error:', error);
    res.status(500).send('Internal Server Error during GitHub Authentication');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log(`Base URL: ${BASE_URL}`);
});
