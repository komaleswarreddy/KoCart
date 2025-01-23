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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  useTheme,
  alpha,
  TablePagination,
  Chip,
  Fade,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ImageDropzone from './ImageDropzone';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/adminService';

const ProductList = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    countInStock: '',
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts();
      setProducts(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch products');
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setProductForm({
      name: '',
      price: '',
      description: '',
      category: '',
      countInStock: '',
      image: null,
    });
    setDialogOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      countInStock: product.countInStock,
      image: product.image,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
    setError('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (file) => {
    setProductForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!productForm.name || !productForm.price || !productForm.category || !productForm.description) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('description', productForm.description);
      formData.append('countInStock', productForm.countInStock || 0);

      // Append image if exists
      if (productForm.image instanceof File) {
        formData.append('image', productForm.image);
      }

      if (selectedProduct) {
        await updateProduct(selectedProduct._id, formData);
      } else {
        await createProduct(formData);
      }

      handleDialogClose();
      fetchProducts();
    } catch (error) {
      setError(error.message || 'An error occurred while saving the product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
        await fetchProducts();
      } catch (error) {
        toast.error(error.message || 'Error deleting product');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          minHeight: '500px',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2" sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <InventoryIcon /> Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              background: theme.palette.success.main,
              '&:hover': {
                background: theme.palette.success.dark,
              },
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Add New Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Fade in={!loading} timeout={300}>
          <Box>
            {loading ? (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="400px"
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    mb: 2
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((product) => (
                        <TableRow key={product._id} hover>
                          <TableCell>
                            <Box
                              component="img"
                              src={product.image || '/placeholder.png'}
                              alt={product.name}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                              onError={(e) => {
                                e.target.src = '/placeholder.png';
                              }}
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={product.category}
                              size="small"
                              sx={{ 
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main
                              }}
                            />
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${product.countInStock} in stock`}
                              color={product.countInStock > 0 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit Product">
                              <IconButton
                                onClick={() => handleEditClick(product)}
                                sx={{ color: theme.palette.primary.main }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Product">
                              <IconButton
                                onClick={() => handleDeleteProduct(product._id)}
                                sx={{ color: theme.palette.error.main }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  component="div"
                  count={products.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Box>
        </Fade>

        <Dialog 
          open={dialogOpen} 
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 600
          }}>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <ImageDropzone
                  onImageUpload={handleImageUpload}
                  existingImage={selectedProduct?.image}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Product Name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="category"
                  label="Category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  value={productForm.price}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="countInStock"
                  label="Stock Count"
                  type="number"
                  value={productForm.countInStock}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  variant="outlined"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={productForm.description}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={handleDialogClose}
              variant="outlined"
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                ml: 2
              }}
            >
              {loading ? 'Processing...' : selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default ProductList;
