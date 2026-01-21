import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Business } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { vacancyService } from '../services/vacancyService';

const statusLabels: Record<string, string> = {
  'Активна': 'Активна',
  'Закрыта': 'Закрыта',
  'На паузе': 'На паузе',
};

const employmentTypeLabels: Record<string, string> = {
  'FullTime': 'Полная занятость',
  'PartTime': 'Частичная занятость',
  'Contract': 'Контракт',
  'Remote': 'Удалённая работа',
  'Internship': 'Стажировка',
};

const ManageVacanciesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState<number | null>(null);

  const { data: vacanciesData, isLoading } = useQuery({
    queryKey: ['manageVacancies'],
    queryFn: () => vacancyService.getVacancies({ pageSize: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => vacancyService.deleteVacancy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageVacancies'] });
      setDeleteDialogOpen(false);
      setVacancyToDelete(null);
    },
  });

  const handleDelete = (id: number) => {
    setVacancyToDelete(id);
    setDeleteDialogOpen(true);
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

  const vacancies = vacanciesData?.items || [];

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
          flexWrap="wrap"
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
            Управление вакансиями
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={() => navigate('/manage/vacancies/new')}
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
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            Добавить вакансию
          </Button>
        </Box>

        {vacancies.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {vacancies.map((vacancy, index) => (
              <Card
                key={vacancy.id}
                className="fade-in"
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.06)',
                  borderRadius: 0,
                  animationDelay: `${index * 0.03}s`,
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
                        }}
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
                        <Chip
                          label={statusLabels[vacancy.status] || vacancy.status}
                          size="small"
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: vacancy.status === 'Активна' ? 'success.light' : 'rgba(0, 0, 0, 0.06)',
                            color: vacancy.status === 'Активна' ? 'success.dark' : 'text.primary',
                            borderRadius: 0,
                          }}
                        />
                        {vacancy.salaryRange && (
                          <Chip
                            label={vacancy.salaryRange}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: 'rgba(0, 0, 0, 0.06)',
                              borderRadius: 0,
                            }}
                          />
                        )}
                        <Chip
                          label={employmentTypeLabels[vacancy.employmentType] || vacancy.employmentType}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: 'rgba(0, 0, 0, 0.06)',
                            borderRadius: 0,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontSize: '0.8125rem',
                          color: 'text.secondary',
                          mt: 1,
                        }}
                      >
                        Опубликовано: {new Date(vacancy.publishedAt).toLocaleDateString('ru-RU')}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton
                        onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => navigate(`/manage/vacancies/${vacancy.id}/edit`)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(vacancy.id)}
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
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Вакансий пока нет
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={() => navigate('/manage/vacancies/new')}
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
                '&:hover': { bgcolor: 'text.secondary' },
              }}
            >
              Добавить первую вакансию
            </Button>
          </Box>
        )}
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту вакансию?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 0 }}>
            Отмена
          </Button>
          <Button
            onClick={() => vacancyToDelete && deleteMutation.mutate(vacancyToDelete)}
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

export default ManageVacanciesPage;

