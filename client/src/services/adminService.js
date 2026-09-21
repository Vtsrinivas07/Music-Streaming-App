import api from '../utils/axios';

const BASE_URL = '/api/admin';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Operation failed');
  }
  return data.data;
};

// Users
export const getUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch users');
  }
};

export const getUser = async (id) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create user');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update user');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete user');
  }
};

// Artists
export const getArtists = async () => {
  try {
    const response = await api.get('/admin/artists');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch artists');
  }
};

export const getArtist = async (id) => {
  const response = await fetch(`${BASE_URL}/artists/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createArtist = async (artistData) => {
  try {
    let response;
    if (artistData.image instanceof File) {
      const formData = new FormData();
      Object.keys(artistData).forEach(key => {
        if (key === 'image') {
          formData.append(key, artistData[key]);
        } else {
          formData.append(key, typeof artistData[key] === 'object' 
            ? JSON.stringify(artistData[key]) 
            : artistData[key]);
        }
      });
      response = await api.post('/admin/artists', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      const { image, ...data } = artistData;
      response = await api.post('/admin/artists', data);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create artist');
  }
};

export const updateArtist = async (id, artistData) => {
  try {
    let response;
    if (artistData.image instanceof File) {
      const formData = new FormData();
      Object.keys(artistData).forEach(key => {
        if (key === 'image') {
          formData.append(key, artistData[key]);
        } else {
          formData.append(key, typeof artistData[key] === 'object' 
            ? JSON.stringify(artistData[key]) 
            : artistData[key]);
        }
      });
      response = await api.put(`/admin/artists/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      const { image, ...data } = artistData;
      response = await api.put(`/admin/artists/${id}`, data);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update artist');
  }
};

export const deleteArtist = async (id) => {
  try {
    const response = await api.delete(`/admin/artists/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete artist');
  }
};

// Songs
export const getSongs = async () => {
  try {
    const response = await api.get('/admin/songs');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch songs');
  }
};

export const getSong = async (id) => {
  const response = await fetch(`${BASE_URL}/songs/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createSong = async (songData) => {
  try {
    let response;
    if (songData.audioFile instanceof File || songData.coverImage instanceof File) {
      const formData = new FormData();
      Object.keys(songData).forEach(key => {
        if (key === 'audioFile' || key === 'coverImage') {
          if (songData[key]) formData.append(key, songData[key]);
        } else {
          formData.append(key, typeof songData[key] === 'object' 
            ? JSON.stringify(songData[key]) 
            : songData[key]);
        }
      });
      response = await api.post('/admin/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      const { audioFile, coverImage, ...data } = songData;
      response = await api.post('/admin/songs', data);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create song');
  }
};

export const updateSong = async (id, songData) => {
  try {
    let response;
    if (songData.audioFile instanceof File || songData.coverImage instanceof File) {
      const formData = new FormData();
      Object.keys(songData).forEach(key => {
        if (key === 'audioFile' || key === 'coverImage') {
          if (songData[key]) formData.append(key, songData[key]);
        } else {
          formData.append(key, typeof songData[key] === 'object' 
            ? JSON.stringify(songData[key]) 
            : songData[key]);
        }
      });
      response = await api.put(`/admin/songs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      const { audioFile, coverImage, ...data } = songData;
      response = await api.put(`/admin/songs/${id}`, data);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update song');
  }
};

export const deleteSong = async (id) => {
  try {
    const response = await api.delete(`/admin/songs/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete song');
  }
};

// Albums
export const getAlbums = async () => {
  try {
    const response = await api.get('/admin/albums');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch albums');
  }
};

export const getAlbum = async (id) => {
  const response = await fetch(`${BASE_URL}/albums/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createAlbum = async (albumData) => {
  try {
    let response;
    if (albumData.coverImage instanceof File) {
      const formData = new FormData();
      Object.keys(albumData).forEach(key => {
        if (key === 'coverImage') {
          formData.append(key, albumData[key]);
        } else {
          formData.append(key, typeof albumData[key] === 'object' 
            ? JSON.stringify(albumData[key]) 
            : albumData[key]);
        }
      });
      response = await api.post('/admin/albums', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      const { coverImage, ...data } = albumData;
      response = await api.post('/admin/albums', data);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create album');
  }
};

export const updateAlbum = async (id, albumData) => {
  try {
    let response;
    if (albumData.coverImage instanceof File) {
      const formData = new FormData();
      Object.keys(albumData).forEach(key => {
        if (key === 'coverImage') {
          formData.append(key, albumData[key]);
        } else {
          formData.append(key, typeof albumData[key] === 'object' 
            ? JSON.stringify(albumData[key]) 
            : albumData[key]);
        }
      });
      response = await api.put(`/admin/albums/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      const { coverImage, ...data } = albumData;
      response = await api.put(`/admin/albums/${id}`, data);
    }
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update album');
  }
};

export const deleteAlbum = async (id) => {
  try {
    const response = await api.delete(`/admin/albums/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete album');
  }
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch dashboard stats');
  }
};

// Admin Actions
export const getAdminActions = async () => {
  try {
    const response = await api.get('/admin/actions');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch admin actions');
  }
};

// Feature Toggle
export const toggleFeatured = async (type, id) => {
  try {
    const response = await api.put(`/admin/feature/${type}/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to toggle featured status');
  }
}; 