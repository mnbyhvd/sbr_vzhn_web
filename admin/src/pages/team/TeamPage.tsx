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

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  textColor: string;
  bgColor: string;
  order?: number;
}

const SortableItem: React.FC<{ member: TeamMember; onEdit: (m: TeamMember) => void; onDelete: (id: number) => void }> = ({ member, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: member.id });

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
        src={member.image && member.image.length > 0
          ? (member.image.startsWith('http') ? member.image : `/api${member.image}`)
          : undefined}
        alt={member.name}
        sx={{ 
          width: 50, 
          height: 50, 
          mr: 2,
          bgcolor: member.bgColor,
          color: member.textColor,
          fontSize: '1.2rem',
          fontWeight: 600,
          objectFit: 'cover',
        }}
      >
        {!member.image && member.name.charAt(0).toUpperCase()}
      </Avatar>
      <ListItemText
        primary={member.name}
        secondary={
          <Box component="span">
            <Typography variant="body2" component="span">
              {member.role} | Цвет текста: {member.textColor} | Цвет фона: {member.bgColor}
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
          onClick={() => onEdit(member)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(member.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    image: '', 
    textColor: '#222222', 
    bgColor: '#ffffff' 
  });
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});
  const [deleting, setDeleting] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const data = await getDataWithFallback('/api/team');
      setTeamMembers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setSnackbar({open: true, message: 'Ошибка загрузки команды', severity: 'error'});
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingMember) {
        await safeApiCall(`/api/team/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await safeApiCall('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setOpenDialog(false);
      setEditingMember(null);
      setFormData({ name: '', role: '', image: '', textColor: '#222222', bgColor: '#ffffff' });
      fetchTeamMembers();
      setSnackbar({open: true, message: 'Участник сохранён', severity: 'success'});
    } catch (error) {
      console.error('Error saving team member:', error);
      setSnackbar({open: true, message: 'Ошибка сохранения', severity: 'error'});
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ 
      name: member.name, 
      role: member.role, 
      image: member.image, 
      textColor: member.textColor, 
      bgColor: member.bgColor 
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    setDeleting(teamMembers.find(m => m.id === id) || null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await safeApiCall(`/api/team/${deleting.id}`, {
        method: 'DELETE',
      });
      setDeleting(null);
      fetchTeamMembers();
      setSnackbar({open: true, message: 'Участник удалён', severity: 'success'});
    } catch (error) {
      setSnackbar({open: true, message: 'Ошибка удаления', severity: 'error'});
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTeamMembers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Обновляем порядок в базе данных
        newItems.forEach(async (item, index) => {
          try {
            await safeApiCall(`/api/team/${item.id}`, {
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
  const filteredMembers = teamMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Команда
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Добавить участника
        </Button>
      </Box>

      {/* Поиск */}
      <TextField
        placeholder="Поиск по имени или роли..."
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
              items={filteredMembers.map(m => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {filteredMembers.map((member) => (
                  <SortableItem
                    key={member.id}
                    member={member}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {filteredMembers.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Нет участников</Box>
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
          {editingMember ? 'Редактировать участника' : 'Добавить нового участника'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Имя"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Роль"
            fullWidth
            variant="outlined"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <ImageUpload
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
              label="Фото участника"
            />
            {/* Превью изображения */}
            {formData.image && (
              <Box sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                <img src={formData.image} alt="photo preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #eee', background: '#fff' }} />
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
                src={formData.image}
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
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formData.name || 'Имя участника'}
                </Typography>
                <Typography variant="body2" sx={{ color: formData.textColor, opacity: 0.7 }}>
                  {formData.role || 'Роль'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
            {editingMember ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Подтверждение удаления */}
      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" TransitionComponent={Slide}>
        <DialogTitle>Удалить участника?</DialogTitle>
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

export default TeamPage; 