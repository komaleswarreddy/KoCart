import api from './api';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error creating order'
    );
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error fetching order'
    );
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/api/orders/myorders');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error fetching orders'
    );
  }
};

export const updateOrderToPaid = async (orderId, paymentResult) => {
  try {
    const response = await api.put(
      `/api/orders/${orderId}/pay`,
      paymentResult
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error updating payment status'
    );
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error deleting order'
    );
  }
};
