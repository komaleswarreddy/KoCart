import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { getMyOrders } from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MotionCard = motion(Card);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyOrders();
      if (response && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Order #{order._id}
                  </Typography>
                  <Chip
                    label={order.isPaid ? 'Paid' : 'Pending'}
                    color={order.isPaid ? 'success' : 'warning'}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {order.orderItems && order.orderItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        {item.product && (
                          <>
                            <Box
                              component="img"
                              src={item.product.imageUrl || '/placeholder-image.jpg'}
                              alt={item.product.name || 'Product'}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                                mr: 2,
                              }}
                              loading="lazy"
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {item.product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Quantity: {item.quantity}
                              </Typography>
                              <Typography variant="body2" color="primary">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ordered on: {format(new Date(order.createdAt), 'PPP')}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total: ${order.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrdersPage;
