import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Avatar,
  Tooltip,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { styled } from '@mui/material/styles';
import { getCart } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  '&:hover': {
    transform: 'translateY(-2px)',
    transition: 'transform 0.2s',
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = !!user;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await getCart();
        if (response && response.data) {
          setCartItemCount(response.data.items?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
        setCartItemCount(0);
      }
    };

    if (isAuthenticated) {
      fetchCartCount();
      const interval = setInterval(fetchCartCount, 5000);
      return () => clearInterval(interval);
    } else {
      setCartItemCount(0);
    }
  }, [isAuthenticated]);

  return (
    <AppBar position="sticky" elevation={2}>
      <Container>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              KoCart
            </Typography>
          </Box>

          {/* Center section */}
          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <StyledButton
                color="inherit"
                startIcon={<InventoryIcon />}
                onClick={() => navigate('/products')}
              >
                Products
              </StyledButton>
              <StyledButton
                color="inherit"
                startIcon={<LocalShippingIcon />}
                onClick={() => navigate('/orders/myorders')}
              >
                My Orders
              </StyledButton>
            </Box>
          )}

          {/* Right section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                {/* Show Admin Panel link if user is admin */}
                {(user?.role === 'admin' || user?.isAdmin) && (
                  <StyledButton
                    color="inherit"
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={() => navigate('/admin')}
                  >
                    Admin Panel
                  </StyledButton>
                )}
                
                <Tooltip title="Cart">
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/cart')}
                    sx={{ 
                      mr: 2,
                      '&:hover': { transform: 'scale(1.1)' },
                      transition: 'transform 0.2s'
                    }}
                  >
                    <StyledBadge badgeContent={cartItemCount} color="secondary">
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ 
                      ml: 1,
                      '&:hover': { transform: 'scale(1.1)' },
                      transition: 'transform 0.2s'
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <StyledButton
                  color="inherit"
                  onClick={() => navigate('/login')}
                >
                  Login
                </StyledButton>
                <StyledButton
                  color="inherit"
                  variant="outlined"
                  onClick={() => navigate('/register')}
                >
                  Register
                </StyledButton>
              </>
            )}
          </Box>
        </Toolbar>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/orders/myorders')}>
            <ListItemIcon>
              <LocalShippingIcon fontSize="small" />
            </ListItemIcon>
            My Orders
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Container>
    </AppBar>
  );
};

export default Navbar;
