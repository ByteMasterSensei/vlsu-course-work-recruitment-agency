import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { authService } from '../services/authService';
import { applicantProfileService } from '../services/applicantProfileService';

const MyProfilesPage = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['myProfiles'],
    queryFn: () => applicantProfileService.getMyProfiles(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => applicantProfileService.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfiles'] });
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    },
  });

  const handleDelete = (id: number) => {
    setProfileToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (profileToDelete) {
      deleteMutation.mutate(profileToDelete);
    }
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          backgroundColor: '#0D0D0D',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ maxWidth: '1440px', width: '100%', mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, fontWeight: 600, textDecoration: 'none', color: 'inherit' }}>
            Кадровое агентство
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/vacancies" 
            sx={{ mr: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Вакансии
          </Button>
          {user && (
            <Typography variant="body2" sx={{ mr: 2, color: '#8B8B8B' }}>
              {user.firstName} {user.lastName}
            </Typography>
          )}
          <Button 
            color="inherit" 
            onClick={() => { authService.logout(); navigate('/login'); }}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 3, md: 6 }, py: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.5rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Мои анкеты
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/profiles/new')}
            sx={{ textTransform: 'none' }}
          >
            Создать анкету
          </Button>
        </Box>

        {profiles && profiles.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                sx={{
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(99, 102, 241, 0.4)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h5" 
                        gutterBottom
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {profile.desiredPosition || 'Анкета без указания должности'}
                      </Typography>
                      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                        <Chip label={profile.status} size="small" />
                        {profile.desiredSalary && (
                          <Chip 
                            label={profile.desiredSalary} 
                            size="small" 
                            sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: '#8B8B8B' }}>
                        Создано: {new Date(profile.createdAt).toLocaleDateString('ru-RU')}
                      </Typography>
                      {profile.updatedAt && (
                        <Typography variant="body2" sx={{ color: '#8B8B8B' }}>
                          Обновлено: {new Date(profile.updatedAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" gap={1} sx={{ ml: 2 }}>
                      <IconButton
                        onClick={() => navigate(`/profiles/${profile.id}`)}
                        sx={{ color: '#8B8B8B', '&:hover': { color: '#6366f1' } }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => navigate(`/profiles/${profile.id}/edit`)}
                        sx={{ color: '#8B8B8B', '&:hover': { color: '#6366f1' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(profile.id)}
                        sx={{ color: '#8B8B8B', '&:hover': { color: '#FCA5A5' } }}
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
          <Box textAlign="center" py={8}>
            <Typography variant="h6" sx={{ color: '#8B8B8B', mb: 2 }}>
              У вас пока нет анкет
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/profiles/new')}
              sx={{ textTransform: 'none' }}
            >
              Создать первую анкету
            </Button>
          </Box>
        )}
      </Box>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#161616',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 8
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFFFFF' }}>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#8B8B8B' }}>Вы уверены, что хотите удалить эту анкету?</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#8B8B8B' }}
          >
            Отмена
          </Button>
          <Button 
            onClick={confirmDelete} 
            sx={{ 
              textTransform: 'none',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#DC2626' }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProfilesPage;
