import api from './api';

export const createPaymentOrder = async (amount, receipt) => {
  try {
    const response = await api.post('/api/payment/create-order', {
      amount,
      receipt,
      currency: 'INR',
    });
    return response.data;
  } catch (error) {
    console.error('Create payment order error:', error);
    throw new Error(
      error.response?.data?.message || 'Error creating payment order'
    );
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/api/payment/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('Verify payment error:', error);
    throw new Error(
      error.response?.data?.message || 'Error verifying payment'
    );
  }
};

export const getRazorpayKey = async () => {
  try {
    const response = await api.get('/api/payment/key');
    return response.data.key;
  } catch (error) {
    console.error('Get Razorpay key error:', error);
    throw new Error(
      error.response?.data?.message || 'Error getting Razorpay key'
    );
  }
};
