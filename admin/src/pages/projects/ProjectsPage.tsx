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
  Autocomplete
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

interface Direction {
  id: number;
  title: string;
}
interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  client: string;
  industry: string;
  technologies: string;
  details: string;
  textColor: string;
  bgColor: string;
  order?: number;
  directions?: Direction[];
  // Новые опциональные поля
  startDate?: string;
  endDate?: string;
  team?: string;
  links?: string;
  status?: string;
  curator?: string;
  budget?: string;
  tools?: string;
  feedback?: string;
  presentation?: string;
}

const SortableItem: React.FC<{ project: Project; onEdit: (p: Project) => void; onDelete: (id: number) => void }> = ({ project, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

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
        src={project.image && project.image.length > 0
          ? (project.image.startsWith('http') ? project.image : `/api${project.image}`)
          : undefined}
        alt={project.title}
        sx={{ 
          width: 50, 
          height: 50, 
          mr: 2,
          bgcolor: project.bgColor,
          color: project.textColor,
          fontSize: '1.2rem',
          fontWeight: 600,
          objectFit: 'cover',
        }}
      >
        {!project.image && project.title.charAt(0).toUpperCase()}
      </Avatar>
      <ListItemText
        primary={project.title}
        secondary={
          <Box component="span">
            <Typography variant="body2" component="span" sx={{ mb: 0.5 }}>
              {project.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              {project.directions && project.directions.map(dir => (
                <Chip key={dir.id} label={dir.title} size="small" color="primary" />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={project.client} size="small" />
              <Chip label={project.industry} size="small" />
              <Chip label={`Цвет текста: ${project.textColor}`} size="small" />
              <Chip label={`Цвет фона: ${project.bgColor}`} size="small" />
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
          onClick={() => onEdit(project)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(project.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    image: '', 
    client: '', 
    industry: '', 
    technologies: '', 
    details: '', 
    textColor: '#222222', 
    bgColor: '#ffffff',
    directionIds: [] as number[],
    // Новые поля
    startDate: '',
    endDate: '',
    team: '',
    links: '',
    status: '',
    curator: '',
    budget: '',
    tools: '',
    feedback: '',
    presentation: '',
  });
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [filterDirections, setFilterDirections] = useState<Direction[]>([]);
  const [filterClient, setFilterClient] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Загрузка направлений
  useEffect(() => {
    safeApiCall('/api/directions')
      .then(res => res.json())
      .then(setDirections);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [filterDirections, filterClient, search]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDirections.length > 0) {
        filterDirections.forEach(d => params.append('directionId', String(d.id)));
      }
      if (filterClient) params.append('client', filterClient);
      if (search) params.append('search', search);
      const response = await safeApiCall('/api/projects?' + params.toString());
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setSnackbar({open: true, message: 'Ошибка загрузки проектов', severity: 'error'});
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const directionIds = formData['directionIds'] || [];
      const payload = { ...formData, directionIds };
      if (editingProject) {
        await safeApiCall(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await safeApiCall('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setOpenDialog(false);
      setEditingProject(null);
      setFormData({ 
        title: '', 
        description: '', 
        image: '', 
        client: '', 
        industry: '', 
        technologies: '', 
        details: '', 
        textColor: '#222222', 
        bgColor: '#ffffff',
        directionIds: [],
        startDate: '',
        endDate: '',
        team: '',
        links: '',
        status: '',
        curator: '',
        budget: '',
        tools: '',
        feedback: '',
        presentation: '',
      });
      fetchProjects();
      setSnackbar({open: true, message: 'Проект сохранён', severity: 'success'});
    } catch (error) {
      console.error('Error saving project:', error);
      setSnackbar({open: true, message: 'Ошибка сохранения', severity: 'error'});
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({ 
      title: project.title, 
      description: project.description, 
      image: project.image || '', 
      client: project.client, 
      industry: project.industry, 
      technologies: project.technologies, 
      details: project.details, 
      textColor: project.textColor, 
      bgColor: project.bgColor,
      directionIds: project.directions ? project.directions.map(d => d.id) : [],
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      team: project.team || '',
      links: project.links || '',
      status: project.status || '',
      curator: project.curator || '',
      budget: project.budget || '',
      tools: project.tools || '',
      feedback: project.feedback || '',
      presentation: project.presentation || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    setDeleting(projects.find(p => p.id === id) || null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await safeApiCall(`/api/projects/${deleting.id}`, {
        method: 'DELETE',
      });
      setDeleting(null);
      fetchProjects();
      setSnackbar({open: true, message: 'Проект удалён', severity: 'success'});
    } catch (error) {
      setSnackbar({open: true, message: 'Ошибка удаления', severity: 'error'});
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Обновляем порядок в базе данных
        newItems.forEach(async (item, index) => {
          try {
            await safeApiCall(`/api/projects/${item.id}`, {
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

  // Фильтрация по поиску теперь на сервере
  const filteredProjects = projects;

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Проекты
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingProject(null); setOpenDialog(true); }}
        >
          Добавить проект
        </Button>
      </Box>
      {/* Фильтры */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Autocomplete
          multiple
          options={directions}
          getOptionLabel={option => option.title}
          value={filterDirections}
          onChange={(_, v) => setFilterDirections(v)}
          renderInput={params => <TextField {...params} label="Фильтр по направлениям" size="small" />}
          sx={{ minWidth: 220 }}
        />
        <TextField
          label="Фильтр по клиенту"
          value={filterClient}
          onChange={e => setFilterClient(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        />
        <TextField
          placeholder="Поиск по всем полям..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
          }}
        />
      </Box>

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
              items={filteredProjects.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {filteredProjects.map((project) => (
                  <SortableItem
                    key={project.id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {filteredProjects.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Нет проектов</Box>
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
          {editingProject ? 'Редактировать проект' : 'Добавить новый проект'}
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
          <Box sx={{ mb: 2 }}>
            <ImageUpload
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
              label="Изображение проекта"
            />
            {/* Превью изображения */}
            {formData.image && (
              <Box sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                <img src={formData.image} alt="project preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee', background: '#fff' }} />
              </Box>
            )}
          </Box>
          <Autocomplete
            multiple
            options={directions}
            getOptionLabel={option => option.title}
            value={directions.filter(d => (formData.directionIds || []).includes(d.id))}
            onChange={(_, v) => setFormData({ ...formData, directionIds: v.map(d => d.id) })}
            renderInput={params => <TextField {...params} label="Направления" margin="dense" />}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Клиент"
            fullWidth
            variant="outlined"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Отрасль"
            fullWidth
            variant="outlined"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Технологии"
            fullWidth
            variant="outlined"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Детали"
            fullWidth
            variant="outlined"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField label="Дата начала" type="date" fullWidth variant="outlined" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Дата окончания" type="date" fullWidth variant="outlined" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Команда (JSON или текст)" fullWidth variant="outlined" value={formData.team} onChange={e => setFormData({ ...formData, team: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Ссылки (JSON или текст)" fullWidth variant="outlined" value={formData.links} onChange={e => setFormData({ ...formData, links: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Статус" fullWidth variant="outlined" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Куратор" fullWidth variant="outlined" value={formData.curator} onChange={e => setFormData({ ...formData, curator: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Бюджет" fullWidth variant="outlined" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Инструменты" fullWidth variant="outlined" value={formData.tools} onChange={e => setFormData({ ...formData, tools: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Отзывы" fullWidth variant="outlined" value={formData.feedback} onChange={e => setFormData({ ...formData, feedback: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Презентация (ссылка)" fullWidth variant="outlined" value={formData.presentation} onChange={e => setFormData({ ...formData, presentation: e.target.value })} sx={{ mb: 2 }} />
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
                src={formData.image && formData.image.length > 0 ? formData.image : undefined}
                alt={formData.title}
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  bgcolor: formData.bgColor,
                  color: formData.textColor,
                }}
              >
                {!formData.image && formData.title.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formData.title || 'Название проекта'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
            {editingProject ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Подтверждение удаления */}
      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" TransitionComponent={Slide}>
        <DialogTitle>Удалить проект?</DialogTitle>
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

export default ProjectsPage; 