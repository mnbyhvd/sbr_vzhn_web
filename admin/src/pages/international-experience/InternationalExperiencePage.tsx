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
  Chip,
  Grid,
  Paper
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

interface InternationalExperience {
  id: number;
  title: string;
  details?: string;
  order?: number;
}

const SortableItem: React.FC<{ experience: InternationalExperience; onEdit: (exp: InternationalExperience) => void; onDelete: (id: number) => void }> = ({ experience, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: experience.id });

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
      <ListItemText
        primary={experience.title}
        secondary={experience.details}
        sx={{ flex: 1 }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => onEdit(experience)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(experience.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const InternationalExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<InternationalExperience[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExperience, setEditingExperience] = useState<InternationalExperience | null>(null);
  const [formData, setFormData] = useState({ title: '', details: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    console.log('🔄 Fetching experiences...');
    try {
      const data = await getDataWithFallback('/api/international-experience');
      console.log('✅ Experiences loaded:', data);
      setExperiences(data);
    } catch (error) {
      console.error('❌ Error fetching experiences:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingExperience) {
        await safeApiCall(`/api/international-experience/${editingExperience.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await safeApiCall('/api/international-experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setOpenDialog(false);
      setEditingExperience(null);
      setFormData({ title: '', details: '' });
      fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleEdit = (experience: InternationalExperience) => {
    setEditingExperience(experience);
    setFormData({ title: experience.title, details: experience.details || '' });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот опыт?')) {
      try {
        await safeApiCall(`/api/international-experience/${id}`, {
          method: 'DELETE',
        });
        fetchExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setExperiences((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Обновляем порядок в базе данных
        newItems.forEach(async (item, index) => {
          try {
            await safeApiCall(`/api/international-experience/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...item, order: index }),
            });
          } catch (error) {
            console.error('Error updating order:', error);
          }
        });

        return newItems;
      });
    }
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Международный опыт
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить опыт
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={experiences.map(exp => exp.id)}
            strategy={verticalListSortingStrategy}
          >
            <List>
              {experiences.map((experience) => (
                <SortableItem
                  key={experience.id}
                  experience={experience}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingExperience ? 'Редактировать опыт' : 'Добавить новый опыт'}
        </DialogTitle>
        <DialogContent>
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
            label="Описание (необязательно)"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingExperience ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InternationalExperiencePage; 