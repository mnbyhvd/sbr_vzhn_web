import { safeApiCall, getDataWithFallback } from "../../utils/api";
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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, QuestionAnswer as QuestionIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
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

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  createdAt?: string;
  order?: number;
}

const SortableItem: React.FC<{ item: FaqItem; onEdit: (i: FaqItem) => void; onDelete: (id: number) => void }> = ({ item, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

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
          bgcolor: 'primary.main',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 600
        }}
      >
        <QuestionIcon />
      </Avatar>
      <ListItemText
        primary={item.question}
        secondary={
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {item.answer.length > 100 ? `${item.answer.substring(0, 100)}...` : item.answer}
            </Typography>
            {item.createdAt && (
              <Chip 
                label={new Date(item.createdAt).toLocaleDateString()} 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>
        }
        sx={{ flex: 1 }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => onEdit(item)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(item.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [formData, setFormData] = useState({ 
    question: '', 
    answer: '' 
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    console.log('🔄 Fetching FAQs...');
    console.log('🔄 Fetching FAQs...');
    try {
      const data = await getDataWithFallback('/api/faq');
      console.log('✅ FAQs loaded:', data);
      console.log('✅ FAQs loaded:', data);
      setFaqs(data);
    } catch (error) {
      console.error('❌ Error fetching FAQs:', error);
      setFaqs([]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingFaq) {
        await safeApiCall(`/api/faq/${editingFaq.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await safeApiCall('/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setOpenDialog(false);
      setEditingFaq(null);
      setFormData({ question: '', answer: '' });
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFormData({ 
      question: faq.question, 
      answer: faq.answer 
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      try {
        await safeApiCall(`/api/faq/${id}`, {
          method: 'DELETE',
        });
        fetchFaqs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFaqs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Обновляем порядок в базе данных
        newItems.forEach(async (item, index) => {
          try {
            await safeApiCall(`/api/faq/${item.id}`, {
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
          FAQ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить вопрос
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={faqs.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <List>
              {faqs.map((faq) => (
                <SortableItem
                  key={faq.id}
                  item={faq}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFaq ? 'Редактировать вопрос' : 'Добавить новый вопрос'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Вопрос"
            fullWidth
            variant="outlined"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Ответ"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          {/* Превью */}
          <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Превью:</Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 2,
                      bgcolor: 'primary.main',
                      color: 'white',
                    }}
                  >
                    <QuestionIcon />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {formData.question || 'Вопрос'}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {formData.answer || 'Ответ на вопрос'}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFaq ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FaqPage; 