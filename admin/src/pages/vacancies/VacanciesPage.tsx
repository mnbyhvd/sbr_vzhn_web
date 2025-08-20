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
  Chip,
  Snackbar,
  Alert,
  Slide,
  InputAdornment,
  Tooltip,
  MenuItem,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Work as WorkIcon } from '@mui/icons-material';
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

interface Vacancy {
  id: number;
  title: string;
  description: string;
  requirements: string;
  textColor: string;
  bgColor: string;
  createdAt?: string;
  categoryId?: number; // Added categoryId
  category?: VacancyCategory; // Added category
  // Новые опциональные поля
  salary?: string;
  location?: string;
  workFormat?: string;
  schedule?: string;
  publishedAt?: string;
  hrContact?: string;
  bonuses?: string;
  selectionStages?: string;
  stack?: string;
  experience?: string;
  education?: string;
  links?: string;
  pdf?: string;
  image?: string; // Added image field
}

interface VacancyCategory {
  id: number;
  name: string;
}

const SortableItem: React.FC<{ vacancy: Vacancy; onEdit: (v: Vacancy) => void; onDelete: (id: number) => void; }> = ({ vacancy, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: vacancy.id });

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
        src={vacancy.image && vacancy.image.length > 0
          ? (vacancy.image.startsWith('http') ? vacancy.image : `/api${vacancy.image}`)
          : undefined}
        alt={vacancy.title}
        sx={{ 
          width: 50, 
          height: 50, 
          mr: 2,
          bgcolor: vacancy.bgColor,
          color: vacancy.textColor,
          fontSize: '1.2rem',
          fontWeight: 600,
          objectFit: 'cover',
        }}
      >
        {!(vacancy.image && vacancy.image.length > 0) && <WorkIcon />}
      </Avatar>
      <ListItemText
        primary={vacancy.title}
        secondary={
          <Box component="span">
            <Typography variant="body2" component="span" sx={{ mb: 0.5 }}>
              {vacancy.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`Цвет текста: ${vacancy.textColor}`} size="small" />
              <Chip label={`Цвет фона: ${vacancy.bgColor}`} size="small" />
              {vacancy.category && (
                <Chip label={`Категория: ${vacancy.category.name}`} size="small" />
              )}
              {vacancy.createdAt && (
                <Chip 
                  label={new Date(vacancy.createdAt).toLocaleDateString()} 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        }
        secondaryTypographyProps={{ component: 'span' }}
        sx={{ flex: 1 }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => onEdit(vacancy)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(vacancy.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const VacanciesPage: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    requirements: '', 
    textColor: '#222222', 
    bgColor: '#ffffff',
    categoryId: undefined as number | undefined,
    // Новые поля
    salary: '',
    location: '',
    workFormat: '',
    schedule: '',
    publishedAt: '',
    hrContact: '',
    bonuses: '',
    selectionStages: '',
    stack: '',
    experience: '',
    education: '',
    links: '',
    pdf: '',
  });
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});
  const [deleting, setDeleting] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<VacancyCategory[]>([]);
  const [vacancyError, setVacancyError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchVacancies();
    fetchCategories();
  }, []);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const data = await getDataWithFallback('/api/vacancies');
      if (Array.isArray(data)) {
        setVacancies(data);
        setVacancyError(null);
      } else {
        setVacancies([]);
        setVacancyError('Ошибка загрузки вакансий');
      }
      setLoading(false);
    } catch (error) {
      setVacancies([]);
      setVacancyError('Ошибка загрузки вакансий');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getDataWithFallback('/api/vacancies/categories');
      if (Array.isArray(data)) {
        setCategories(data);
        setCategoryError(null);
      } else {
        setCategories([]);
        setCategoryError('Ошибка загрузки категорий');
      }
    } catch (error) {
      setCategories([]);
      setCategoryError('Ошибка загрузки категорий');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingVacancy) {
        await safeApiCall(`/api/vacancies/${editingVacancy.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await safeApiCall('/api/vacancies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setOpenDialog(false);
      setEditingVacancy(null);
      setFormData({ title: '', description: '', requirements: '', textColor: '#222222', bgColor: '#ffffff', categoryId: undefined, salary: '', location: '', workFormat: '', schedule: '', publishedAt: '', hrContact: '', bonuses: '', selectionStages: '', stack: '', experience: '', education: '', links: '', pdf: '' });
      fetchVacancies();
      setSnackbar({open: true, message: 'Вакансия сохранена', severity: 'success'});
    } catch (error) {
      setSnackbar({open: true, message: 'Ошибка сохранения', severity: 'error'});
    }
  };

  const handleEdit = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setFormData({ 
      title: vacancy.title, 
      description: vacancy.description, 
      requirements: vacancy.requirements, 
      textColor: vacancy.textColor, 
      bgColor: vacancy.bgColor,
      categoryId: vacancy.categoryId,
      salary: vacancy.salary || '',
      location: vacancy.location || '',
      workFormat: vacancy.workFormat || '',
      schedule: vacancy.schedule || '',
      publishedAt: vacancy.publishedAt || '',
      hrContact: vacancy.hrContact || '',
      bonuses: vacancy.bonuses || '',
      selectionStages: vacancy.selectionStages || '',
      stack: vacancy.stack || '',
      experience: vacancy.experience || '',
      education: vacancy.education || '',
      links: vacancy.links || '',
      pdf: vacancy.pdf || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    setDeleting(vacancies.find(v => v.id === id) || null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await safeApiCall(`/api/vacancies/${deleting.id}`, {
        method: 'DELETE',
      });
      setDeleting(null);
      fetchVacancies();
      setSnackbar({open: true, message: 'Вакансия удалена', severity: 'success'});
    } catch (error) {
      setSnackbar({open: true, message: 'Ошибка удаления', severity: 'error'});
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setVacancies((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        newItems.forEach(async (item, index) => {
          try {
            await safeApiCall(`/api/vacancies/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...item, order: index }),
            });
          } catch (error) {
            setSnackbar({open: true, message: 'Ошибка обновления порядка', severity: 'error'});
          }
        });

        return newItems;
      });
    }
  };

  const safeVacancies = Array.isArray(vacancies) ? vacancies : [];
  const filteredVacancies = safeVacancies.filter(v => v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Вакансии
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить вакансию
        </Button>
      </Box>

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

      {vacancyError && (
        <Alert severity="error" sx={{ mb: 2 }}>{vacancyError}</Alert>
      )}
      {categoryError && (
        <Alert severity="error" sx={{ mb: 2 }}>{categoryError}</Alert>
      )}

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
              items={filteredVacancies.map(v => v.id)}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {filteredVacancies.map((vacancy) => (
                  <SortableItem
                    key={vacancy.id}
                    vacancy={vacancy}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {filteredVacancies.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Нет вакансий</Box>
                )}
              </List>
            </SortableContext>
          </DndContext>
        )}
      </Paper>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" TransitionComponent={Slide}>
        <DialogTitle>Удалить вакансию?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить <b>{deleting?.title}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Удалить</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default VacanciesPage; 