import React, { useRef, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ value, onChange, label = 'Загрузить файл', accept = '.pdf,.doc,.docx,.ppt,.pptx', disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    if (!allowedMime.includes(file.type)) {
      setError('Поддерживаются только PDF, DOC, DOCX, PPT, PPTX');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Размер файла не должен превышать 20MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      // Бэкенд ожидает поле "image", используем его и для документов
      formData.append('image', file);

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(response.data.url);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {value ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <a href={`/api${value}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Button variant="text" sx={{ px: 0 }}>{value.split('/').pop()}</Button>
          </a>
          <IconButton onClick={handleDelete} disabled={disabled} size="small"><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          component="span"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          startIcon={uploading ? <CircularProgress size={18} /> : <CloudUploadIcon />}
          sx={{ height: 44, borderRadius: 2 }}
        >
          {uploading ? 'Загрузка...' : 'Выбрать файл'}
        </Button>
      )}

      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
    </Box>
  );
};

export default FileUpload;


