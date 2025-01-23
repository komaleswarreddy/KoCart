import api from './api';

// Admin Dashboard
export const getDashboardStats = () => api.get('/api/admin/dashboard');

// User Management
export const getUsers = () => api.get('/api/admin/users');
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const updateUser = (id, userData) => api.put(`/api/admin/users/${id}`, userData);
export const getUserById = (id) => api.get(`/api/admin/users/${id}`);

// Product Management
export const getAllProducts = () => api.get('/api/products');
export const getProductById = (id) => api.get(`/api/products/${id}`);
export const createProduct = (productData) => api.post('/api/products', productData);
export const updateProduct = (id, productData) => api.put(`/api/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
