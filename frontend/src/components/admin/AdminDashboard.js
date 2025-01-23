import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Fade,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getDashboardStats } from '../../services/adminApi';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, color }) => (
  <Fade in={true}>
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        backgroundColor: color,
        color: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3">{value}</Typography>
    </Paper>
  </Fade>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.response?.data?.message || 'Failed to fetch dashboard statistics');
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchDashboardStats}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  const salesChartData = {
    labels: stats?.salesData.map((item) => item._id) || [],
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: stats?.salesData.map((item) => item.sales) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Sales Last 7 Days',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            color="#ed6c02"
          />
        </Grid>

        {/* Sales Chart */}
        <Grid item xs={12}>
          <Fade in={true} delay={200}>
            <Paper sx={{ p: 3 }}>
              <Line data={salesChartData} options={chartOptions} />
            </Paper>
          </Fade>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <Fade in={true} delay={400}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Selling Products
              </Typography>
              {stats?.topProducts.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography>{product.name}</Typography>
                  <Typography color="primary">
                    {product.totalSold} units sold
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
