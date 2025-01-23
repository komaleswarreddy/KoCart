import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  Fade,
} from '@mui/material';
import {
  ShoppingCart,
  People,
  LocalShipping,
  AttachMoney,
  Category,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getDashboardStats } from '../../services/adminService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error" variant="h5">
          {error}
        </Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      bgGradient: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      bgGradient: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <Category sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      bgGradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      bgGradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
    },
  ];

  const chartData = stats?.salesData?.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    revenue: item.revenue,
    orders: item.orders,
  })) || [];

  return (
    <Fade in={true}>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dashboard Overview
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Paper
                sx={{
                  p: 3,
                  background: card.bgGradient,
                  color: 'white',
                  borderRadius: 2,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                  },
                }}
                elevation={4}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 500, opacity: 0.9, mb: 1 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }}
              elevation={3}
            >
              <Typography variant="h6" gutterBottom>
                Revenue Overview
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={theme.palette.primary.main}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={theme.palette.primary.main}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }}
              elevation={3}
            >
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <List>
                {stats?.recentOrders?.map((order, index) => (
                  <React.Fragment key={order._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: order.isPaid
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                          }}
                        >
                          <ShoppingCart />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Order #${order._id.slice(-6)}`}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              ₹{order.totalPrice.toFixed(2)}
                            </Typography>
                            {' — '}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </>
                        }
                      />
                    </ListItem>
                    {index < stats.recentOrders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Dashboard;
