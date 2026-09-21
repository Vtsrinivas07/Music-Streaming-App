# 🎵 MUSICBOX - Music Streaming Platform

<div align="center">

![MUSICBOX Banner](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=400&fit=crop&q=80)

**A modern, full-stack music streaming platform built with the MERN stack.**  
*Stream 80M+ high-fidelity 320kbps songs across Tollywood, Bollywood, Kollywood, Hollywood, and global charts with dark glassmorphic design.*

[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Audio Quality](https://img.shields.io/badge/Audio-320kbps%20HQ-1db954?logo=spotify&logoColor=white)](#-audio--streaming-engine)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation & Setup](#installation--setup)
  - [Running Locally](#running-locally)
- [API Documentation](#-api-documentation)
- [Deployment Guide](#-deployment-guide)
  - [Deploying Frontend on Vercel](#deploying-frontend-on-vercel)
  - [Deploying Backend on Render](#deploying-backend-on-render)
  - [Deploying Full-Stack with Docker / VPS](#deploying-full-stack-with-docker--vps)
- [Security Best Practices](#-security-best-practices)
- [License](#-license)

---

## 🌟 Overview

**MUSICBOX** is an end-to-end music streaming web application designed to deliver an audiophile-grade listening experience. Combining Spotify-inspired aesthetics with seamless regional cinema integrations, MUSICBOX provides full-length songs (3-6 minutes) without 30-second preview restrictions.

Whether you're exploring blockbuster hits from **Tollywood (Telugu)**, **Bollywood (Hindi)**, **Kollywood (Tamil)**, or global chart-toppers from **Hollywood (English)**, MUSICBOX delivers instant search, queue management, custom playlists, and platform administration.

---

## ✨ Key Features

### 🎨 Dark Glassmorphic Design System
- **Curated Theme**: Deep obsidian background with frosted glass panels (`backdrop-filter: blur(20px)`), tailored gradients, and gold/emerald accents.
- **Dynamic Player Clearance**: Smart sidebar layout adjusts padding dynamically when a song is playing, ensuring user cards, logout buttons, and links are never obstructed.

### 🎧 Audio & Streaming Engine
- **Full Studio Length (320kbps)**: No 30-second preview clips. Full tracks with metadata preservation and on-the-fly high-definition stream resolution.
- **Audio Controls**:
  - **Shuffle Mode**: Randomizes track queue with visual active indicators.
  - **3-Mode Repeat**: Seamlessly switch between Repeat Off, Repeat Playlist (`ALL`), and Track Loop (`ONE`).
  - **Seek Bar & Volume**: Smooth, interactive scrubbing with real-time time formatters (`mm:ss`).

### 🎬 Blockbuster Hero Banner & Catalog Discovery
- **Hero Banner**: Features mega blockbusters (e.g., *Pushpa 2 - The Rule*, *Devara*, *Leo*, *Dhurandhar*) with one-click playback and an interactive **"NEXT HIT"** rotation button.
- **Instant Search**: Search results populate immediately underneath the search bar without scrolling. Includes suggestion chips for trending artists and movies.
- **Regional Filters**: Quick filter pills for Tollywood, Bollywood, Kollywood, Hollywood, Punjabi, Malayalam, Kannada, Bhojpuri, and K-Pop.

### 🛡️ Platform Administration & Analytics
- **Dashboard Telemetry**: Real-time stats for total users, songs, verified artists, official albums, and system health metrics.
- **Glassmorphic Management Tables**:
  - **Manage Users**: View username, user email, role badges (`🛡️ ADMIN` / `USER`), and modal editor.
  - **Manage Songs**: Formatted durations (`3:20`), resolved artist/album titles, cover artwork, and direct in-table streaming.
  - **Manage Artists**: Artist avatars, bios, and song/album counters.
  - **Manage Albums**: Formatted release dates, artist credits, and album covers.
- **Switch to Player**: Dedicated button allowing administrators to easily toggle between platform management and the music streaming player.

### 👤 User Library & Personalization
- **Profile Picture Customization**: Interactive modal with curated avatar presets, custom image URLs, and local device uploads.
- **Liked Songs**: Instant heart toggle synchronized with cloud database and persistent local fallback.
- **Custom Playlists**: Create, edit, rename, and add tracks to custom playlists with modal confirmation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) (Create React App)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: [Styled Components](https://styled-components.com/) (CSS-in-JS with theme provider)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome, Material Icons)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens ([JWT](https://jwt.io/)) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js) password hashing
- **Security**: CORS, Helmet, rate-limiting, and sanitized inputs
- **Music APIs**: JioSaavn 320kbps Engine Adapter & iTunes API Fallback Adapter

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MUSICBOX CLIENT                      │
│   React 18 • Styled Components • PlayerContext Provider │
└───────────────────────────┬─────────────────────────────┘
                            │ /api requests (Proxy)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND                      │
│   JWT Auth Middleware • Error Handling • Admin Control  │
└──────────────┬────────────────────────────┬─────────────┘
               │                            │
               ▼                            ▼
┌──────────────────────────────┐ ┌─────────────────────────┐
│       MONGODB DATABASE       │ │   FREE MUSIC ENGINES    │
│  Users • Songs • Playlists   │ │   JioSaavn 320kbps HQ   │
│   Artists • Albums • Admins  │ │   iTunes API Fallback   │
└──────────────────────────────┘ └─────────────────────────┘
```

---

## 📂 Project Structure

```
MUSICBOX/
├── client/
│   ├── public/
│   │   ├── index.html            # Web app title & meta tags
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/            # AdminTable, Modals (Song, User, Artist, Album)
│   │   │   ├── layout/           # Sidebar, AdminLayout, Layout, PageHeader
│   │   │   ├── player/           # MusicPlayer (controls, seek bar, shuffle/repeat)
│   │   │   ├── playlists/        # AddToPlaylistModal, PlaylistGrid
│   │   │   └── songs/            # SongList, Track Cards
│   │   ├── context/
│   │   │   ├── AuthContext.js    # Authentication, login/logout, profile updates
│   │   │   └── PlayerContext.js  # Global audio engine, queue, shuffle, repeat
│   │   ├── pages/
│   │   │   ├── admin/            # Dashboard, Users, Songs, Artists, Albums
│   │   │   ├── Browse.js         # Genre & regional cinema explorer
│   │   │   ├── Favorites.js      # Liked songs collection
│   │   │   ├── Home.js           # Hero banner, instant search, music hub
│   │   │   ├── Login.js          # Authentication portal
│   │   │   ├── Playlists.js      # User playlists overview
│   │   │   ├── Profile.js        # User settings & profile picture editor
│   │   │   └── Search.js         # Dedicated search explorer
│   │   ├── services/
│   │   │   ├── adminService.js   # Admin CRUD API handlers
│   │   │   └── musicApiService.js# JioSaavn/iTunes catalog service
│   │   ├── App.js                # App routing & theme wrapper
│   │   └── index.js
│   ├── package.json
│   └── serve.js                  # Production static server with /api proxy
├── server/
│   ├── controllers/
│   │   ├── admin.controller.js   # Metrics & administrative actions
│   │   ├── auth.controller.js    # Register, login, profile updates
│   │   ├── musicApi.controller.js# Full 320kbps search & regional streaming
│   │   ├── playlist.controller.js# Playlist management
│   │   └── song.controller.js    # Song catalog operations
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification & admin guard
│   │   └── error.middleware.js   # Centralized error handler
│   ├── models/                   # Mongoose schemas (User, Song, Album, Artist, Playlist)
│   ├── routes/                   # Express route definitions
│   ├── scripts/                  # Database seeds & migration helpers
│   ├── server.js                 # Express app initialization
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (Local MongoDB or Atlas URI)
MONGODB_URI=mongodb://localhost:27017/musicbox
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/musicbox?retryWrites=true&w=majority

# Security (Replace with a strong random 64-character secret in production)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Client URL (For CORS configuration)
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Security Warning**: Never commit your `.env` file to source control. A `.gitignore` has been pre-configured to exclude all `.env` files.

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vtsrinivas07/Music-Streming-Application.git
   cd Music-Streming-Application
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

---

### Running Locally

You can run the application with MongoDB running in the background:

#### Terminal 1: Start the Backend Server
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

#### Terminal 2: Start the Client Development Server
```bash
cd client
npm start
# Client opens on http://localhost:3000
```

#### (Optional) Production Single-Port Serving
To build the client and serve it with the built-in transparent proxy:
```bash
cd client
npm run build
node serve.js
# Serves the complete application with /api proxy on http://localhost:3000
```

---

## 📡 API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new listener account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated profile data |
| `PUT` | `/api/auth/profile` | Private | Update username, email, or avatar picture |

### Free Music Engine (`/api/music-api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/music-api/search?q=:query&limit=:limit` | Public | Search 80M+ songs with 320kbps full streams |
| `GET` | `/api/music-api/indian?industry=:industry` | Public | Stream Tollywood, Bollywood, Kollywood, Hollywood hits |
| `GET` | `/api/music-api/trending?limit=:limit` | Public | Fetch top viral & trending songs |

### Playlists & Favorites (`/api/playlists`, `/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/playlists/my-playlists` | Private | Retrieve user's custom playlists |
| `POST` | `/api/playlists` | Private | Create a new custom playlist |
| `PUT` | `/api/playlists/:id/songs` | Private | Add song to playlist |
| `DELETE` | `/api/playlists/:id/songs/:songId` | Private | Remove song from playlist |
| `GET` | `/api/users/favorites` | Private | Get user's liked songs |
| `POST` | `/api/users/favorites` | Private | Toggle song in liked library |

### Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin Only | Platform telemetry and analytics |
| `GET` | `/api/admin/users` | Admin Only | List, edit, or delete platform users |
| `GET` | `/api/admin/songs` | Admin Only | List, create, update, or remove tracks |
| `GET` | `/api/admin/artists` | Admin Only | Artist roster management |
| `GET` | `/api/admin/albums` | Admin Only | Official albums catalog control |

---

## 🌐 Deployment Guide

### Deploying Frontend on Vercel

> [!TIP]
> **Fixing Vercel 404 (NOT_FOUND)**: If your Vercel deployment shows `404: NOT_FOUND`, it is because Vercel was looking at the root directory where no static build files were located. We have added a root `vercel.json` and `package.json`, but setting the **Root Directory** to `client` in Vercel is the recommended best practice.

#### Method 1: Set Root Directory in Vercel (Recommended)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your project (`music-streaming-app-sandy`).
3. Go to **Settings** &rarr; **General**.
4. Under **Root Directory**, click **Edit**.
5. Type or select `client` and click **Save**.
6. Go to **Settings** &rarr; **Environment Variables** and add:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `REACT_APP_API_URL` | `https://your-render-app.onrender.com` | Your deployed Render backend URL (no trailing slash) |
7. Go to the **Deployments** tab, click the three dots (`...`) on the latest deployment, and click **Redeploy**.

#### Method 2: Automatic Root Build
With the newly added root `vercel.json` and root `package.json`, Vercel will automatically run `cd client && npm install && npm run build` and serve from `client/build`. Simply trigger a redeployment in Vercel.

---

### Deploying Backend on Render

1. Sign in to [Render](https://render.com/) and click **"New +"** &rarr; **"Web Service"**.
2. Connect your GitHub repository (`Music-Streaming-App`).
3. Configure the service settings:
   - **Name**: `musicbox-api` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add the following:
   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `5000` | Port for Express server |
   | `MONGODB_URI` | `mongodb+srv://<username>:<password>@...` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `your-secure-random-64-char-secret` | Generate using `crypto.randomBytes(64)` |
   | `CLIENT_URL` | `https://music-streaming-app-sandy.vercel.app` | Your Vercel frontend URL |
5. Click **Create Web Service**.
6. Once deployed, copy your Render service URL (e.g., `https://musicbox-api.onrender.com`) and paste it as `REACT_APP_API_URL` in your Vercel project environment variables!

---

### Deploying Full-Stack with Docker / VPS

For VPS deployment (Ubuntu/Debian, Nginx, PM2):

1. **Build Client**:
   ```bash
   cd client
   npm install && npm run build
   ```
2. **Start Backend with PM2**:
   ```bash
   cd ../server
   npm install --production
   pm2 start server.js --name "musicbox-api"
   ```
3. **Configure Nginx**:
   Point `/` to `client/build/` and proxy `/api/` requests to `http://localhost:5000`.

---

## 🔒 Security Best Practices

- **Never Commit Secrets**: Keep `.env` files outside version control.
- **Generate Strong Secrets**: Use cryptographically random strings for `JWT_SECRET`:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **Use HTTPS**: Always enable SSL/TLS certificates (e.g., via Let's Encrypt or Cloudflare) in production environments.
- **CORS Protection**: Restrict `CLIENT_URL` in production to allow requests only from your verified frontend domain.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

<div align="center">
  <sub>Built with ❤️ for music enthusiasts worldwide. Stream globally with MUSICBOX.</sub>
</div>
