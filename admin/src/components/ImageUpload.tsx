import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = 'Загрузить изображение', disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onChange(response.data.url);
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);
      setError(error.response?.data?.message || 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {value ? (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={`http://localhost:3000${value}`}
            alt="Preview"
            style={{
              width: '100%',
              maxWidth: 200,
              height: 120,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #ddd'
            }}
          />
          <IconButton
            onClick={handleDelete}
            disabled={disabled}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)',
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          component="span"
          onClick={handleClick}
          disabled={disabled || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          sx={{
            width: '100%',
            height: 120,
            border: '2px dashed #ccc',
            borderRadius: 2,
            '&:hover': {
              borderColor: 'primary.main',
            }
          }}
        >
          {uploading ? 'Загрузка...' : 'Выбрать файл'}
        </Button>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload; 