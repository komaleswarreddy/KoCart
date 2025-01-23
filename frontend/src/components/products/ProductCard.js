import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Skeleton,
  IconButton,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { addToCart } from '../../services/api';
import { toast } from 'react-toastify';

const ProductCard = ({ product, onCartUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      if (!localStorage.getItem('token')) {
        toast.error('Please login to add items to cart');
        return;
      }
      await addToCart(product._id, 1);
      toast.success('Added to cart successfully');
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add to cart';
      toast.error(errorMessage);
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden' }}>
        {loading && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        )}
        <CardMedia
          component="img"
          image={product.imageUrl}
          alt={product.name}
          onLoad={handleImageLoad}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
          loading="lazy"
        />
        {product.discount > 0 && (
          <Chip
            label={`${product.discount}% OFF`}
            color="error"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.6em',
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.numReviews})
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
            flexGrow: 1,
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            {product.discount > 0 ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
          <IconButton
            color="primary"
            onClick={handleAddToCart}
            disabled={addingToCart}
            sx={{
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s',
              },
            }}
          >
            <AddShoppingCartIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
