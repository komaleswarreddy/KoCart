import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  getAdminOrders,
  updateOrderToDelivered,
  deleteOrder,
} from '../../services/adminService';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const updatedOrder = await updateOrderToDelivered(orderId);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, isDelivered: true } : order
        )
      );
      toast.success('Order marked as delivered');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getStatusChip = (order) => {
    if (!order.isPaid) {
      return <Chip label="Not Paid" color="error" size="small" />;
    }
    if (!order.isDelivered) {
      return <Chip label="Not Delivered" color="warning" size="small" />;
    }
    return <Chip label="Completed" color="success" size="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Orders
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user?.name || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">₹{order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{getStatusChip(order)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton
                      onClick={() => handleViewOrder(order._id)}
                      color="info"
                      size="small"
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  {order.isPaid && !order.isDelivered && (
                    <Tooltip title="Mark as Delivered">
                      <IconButton
                        onClick={() => handleMarkDelivered(order._id)}
                        color="success"
                        size="small"
                      >
                        <ShippingIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {!order.isPaid && (
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDeleteOrder(order._id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderList;
