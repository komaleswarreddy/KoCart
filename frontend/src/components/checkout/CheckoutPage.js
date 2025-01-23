import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, createOrder } from '../../services/api';
import { toast } from 'react-toastify';
import PaymentButton from '../payment/PaymentButton';

const steps = ['Shipping Address', 'Review Order', 'Payment'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      if (!response.data || !response.data.items || response.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error loading cart items');
      navigate('/cart');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product ? item.product.price : 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const validationErrors = validateShippingAddress();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    if (activeStep === 1) {
      await handlePlaceOrder();
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateShippingAddress = () => {
    const errors = {};
    Object.keys(shippingAddress).forEach((key) => {
      if (!shippingAddress[key]) {
        errors[key] = 'This field is required';
      }
    });
    return errors;
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
          image: item.product.imageUrl
        })),
        shippingAddress,
        totalPrice: calculateTotal(),
      };

      const response = await createOrder(orderData);
      setOrder(response.data);
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    toast.success('Payment successful!');
    navigate('/orders');
  };

  const renderShippingForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            value={shippingAddress.fullName}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, fullName: e.target.value })
            }
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, address: e.target.value })
            }
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            value={shippingAddress.state}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, state: e.target.value })
            }
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Postal Code"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
            }
            error={!!errors.postalCode}
            helperText={errors.postalCode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Country"
            value={shippingAddress.country}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, country: e.target.value })
            }
            error={!!errors.country}
            helperText={errors.country}
          />
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderOrderReview = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          {cart && cart.items && cart.items.map((item) => (
            <Card key={item._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="subtitle1">{item.product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" align="right">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" align="right">
            Total: ₹{calculateTotal().toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderPayment = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Complete Your Payment
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Amount: ₹{calculateTotal().toFixed(2)}
        </Typography>
        <PaymentButton
          amount={calculateTotal()}
          orderId={order?._id}
          onSuccess={handlePaymentSuccess}
        />
      </Box>
    </motion.div>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <AnimatePresence mode="wait">
          {activeStep === 0 && renderShippingForm()}
          {activeStep === 1 && renderOrderReview()}
          {activeStep === 2 && renderPayment()}
        </AnimatePresence>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep !== steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 2 ? 'Place Order' : 'Next'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;
