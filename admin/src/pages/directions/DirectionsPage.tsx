import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Chip,
  Snackbar,
  Alert,
  Slide,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Category as CategoryIcon } from '@mui/icons-material';
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

interface Direction {
  id: number;
  title: string;
  description: string;
  gridSize: number;
  textColor: string;
  bgColor: string;
  createdAt?: string;
  order?: number;
}

const SortableItem: React.FC<{ direction: Direction; onEdit: (d: Direction) => void; onDelete: (id: number) => void }> = ({ direction, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: direction.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        '&:active': { cursor: 'grabbing' }
      }}
    >
      <Avatar
        sx={{ 
          width: 50, 
          height: 50, 
          mr: 2,
          bgcolor: direction.bgColor,
          color: direction.textColor,
          fontSize: '1.2rem',
          fontWeight: 600
        }}
      >
        <CategoryIcon />
      </Avatar>
      <ListItemText
        primary={direction.title}
        secondary={
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {direction.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`Размер сетки: ${direction.gridSize}x${direction.gridSize}`} size="small" />
              <Chip label={`Цвет текста: ${direction.textColor}`} size="small" />
              <Chip label={`Цвет фона: ${direction.bgColor}`} size="small" />
              {direction.createdAt && (
                <Chip 
                  label={new Date(direction.createdAt).toLocaleDateString()} 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        }
        sx={{ flex: 1 }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => onEdit(direction)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(direction.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const DirectionsPage: React.FC = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    gridSize: 4, 
    textColor: '#222222', 
    bgColor: '#ffffff' 
  });
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});
  const [deleting, setDeleting] = useState<Direction | null>(null);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchDirections();
  }, []);

  const fetchDirections = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/directions');
      const data = await response.json();
      setDirections(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching directions:', error);
      setSnackbar({open: true, message: 'Ошибка загрузки направлений', severity: 'error'});
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingDirection) {
        await fetch(`http://localhost:3000/api/directions/${editingDirection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('http://localhost:3000/api/directions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setOpenDialog(false);
      setEditingDirection(null);
      setFormData({ title: '', description: '', gridSize: 4, textColor: '#222222', bgColor: '#ffffff' });
      fetchDirections();
      setSnackbar({open: true, message: 'Направление сохранено', severity: 'success'});
    } catch (error) {
      console.error('Error saving direction:', error);
      setSnackbar({open: true, message: 'Ошибка сохранения', severity: 'error'});
    }
  };

  const handleEdit = (direction: Direction) => {
    setEditingDirection(direction);
    setFormData({ 
      title: direction.title, 
      description: direction.description, 
      gridSize: direction.gridSize, 
      textColor: direction.textColor, 
      bgColor: direction.bgColor 
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    setDeleting(directions.find(d => d.id === id) || null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await fetch(`http://localhost:3000/api/directions/${deleting.id}`, {
        method: 'DELETE',
      });
      setDeleting(null);
      fetchDirections();
      setSnackbar({open: true, message: 'Направление удалено', severity: 'success'});
    } catch (error) {
      setSnackbar({open: true, message: 'Ошибка удаления', severity: 'error'});
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setDirections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Обновляем порядок в базе данных
        newItems.forEach(async (item, index) => {
          try {
            await fetch(`http://localhost:3000/api/directions/${item.id}`, {
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
  const filteredDirections = directions.filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Направления
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить направление
        </Button>
      </Box>

      {/* Поиск */}
      <TextField
        placeholder="Поиск по названию или описанию..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2, maxWidth: 400 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
        }}
      />

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Загрузка...</Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredDirections.map(d => d.id)}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {filteredDirections.map((direction) => (
                  <SortableItem
                    key={direction.id}
                    direction={direction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {filteredDirections.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Нет направлений</Box>
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
          {editingDirection ? 'Редактировать направление' : 'Добавить новое направление'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Размер сетки"
              type="number"
              value={formData.gridSize}
              onChange={(e) => setFormData({ ...formData, gridSize: Number(e.target.value) })}
              sx={{ width: 180 }}
              InputLabelProps={{ shrink: true }}
            />
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
          {/* Превью */}
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
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  bgcolor: formData.bgColor,
                  color: formData.textColor,
                }}
              >
                <CategoryIcon />
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formData.title || 'Название направления'}
                </Typography>
                <Typography variant="body2" sx={{ color: formData.textColor, opacity: 0.7 }}>
                  {formData.description || 'Описание'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
            {editingDirection ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Подтверждение удаления */}
      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" TransitionComponent={Slide}>
        <DialogTitle>Удалить направление?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить <b>{deleting?.title}</b>?</Typography>
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

export default DirectionsPage; 