import { safeApiCall, getDataWithFallback } from "../../utils/api";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Avatar,
  Snackbar,
  Alert,
  Slide,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageUpload from '../../components/ImageUpload';

interface Partner {
  id: number;
  name: string;
  logo: string;
  textColor: string;
  bgColor: string;
  order?: number;
}

const SortableItem: React.FC<{ partner: Partner; onEdit: (p: Partner) => void; onDelete: (id: number) => void }> = ({ partner, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: partner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        src={partner.logo && partner.logo.length > 0
          ? (partner.logo.startsWith('http') ? partner.logo : `/api${partner.logo}`)
          : undefined}
        alt={partner.name}
        sx={{ 
          width: 50, 
          height: 50, 
          mr: 2,
          bgcolor: partner.bgColor,
          color: partner.textColor,
          fontSize: '1.2rem',
          fontWeight: 600,
          objectFit: 'cover',
        }}
      >
        {!partner.logo && partner.name.charAt(0).toUpperCase()}
      </Avatar>
      <ListItemText
        primary={partner.name}
        secondary={
          <Box component="span">
            <Typography variant="body2" component="span">
              Цвет текста: {partner.textColor} | Цвет фона: {partner.bgColor}
            </Typography>
          </Box>
        }
        secondaryTypographyProps={{ component: 'span' }}
        sx={{ flex: 1 }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => onEdit(partner)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(partner.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    logo: '', 
    textColor: '#222222', 
    bgColor: '#ffffff' 
  });
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});
  const [deleting, setDeleting] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    console.log('🔄 Fetching partners...');
    setLoading(true);
    try {
      const data = await getDataWithFallback('/api/partners');
      console.log('✅ Partners loaded:', data);
      setPartners(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching partners:', error);
      setSnackbar({open: true, message: 'Ошибка загрузки партнёров', severity: 'error'});
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingPartner) {
        await safeApiCall(`/api/partners/${editingPartner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await safeApiCall('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setOpenDialog(false);
      setEditingPartner(null);
      setFormData({ name: '', logo: '', textColor: '#222222', bgColor: '#ffffff' });
      fetchPartners();
      setSnackbar({open: true, message: 'Партнёр сохранён', severity: 'success'});
    } catch (error) {
      console.error('Error saving partner:', error);
      setSnackbar({open: true, message: 'Ошибка сохранения', severity: 'error'});
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({ 
      name: partner.name, 
      logo: partner.logo, 
      textColor: partner.textColor, 
      bgColor: partner.bgColor 
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    setDeleting(partners.find(p => p.id === id) || null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await safeApiCall(`/api/partners/${deleting.id}`, {
        method: 'DELETE',
      });
      setDeleting(null);
      fetchPartners();
      setSnackbar({open: true, message: 'Партнёр удалён', severity: 'success'});
    } catch (error) {
      setSnackbar({open: true, message: 'Ошибка удаления', severity: 'error'});
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPartners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Обновляем порядок в базе данных
        newItems.forEach(async (item, index) => {
          try {
            await safeApiCall(`/api/partners/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...item, order: index }),
            });
          } catch (error) {
            console.error('Error updating order:', error);
            setSnackbar({open: true, message: 'Ошибка обновления порядка', severity: 'error'});
          }
        });

        return newItems;
      });
    }
  };

  // Фильтрация по поиску
  const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ width: '100%', flex: 1, px: { xs: 2, md: 4 }, py: 3, boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Партнёры
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить партнёра
        </Button>
      </Box>
      <TextField
        placeholder="Поиск по названию..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2, maxWidth: 400 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
        }}
      />
      <Paper sx={{ p: 2, width: '100%', flex: 1, boxSizing: 'border-box' }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Загрузка...</Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredPartners.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <List sx={{ width: '100%' }}>
                {filteredPartners.map((partner) => (
                  <SortableItem
                    key={partner.id}
                    partner={partner}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {filteredPartners.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Нет партнёров</Box>
                )}
              </List>
            </SortableContext>
          </DndContext>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0.5 }}>
          {editingPartner ? 'Редактировать партнёра' : 'Добавить нового партнёра'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <ImageUpload
              value={formData.logo}
              onChange={(value) => setFormData({ ...formData, logo: value })}
              label="Логотип партнёра"
            />
            {/* Превью изображения */}
            {formData.logo && (
              <Box sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                <img src={formData.logo} alt="logo preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee', background: '#fff' }} />
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Цвет текста"
              type="color"
              value={formData.textColor}
              onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
              sx={{ width: 120 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Цвет фона"
              type="color"
              value={formData.bgColor}
              onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
              sx={{ width: 120 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {/* Превью блока */}
          <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Превью:</Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 1,
              background: formData.bgColor,
              color: formData.textColor,
            }}>
              <Avatar
                src={formData.logo}
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  bgcolor: formData.bgColor,
                  color: formData.textColor,
                }}
              >
                {formData.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formData.name || 'Название партнёра'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
            {editingPartner ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Подтверждение удаления */}
      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" TransitionComponent={Slide}>
        <DialogTitle>Удалить партнёра?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить <b>{deleting?.name}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Удалить</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PartnersPage;