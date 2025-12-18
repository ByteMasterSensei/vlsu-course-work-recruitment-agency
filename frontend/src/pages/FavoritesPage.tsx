import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Delete, Visibility, Business, Work } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { favoriteVacancyService } from '../services/favoriteVacancyService';

const employmentTypeLabels: Record<string, string> = {
  'FullTime': 'Полная занятость',
  'PartTime': 'Частичная занятость',
  'Contract': 'Контракт',
  'Remote': 'Удалённая работа',
  'Internship': 'Стажировка',
};

const FavoritesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favoriteVacancies'],
    queryFn: () => favoriteVacancyService.getFavorites(),
  });

  const removeMutation = useMutation({
    mutationFn: (vacancyId: number) => favoriteVacancyService.removeFromFavorites(vacancyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteVacancies'] });
    },
  });

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
          Избранные вакансии
        </Typography>

        {favorites && favorites.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {favorites.map((vacancy, index) => (
              <Card
                key={vacancy.id}
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
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                      >
                        {vacancy.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                        <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            color: 'text.secondary',
                          }}
                        >
                          {vacancy.companyName}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {vacancy.salaryRange && (
                          <Chip
                            label={vacancy.salaryRange}
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
                        <Chip
                          icon={<Work sx={{ fontSize: 14 }} />}
                          label={employmentTypeLabels[vacancy.employmentType] || vacancy.employmentType}
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
                      </Box>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'text.primary' },
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => removeMutation.mutate(vacancy.id)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main' },
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
              У вас пока нет избранных вакансий
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1rem',
                fontWeight: 400,
                color: 'text.secondary',
              }}
            >
              Добавляйте интересные вакансии в избранное, чтобы вернуться к ним позже
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FavoritesPage;

