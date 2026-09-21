export const API_BASE = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace(/\/$/, '') 
  : '';

export const getApiUrl = (path = '') => {
  if (!path) return API_BASE;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

export default API_BASE;
