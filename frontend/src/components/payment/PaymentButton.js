import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey,
} from '../../services/paymentService';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PaymentButton = ({ amount, orderId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Get Razorpay key
      const key = await getRazorpayKey();
      if (!key) {
        throw new Error('Unable to get payment gateway key');
      }

      // Create order
      const order = await createPaymentOrder(amount, orderId);
      if (!order || !order.id) {
        throw new Error('Error creating payment order');
      }

      // Get user details from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user) {
        throw new Error('User information not found');
      }

      // Configure Razorpay
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'KoCart',
        description: `Order #${orderId}`,
        order_id: order.id,
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        handler: async function (response) {
          try {
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              throw new Error('Invalid payment response');
            }

            const data = {
              orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };

            // Verify payment
            const result = await verifyPayment(data);
            
            toast.success('Payment successful!');
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess(result);
            }
            navigate('/orders');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            navigate(`/order/${orderId}`);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info('Payment cancelled');
          },
        },
        theme: {
          color: '#1976d2',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handlePayment}
      disabled={loading}
      fullWidth
      sx={{ mt: 2 }}
    >
      {loading ? <CircularProgress size={24} /> : 'Pay Now'}
    </Button>
  );
};

export default PaymentButton;
