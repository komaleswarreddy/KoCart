import api from './api';

// Dashboard
export const getDashboardStats = async () => {
  try {
    const { data } = await api.get('/api/admin/dashboard');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching dashboard stats';
  }
};

// Users
export const getUsers = async () => {
  try {
    const { data } = await api.get('/api/admin/users');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching users';
  }
};

export const deleteUser = async (userId) => {
  try {
    const { data } = await api.delete(`/api/admin/users/${userId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error deleting user';
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const { data } = await api.put(`/api/admin/users/${userId}`, userData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error updating user';
  }
};

// Products
export const getAdminProducts = async () => {
  try {
    const { data } = await api.get('/api/admin/products');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching products';
  }
};

export const createProduct = async (productData) => {
  try {
    const { data } = await api.post('/api/admin/products', productData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error creating product';
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const { data } = await api.put(`/api/admin/products/${productId}`, productData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error updating product';
  }
};

export const deleteProduct = async (productId) => {
  try {
    const { data } = await api.delete(`/api/admin/products/${productId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error deleting product';
  }
};

// Orders
export const getAdminOrders = async () => {
  try {
    const { data } = await api.get('/api/admin/orders');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error fetching orders';
  }
};

export const updateOrderToDelivered = async (orderId) => {
  try {
    const { data } = await api.put(`/api/admin/orders/${orderId}/deliver`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error updating order';
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const { data } = await api.delete(`/api/admin/orders/${orderId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Error deleting order';
  }
};
