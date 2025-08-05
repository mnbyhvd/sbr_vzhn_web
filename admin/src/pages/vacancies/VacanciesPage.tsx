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
  Autocomplete,
  Badge
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Work as WorkIcon } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  responses?: VacancyResponse[]; // Added responses
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

interface VacancyResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const SortableItem: React.FC<{ vacancy: Vacancy; onEdit: (v: Vacancy) => void; onDelete: (id: number) => void; onShowResponses: (v: Vacancy) => void }> = ({ vacancy, onEdit, onDelete, onShowResponses }) => {
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
        <Badge badgeContent={vacancy.responses?.length || 0} color="primary" sx={{ mr: 2 }}>
          <IconButton edge="end" aria-label="responses" onClick={() => onShowResponses(vacancy)}>
            <VisibilityIcon />
          </IconButton>
        </Badge>
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
  const [openResponses, setOpenResponses] = useState(false);
  const [responses, setResponses] = useState<VacancyResponse[]>([]);
  const [responsesVacancy, setResponsesVacancy] = useState<Vacancy | null>(null);
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
    console.log('🔄 Fetching vacancies...');
    setLoading(true);
    try {
      const data = await getDataWithFallback('/api/vacancies');
      if (Array.isArray(data)) {
        console.log('✅ Vacancies loaded:', data);
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
    console.log('🔄 Fetching categories...');
    try {
      const data = await getDataWithFallback('/api/vacancies/categories');
      if (Array.isArray(data)) {
        console.log('✅ Categories loaded:', data);
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
      console.error('Error saving vacancy:', error);
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

        // Обновляем порядок в базе данных
        newItems.forEach(async (item, index) => {
          try {
            await safeApiCall(`/api/vacancies/${item.id}`, {
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

  const handleOpenResponses = async (vacancy: Vacancy) => {
    setResponsesVacancy(vacancy);
    const res = await safeApiCall(`/api/vacancies/${vacancy.id}/responses`);
    const data = await res.json();
    setResponses(data);
    setOpenResponses(true);
  };
  const handleCloseResponses = () => {
    setOpenResponses(false);
    setResponsesVacancy(null);
    setResponses([]);
  };

  // Фильтрация по поиску
  const safeVacancies = Array.isArray(vacancies) ? vacancies : [];
  const filteredVacancies = safeVacancies.filter(v => v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase()));

  const onShowResponses = handleOpenResponses;

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
                    onShowResponses={onShowResponses}
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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0.5 }}>
          {editingVacancy ? 'Редактировать вакансию' : 'Добавить новую вакансию'}
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
          <TextField
            margin="dense"
            label="Требования"
            fullWidth
            variant="outlined"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField label="Зарплата" fullWidth variant="outlined" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Город / Локация" fullWidth variant="outlined" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Формат работы" fullWidth variant="outlined" value={formData.workFormat} onChange={e => setFormData({ ...formData, workFormat: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="График" fullWidth variant="outlined" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Дата публикации" type="date" fullWidth variant="outlined" value={formData.publishedAt} onChange={e => setFormData({ ...formData, publishedAt: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Контакт HR" fullWidth variant="outlined" value={formData.hrContact} onChange={e => setFormData({ ...formData, hrContact: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Бонусы" fullWidth variant="outlined" value={formData.bonuses} onChange={e => setFormData({ ...formData, bonuses: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Этапы отбора" fullWidth variant="outlined" value={formData.selectionStages} onChange={e => setFormData({ ...formData, selectionStages: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Стек технологий" fullWidth variant="outlined" value={formData.stack} onChange={e => setFormData({ ...formData, stack: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Опыт работы" fullWidth variant="outlined" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Образование" fullWidth variant="outlined" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Ссылки (JSON или текст)" fullWidth variant="outlined" value={formData.links} onChange={e => setFormData({ ...formData, links: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="PDF (ссылка)" fullWidth variant="outlined" value={formData.pdf} onChange={e => setFormData({ ...formData, pdf: e.target.value })} sx={{ mb: 2 }} />
          <Autocomplete
            freeSolo
            options={categories.map(cat => cat.name)}
            value={categories.find(cat => cat.id === formData.categoryId)?.name || ''}
            onChange={async (event, newValue) => {
              if (typeof newValue === 'string') {
                const existing = categories.find(cat => cat.name === newValue);
                if (existing) {
                  setFormData({ ...formData, categoryId: existing.id });
                } else {
                  // Если введено новое название, создаём категорию
                  const response = await safeApiCall('/api/vacancies/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newValue }),
                  });
                  const created = await response.json();
                  setCategories(prev => [...prev, created]);
                  setFormData({ ...formData, categoryId: created.id });
                }
              } else {
                const selected = categories.find(cat => cat.name === newValue);
                setFormData({ ...formData, categoryId: selected?.id });
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Категория" fullWidth sx={{ mb: 2 }} />
            )}
          />
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
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  bgcolor: formData.bgColor,
                  color: formData.textColor,
                }}
              >
                <WorkIcon />
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formData.title || 'Название вакансии'}
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
            {editingVacancy ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Подтверждение удаления */}
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

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Диалог откликов */}
      <Dialog open={openResponses} onClose={handleCloseResponses} maxWidth="sm" fullWidth>
        <DialogTitle>Отклики на вакансию: {responsesVacancy?.title}</DialogTitle>
        <DialogContent>
          {responses.length === 0 ? (
            <Typography>Нет откликов</Typography>
          ) : (
            <List>
              {responses.map(resp => (
                <ListItem key={resp.id} alignItems="flex-start">
                  <ListItemText
                    primary={<>
                      <b>{resp.name}</b> — <a href={`mailto:${resp.email}`}>{resp.email}</a> — <a href={`tel:${resp.phone}`}>{resp.phone}</a>
                    </>}
                    secondary={<>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{resp.message}</Typography>
                      <Typography variant="caption" sx={{ color: 'grey.600' }}>{new Date(resp.createdAt).toLocaleString()}</Typography>
                    </>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResponses}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VacanciesPage; 