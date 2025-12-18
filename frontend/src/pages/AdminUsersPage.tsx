import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Edit, Delete, Person, Email, Phone } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { adminService, type User, type UpdateUserDto } from '../services/adminService';

const roleLabels: Record<string, string> = {
  'Visitor': 'Посетитель',
  'Applicant': 'Соискатель',
  'Manager': 'Менеджер',
  'Admin': 'Администратор',
};

const roleColors: Record<string, { bg: string; color: string }> = {
  'Visitor': { bg: 'rgba(0, 0, 0, 0.06)', color: 'text.primary' },
  'Applicant': { bg: 'info.light', color: 'info.dark' },
  'Manager': { bg: 'warning.light', color: 'warning.dark' },
  'Admin': { bg: 'error.light', color: 'error.dark' },
};

const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<UpdateUserDto>({});
  const [error, setError] = useState<string>('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getAllUsers(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) => adminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setEditDialogOpen(false);
      setSelectedUser(null);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Ошибка при обновлении пользователя');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
  });

  const handleEditOpen = (user: User) => {
    setSelectedUser(user);
    const roleValue = user.role === 'Visitor' ? 0 : user.role === 'Applicant' ? 1 : user.role === 'Manager' ? 2 : 3;
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || '',
      phone: user.phone || '',
      role: roleValue,
      isActive: user.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteOpen = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: editData });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <CircularProgress sx={{ color: 'text.primary' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />

      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Breadcrumbs />
        <Typography
          sx={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'text.primary',
            mb: 4,
          }}
        >
          Управление пользователями
        </Typography>

        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
          Всего пользователей: {users?.length || 0}
        </Typography>

        {users && users.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {users.map((user, index) => (
              <Card
                key={user.id}
                className="fade-in"
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.06)',
                  borderRadius: 0,
                  animationDelay: `${index * 0.03}s`,
                  opacity: user.isActive ? 1 : 0.6,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" gap={2}>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {user.lastName} {user.firstName}{user.middleName ? ` ${user.middleName}` : ''}
                        </Typography>
                        {!user.isActive && (
                          <Chip
                            label="Неактивен"
                            size="small"
                            sx={{ fontSize: '0.7rem', bgcolor: 'error.light', color: 'error.dark', borderRadius: 0 }}
                          />
                        )}
                      </Box>
                      <Box display="flex" gap={2} mb={1.5} flexWrap="wrap">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Email sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {user.email}
                          </Typography>
                        </Box>
                        {user.phone && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Phone sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                              {user.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box display="flex" gap={1} alignItems="center">
                        <Chip
                          label={roleLabels[user.role] || user.role}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: roleColors[user.role]?.bg || 'rgba(0, 0, 0, 0.06)',
                            color: roleColors[user.role]?.color || 'text.primary',
                            borderRadius: 0,
                          }}
                        />
                        <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled' }}>
                          Зарегистрирован: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={() => handleEditOpen(user)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteOpen(user)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box textAlign="center" py={10}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: 'text.secondary' }}>
              Пользователи не найдены
            </Typography>
          </Box>
        )}
      </Box>

      {}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Редактировать пользователя</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="Имя"
              value={editData.firstName || ''}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Фамилия"
              value={editData.lastName || ''}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Отчество"
              value={editData.middleName || ''}
              onChange={(e) => setEditData({ ...editData, middleName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Телефон"
              value={editData.phone || ''}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                value={editData.role ?? 0}
                label="Роль"
                onChange={(e) => setEditData({ ...editData, role: e.target.value as number })}
              >
                <MenuItem value={0}>Посетитель</MenuItem>
                <MenuItem value={1}>Соискатель</MenuItem>
                <MenuItem value={2}>Менеджер</MenuItem>
                <MenuItem value={3}>Администратор</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={editData.isActive ?? true}
                  onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                />
              }
              label="Активный аккаунт"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: 0 }}>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            sx={{
              bgcolor: 'text.primary',
              color: 'white',
              borderRadius: 0,
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            {updateMutation.isPending ? <CircularProgress size={20} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить пользователя {selectedUser?.firstName} {selectedUser?.lastName}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 0 }}>
            Отмена
          </Button>
          <Button
            onClick={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              borderRadius: 0,
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;

