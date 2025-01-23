import React from 'react';
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Slider,
  Typography,
} from '@mui/material';

const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Others',
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const ProductFilters = ({ filters, onFilterChange }) => {
  const handlePriceChange = (event, newValue) => {
    onFilterChange({
      ...filters,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={filters.search || ''}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />

        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category || 'All'}
            label="Category"
            onChange={(e) =>
              onFilterChange({ ...filters, category: e.target.value })
            }
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sort || 'newest'}
            label="Sort By"
            onChange={(e) =>
              onFilterChange({ ...filters, sort: e.target.value })
            }
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={[filters.minPrice || 0, filters.maxPrice || 1000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{ mt: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            $0
          </Typography>
          <Typography variant="body2" color="text.secondary">
            $1000
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductFilters;
