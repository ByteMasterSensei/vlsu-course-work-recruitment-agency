import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';
import { ArrowBack, Favorite, FavoriteBorder } from '@mui/icons-material';
import { authService } from '../services/authService';
import { vacancyService } from '../services/vacancyService';
import { favoriteVacancyService } from '../services/favoriteVacancyService';

const VacancyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = authService.getUser();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  if (error || !vacancy) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0D0D0D', p: 4 }}>
        <Typography sx={{ color: '#FCA5A5', mb: 2 }}>Вакансия не найдена</Typography>
        <Button 
          onClick={() => navigate('/vacancies')} 
          startIcon={<ArrowBack />}
          sx={{ textTransform: 'none' }}
        >
          Вернуться к списку
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0D0D0D' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ maxWidth: '1440px', width: '100%', mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Typography variant="h6" component={Link} to="/vacancies" sx={{ flexGrow: 1, fontWeight: 600, textDecoration: 'none', color: 'inherit' }}>
            Кадровое агентство
          </Typography>
          {user && (
            <Button 
              color="inherit" 
              component={Link} 
              to="/profiles" 
              sx={{ mr: 2, textTransform: 'none', fontWeight: 500 }}
            >
              Мои анкеты
            </Button>
          )}
          {user ? (
            <Button 
              color="inherit" 
              onClick={() => { authService.logout(); navigate('/login'); }}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Выйти
            </Button>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Войти
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 3, md: 6 }, py: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/vacancies')}
          sx={{ mb: 4, textTransform: 'none' }}
        >
          Назад к списку
        </Button>

        <Box
          sx={{
            backgroundColor: '#161616',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 8,
            p: 4
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                {vacancy.title}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#8B8B8B',
                  mb: 2
                }}
              >
                {vacancy.companyName}
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center" sx={{ ml: 2 }}>
              {user && (
                <IconButton 
                  onClick={handleFavoriteToggle}
                  sx={{ 
                    color: isFavorite ? '#6366f1' : '#8B8B8B',
                    '&:hover': { color: '#6366f1' }
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              )}
              <Chip label={vacancy.employmentType} />
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

          {vacancy.salaryRange && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Зарплата
              </Typography>
              <Typography variant="body1">{vacancy.salaryRange}</Typography>
            </Box>
          )}

          <Box mb={3}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Описание
            </Typography>
            <Typography variant="body1" sx={{ color: '#8B8B8B', lineHeight: 1.6 }}>
              {vacancy.description}
            </Typography>
          </Box>

          {vacancy.requirements && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Требования
              </Typography>
              <Typography variant="body1" sx={{ color: '#8B8B8B', lineHeight: 1.6 }}>
                {vacancy.requirements}
              </Typography>
            </Box>
          )}

          {vacancy.workingConditions && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Условия работы
              </Typography>
              <Typography variant="body1" sx={{ color: '#8B8B8B', lineHeight: 1.6 }}>
                {vacancy.workingConditions}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Контактная информация
            </Typography>
            {vacancy.contactPerson && (
              <Typography variant="body2" sx={{ color: '#8B8B8B', mb: 0.5 }}>
                Контактное лицо: {vacancy.contactPerson}
              </Typography>
            )}
            {vacancy.contactEmail && (
              <Typography variant="body2" sx={{ color: '#8B8B8B', mb: 0.5 }}>
                Email: {vacancy.contactEmail}
              </Typography>
            )}
            {vacancy.contactPhone && (
              <Typography variant="body2" sx={{ color: '#8B8B8B', mb: 0.5 }}>
                Телефон: {vacancy.contactPhone}
              </Typography>
            )}
          </Box>

          <Box mt={3} pt={3} sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Typography variant="body2" sx={{ color: '#8B8B8B' }}>
              Опубликовано: {new Date(vacancy.publishedAt).toLocaleDateString('ru-RU')}
            </Typography>
            {vacancy.expiresAt && (
              <Typography variant="body2" sx={{ color: '#8B8B8B', mt: 0.5 }}>
                Действует до: {new Date(vacancy.expiresAt).toLocaleDateString('ru-RU')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6EE7B7'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VacancyDetailsPage;
