import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { applicantProfileService } from '../services/applicantProfileService';

const statusColors: Record<string, string> = {
  'Черновик': 'warning.light',
  'Активна': 'success.light',
  'Отправлена': 'info.light',
  'Архивная': 'grey.300',
};

const MyProfilesPage = () => {
  const navigate = useNavigate();
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'text.primary',
            }}
          >
            Мои анкеты
          </Typography>
          {profiles && profiles.length > 0 && (
            <Button
              startIcon={<Add />}
              onClick={() => navigate('/profiles/new')}
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                textTransform: 'none',
                color: 'white',
                bgcolor: 'text.primary',
                px: 2.5,
                py: 1,
                borderRadius: 0,
                letterSpacing: '-0.015em',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'text.secondary',
                },
              }}
            >
              Создать анкету
            </Button>
          )}
        </Box>

        {profiles && profiles.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {profiles.map((profile, index) => (
              <Card
                key={profile.id}
                className="fade-in"
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.06)',
                  borderRadius: 0,
                  transition: 'all 0.15s ease',
                  animationDelay: `${index * 0.05}s`,
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" gap={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                          color: 'text.primary',
                          mb: 1.5,
                        }}
                      >
                        {profile.desiredPosition || 'Анкета без указания должности'}
                      </Typography>
                      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                        <Chip
                          label={profile.status}
                          size="small"
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: statusColors[profile.status] || 'rgba(0, 0, 0, 0.06)',
                            color: 'text.primary',
                            borderRadius: 0,
                          }}
                        />
                        {profile.desiredSalary && (
                          <Chip
                            label={profile.desiredSalary}
                            size="small"
                            sx={{
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: 'rgba(0, 0, 0, 0.06)',
                              color: 'text.primary',
                              borderRadius: 0,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: 'text.secondary',
                        }}
                      >
                        Создано: {new Date(profile.createdAt).toLocaleDateString('ru-RU')}
                      </Typography>
                      {profile.updatedAt && (
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'text.disabled',
                          }}
                        >
                          Обновлено: {new Date(profile.updatedAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" gap={1} sx={{ ml: 2 }}>
                      <IconButton
                        onClick={() => navigate(`/profiles/${profile.id}`)}
                        sx={{
                          color: 'text.secondary',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            color: 'text.primary',
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => navigate(`/profiles/${profile.id}/edit`)}
                        sx={{
                          color: 'text.secondary',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            color: 'text.primary',
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(profile.id)}
                        sx={{
                          color: 'text.secondary',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            color: 'error.main',
                            bgcolor: 'action.hover',
                          },
                        }}
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
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.secondary',
                mb: 2,
              }}
            >
              У вас пока нет анкет
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1rem',
                fontWeight: 400,
                color: 'text.secondary',
                mb: 3,
              }}
            >
              Создайте свою первую анкету, чтобы начать поиск работы
            </Typography>
            <Button
              size="large"
              startIcon={<Add />}
              onClick={() => navigate('/profiles/new')}
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                textTransform: 'none',
                color: 'white',
                bgcolor: 'text.primary',
                px: 3,
                py: 1.25,
                borderRadius: 0,
                letterSpacing: '-0.015em',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'text.secondary',
                },
              }}
            >
              Создать первую анкету
            </Button>
          </Box>
        )}
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 400,
              color: 'text.secondary',
            }}
          >
            Вы уверены, что хотите удалить эту анкету? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'text.primary',
              bgcolor: 'transparent',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              px: 2.5,
              py: 1,
              borderRadius: 0,
              letterSpacing: '-0.015em',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                borderColor: 'rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'white',
              bgcolor: 'error.main',
              px: 2.5,
              py: 1,
              borderRadius: 0,
              letterSpacing: '-0.015em',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'error.dark',
              },
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
