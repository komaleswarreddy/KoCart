import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => api.post('/api/users/login', credentials);
export const register = (userData) => api.post('/api/users/register', userData);
export const getUserProfile = () => api.get('/api/users/profile');

// Product endpoints
export const getProducts = (page = 1, limit = 10) =>
  api.get(`/api/products?page=${page}&limit=${limit}`);
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const searchProducts = (query) =>
  api.get(`/api/products/search?query=${query}`);

// Cart endpoints
export const getCart = () => api.get('/api/cart');
export const addToCart = (productId, quantity) =>
  api.post('/api/cart', { productId, quantity });
export const updateCartItem = (productId, quantity) =>
  api.put('/api/cart', { productId, quantity });
export const removeFromCart = (productId) =>
  api.delete(`/api/cart/${productId}`);
export const clearCart = () => api.delete('/api/cart');

// Order endpoints
export const createOrder = (orderData) => api.post('/api/orders', orderData);
export const getOrder = (orderId) => api.get(`/api/orders/${orderId}`);
export const getMyOrders = () => api.get('/api/orders/myorders');
export const updateOrderToPaid = (orderId, paymentResult) =>
  api.put(`/api/orders/${orderId}/pay`, paymentResult);

// Admin endpoints
export const getAllUsers = () => api.get('/api/admin/users');
export const updateUser = (id, userData) =>
  api.put(`/api/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);

export const createProduct = (productData) =>
  api.post('/api/admin/products', productData);
export const updateProduct = (id, productData) =>
  api.put(`/api/admin/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/api/admin/products/${id}`);

export default api;
