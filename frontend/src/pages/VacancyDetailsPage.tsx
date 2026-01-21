import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { ArrowBack, Favorite, FavoriteBorder } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { authService } from '../services/authService';
import { vacancyService } from '../services/vacancyService';
import { favoriteVacancyService } from '../services/favoriteVacancyService';
import { vacancyApplicationService } from '../services/vacancyApplicationService';
import { applicantProfileService } from '../services/applicantProfileService';

const employmentTypeLabels: Record<string, string> = {
  'FullTime': 'Полная занятость',
  'PartTime': 'Частичная занятость',
  'Contract': 'Контракт',
  'Remote': 'Удалённая работа',
  'Internship': 'Стажировка',
};

const VacancyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = authService.getUser();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  const { data: vacancy, isLoading, error } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => vacancyService.getVacancyById(Number(id)),
    enabled: !!id,
  });

  const { data: favorites } = useQuery({
    queryKey: ['favoriteVacancies'],
    queryFn: () => favoriteVacancyService.getFavorites(),
    enabled: !!user,
  });

  const { data: myProfiles } = useQuery({
    queryKey: ['myProfiles'],
    queryFn: () => applicantProfileService.getMyProfiles(),
    enabled: !!user,
  });

  useEffect(() => {
    if (vacancy && favorites) {
      setIsFavorite(favorites.some((f) => f.id === vacancy.id));
    }
  }, [vacancy, favorites]);

  const addToFavoritesMutation = useMutation({
    mutationFn: (vacancyId: number) => favoriteVacancyService.addToFavorites(vacancyId),
    onSuccess: () => {
      setIsFavorite(true);
      setSnackbarMessage('Вакансия добавлена в избранное');
      setSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: ['favoriteVacancies'] });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: (vacancyId: number) => favoriteVacancyService.removeFromFavorites(vacancyId),
    onSuccess: () => {
      setIsFavorite(false);
      setSnackbarMessage('Вакансия удалена из избранного');
      setSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: ['favoriteVacancies'] });
    },
  });

  const handleFavoriteToggle = () => {
    if (!vacancy || !user) return;
    if (isFavorite) {
      removeFromFavoritesMutation.mutate(vacancy.id);
    } else {
      addToFavoritesMutation.mutate(vacancy.id);
    }
  };

  const handleApplyClick = () => {
    if (myProfiles && myProfiles.length > 0) {
      // Предвыбираем первый профиль
      setSelectedProfileId(myProfiles[0].id);
      setApplyDialogOpen(true);
    } else {
      setSnackbarMessage('Сначала создайте анкету в разделе "Мои анкеты"');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleApplySubmit = async () => {
    if (!selectedProfileId || !vacancy) return;
    try {
      await vacancyApplicationService.createApplication({
        applicantProfileId: selectedProfileId,
        vacancyId: vacancy.id,
        coverLetter: coverLetter || undefined,
      });
      setApplyDialogOpen(false);
      setCoverLetter('');
      setSnackbarMessage('Отклик успешно отправлен!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage(err.response?.data?.message || 'Ошибка при отправке отклика');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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

  if (error || !vacancy) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'error.main',
              mb: 2,
            }}
          >
            Вакансия не найдена
          </Typography>
          <Button
            onClick={() => navigate('/vacancies')}
            startIcon={<ArrowBack />}
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
            Вернуться к списку
          </Button>
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
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/vacancies')}
          sx={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '0.9375rem',
            fontWeight: 500,
            textTransform: 'none',
            color: 'text.secondary',
            px: 0,
            py: 1,
            mb: 3,
            borderRadius: 0,
            minWidth: 'auto',
            letterSpacing: '-0.015em',
            transition: 'all 0.15s ease',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'transparent',
            },
          }}
        >
          Назад к списку
        </Button>

        <Box
          className="fade-in"
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.06)',
            borderRadius: 0,
            p: { xs: 3, md: 4 },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={3} flexWrap="wrap" gap={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                  mb: 1.5,
                }}
              >
                {vacancy.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                }}
              >
                {vacancy.companyName}
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              {user && (
                <IconButton
                  onClick={handleFavoriteToggle}
                  sx={{
                    color: isFavorite ? 'error.main' : 'text.secondary',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              )}
              <Chip
                label={employmentTypeLabels[vacancy.employmentType] || vacancy.employmentType}
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  bgcolor: 'rgba(0, 0, 0, 0.06)',
                  color: 'text.primary',
                  borderRadius: 0,
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {vacancy.salaryRange && (
            <Box mb={4}>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: 'text.secondary',
                  mb: 1,
                  textTransform: 'uppercase',
                }}
              >
                Зарплата
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                {vacancy.salaryRange}
              </Typography>
            </Box>
          )}

          <Box mb={4}>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '-0.015em',
                color: 'text.secondary',
                mb: 2,
                textTransform: 'uppercase',
              }}
            >
              Описание
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 400,
                color: 'text.primary',
                lineHeight: 1.7,
              }}
            >
              {vacancy.description}
            </Typography>
          </Box>

          {vacancy.requirements && (
            <Box mb={4}>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: 'text.secondary',
                  mb: 2,
                  textTransform: 'uppercase',
                }}
              >
                Требования
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  lineHeight: 1.7,
                }}
              >
                {vacancy.requirements}
              </Typography>
            </Box>
          )}

          {vacancy.workingConditions && (
            <Box mb={4}>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: 'text.secondary',
                  mb: 2,
                  textTransform: 'uppercase',
                }}
              >
                Условия работы
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  lineHeight: 1.7,
                }}
              >
                {vacancy.workingConditions}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box mb={3}>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '-0.015em',
                color: 'text.secondary',
                mb: 2,
                textTransform: 'uppercase',
              }}
            >
              Контактная информация
            </Typography>
            {vacancy.contactPerson && (
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                <Box component="span" sx={{ fontWeight: 600 }}>Контактное лицо:</Box> {vacancy.contactPerson}
              </Typography>
            )}
            {vacancy.contactEmail && (
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                <Box component="span" sx={{ fontWeight: 600 }}>Email:</Box> {vacancy.contactEmail}
              </Typography>
            )}
            {vacancy.contactPhone && (
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                <Box component="span" sx={{ fontWeight: 600 }}>Телефон:</Box> {vacancy.contactPhone}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              <Box component="span" sx={{ fontWeight: 600 }}>Опубликовано:</Box> {new Date(vacancy.publishedAt).toLocaleDateString('ru-RU')}
            </Typography>
            {vacancy.expiresAt && (
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                }}
              >
                <Box component="span" sx={{ fontWeight: 600 }}>Действует до:</Box> {new Date(vacancy.expiresAt).toLocaleDateString('ru-RU')}
              </Typography>
            )}
          </Box>

          {user && (
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Send />}
                onClick={handleApplyClick}
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 0,
                  letterSpacing: '-0.015em',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Откликнуться на вакансию
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Откликнуться на вакансию
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: 'text.secondary' }}>
            Вакансия: {vacancy?.title}
          </Typography>
          {myProfiles && myProfiles.length > 0 ? (
            <>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel>Выберите анкету</InputLabel>
                <Select
                  value={selectedProfileId || ''}
                  label="Выберите анкету"
                  onChange={(e) => setSelectedProfileId(Number(e.target.value))}
                >
                  {myProfiles.map((profile: any) => (
                    <MenuItem key={profile.id} value={profile.id}>
                      {profile.desiredPosition || `Анкета #${profile.id}`} 
                      ({profile.status})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Сопроводительное письмо (необязательно)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Расскажите, почему вы подходите на эту позицию..."
              />
            </>
          ) : (
            <Alert severity="warning" sx={{ mt: 1 }}>
              У вас нет анкет. Сначала создайте анкету в разделе "Мои анкеты".
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Отмена</Button>
          {myProfiles && myProfiles.length > 0 && (
            <Button 
              variant="contained" 
              onClick={handleApplySubmit}
              disabled={!selectedProfileId}
            >
              Отправить отклик
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'success.main',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VacancyDetailsPage;
