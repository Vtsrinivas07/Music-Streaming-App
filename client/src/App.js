import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import Login from './pages/Login';
import Register from './pages/Register';
import Playlists from './pages/Playlists';
import PlaylistDetails from './pages/PlaylistDetails';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import ArtistDetails from './pages/ArtistDetails';
import AlbumDetails from './pages/AlbumDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminSongs from './pages/admin/Songs';
import AdminArtists from './pages/admin/Artists';
import AdminAlbums from './pages/admin/Albums';
import AdminCreateSong from './pages/admin/CreateSong';
import AdminCreateArtist from './pages/admin/CreateArtist';
import AdminCreateAlbum from './pages/admin/CreateAlbum';

import './App.css';

function App() {
  const { user } = useContext(AuthContext);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="search" element={<Search />} />
        <Route path="playlist/:id" element={<PlaylistDetails />} />
        <Route path="artist/:id" element={<ArtistDetails />} />
        <Route path="album/:id" element={<AlbumDetails />} />
        
        {/* Protected Routes */}
        <Route path="playlists" element={user ? <Playlists /> : <Navigate to="/login" />} />
        <Route path="favorites" element={user ? <Favorites /> : <Navigate to="/login" />} />
        <Route path="profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Auth Routes */}
        <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="songs" element={<AdminSongs />} />
        <Route path="songs/create" element={<AdminCreateSong />} />
        <Route path="artists" element={<AdminArtists />} />
        <Route path="artists/create" element={<AdminCreateArtist />} />
        <Route path="albums" element={<AdminAlbums />} />
        <Route path="albums/create" element={<AdminCreateAlbum />} />
      </Route>
    </Routes>
  );
}

export default App; 