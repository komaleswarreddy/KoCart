import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getMyOrders, deleteOrder } from '../../services/orderService';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      toast.error(error.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    window.location.href = `/order/${orderId}`;
  };

  const handleDeleteClick = (orderId) => {
    setSelectedOrderId(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(selectedOrderId);
      toast.success('Order deleted successfully');
      setOrders(orders.filter(order => order._id !== selectedOrderId));
    } catch (error) {
      toast.error(error.message || 'Error deleting order');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          My Orders
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography>No orders found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        My Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Delivered</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <Typography color="primary">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </Typography>
                  ) : (
                    <Typography color="error">Not Paid</Typography>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered ? (
                    <Typography color="primary">
                      Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </Typography>
                  ) : (
                    <Typography color="error">Not Delivered</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleViewOrder(order._id)}
                    title="View Order"
                  >
                    <Visibility />
                  </IconButton>
                  {!order.isPaid && (
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(order._id)}
                      title="Delete Order"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderList;
