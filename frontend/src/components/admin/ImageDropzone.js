import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

const ImageDropzone = ({ onImageUpload, existingImage }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Update preview when existingImage changes
    if (existingImage) {
      // If it's a full URL or starts with /uploads/, use it directly
      setPreview(existingImage.startsWith('http') || existingImage.startsWith('/uploads/') 
        ? existingImage 
        : `/uploads/${existingImage}`);
    }
  }, [existingImage]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          onImageUpload(file); // Just pass the file, no need for preview
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
    maxSize: 5242880, // 5MB
  });

  return (
    <Fade in={true}>
      <Box>
        <Paper
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              minHeight: '200px',
              justifyContent: 'center',
            }}
          >
            {preview ? (
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2,
                }}
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
            ) : (
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: isDragActive ? 'primary.main' : 'grey.500',
                }}
              />
            )}
            <Typography variant="body1" color="textSecondary">
              {isDragActive
                ? 'Drop the image here'
                : preview
                ? 'Click or drag to replace image'
                : 'Drag & drop an image here, or click to select'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Supports: JPG, JPEG, PNG, WebP (Max 5MB)
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ImageDropzone;
