import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Search, WorkOutline, CalendarToday, AttachMoney } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { vacancyService } from '../services/vacancyService';
import type { VacancyFilter } from '../services/vacancyService';

const employmentTypeLabels: Record<string, string> = {
  'FullTime': 'Полная занятость',
  'PartTime': 'Частичная занятость',
  'Contract': 'Контракт',
  'Remote': 'Удалённая работа',
  'Internship': 'Стажировка',
};

const VacanciesListPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<VacancyFilter>({
    page: 1,
    pageSize: 10,
    sortBy: 'date',
    sortDescending: true,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['vacancies', filter],
    queryFn: () => vacancyService.getVacancies(filter),
  });

  const handleSearch = () => {
    setFilter({ ...filter, search: searchTerm, page: 1 });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilter({ ...filter, page });
  };

  const handleSortChange = (sortBy: string) => {
    setFilter({ ...filter, sortBy, page: 1 });
  };

  const handleEmploymentTypeFilter = (type: number | undefined) => {
    setFilter({ ...filter, employmentType: type, page: 1 });
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

  if (error) {
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
            }}
          >
            Ошибка при загрузке вакансий
          </Typography>
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
          className="fade-in"
          sx={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'text.primary',
            mb: { xs: 4, md: 6 },
          }}
        >
          Каталог вакансий
        </Typography>

        {}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Поиск по названию, компании, описанию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Тип занятости</InputLabel>
              <Select
                value={filter.employmentType !== undefined ? String(filter.employmentType) : ''}
                onChange={(e) => handleEmploymentTypeFilter(e.target.value ? Number(e.target.value) : undefined)}
                label="Тип занятости"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="0">Полная занятость</MenuItem>
                <MenuItem value="1">Частичная занятость</MenuItem>
                <MenuItem value="2">Контракт</MenuItem>
                <MenuItem value="3">Стажировка</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Сортировка</InputLabel>
              <Select
                value={filter.sortBy ?? 'date'}
                onChange={(e) => handleSortChange(e.target.value)}
                label="Сортировка"
              >
                <MenuItem value="date">По дате</MenuItem>
                <MenuItem value="salary">По зарплате</MenuItem>
                <MenuItem value="company">По компании</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            onClick={handleSearch}
            startIcon={<Search />}
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'white',
              bgcolor: 'text.primary',
              px: 3,
              py: 1,
              mt: 2,
              borderRadius: 0,
              letterSpacing: '-0.015em',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'text.secondary',
              },
            }}
          >
            Найти вакансии
          </Button>
        </Box>

        {}
        {data && data.items.length > 0 ? (
          <>
            <Stack spacing={2}>
              {data.items.map((vacancy, index) => (
                <Card
                  key={vacancy.id}
                  className="fade-in"
                  elevation={0}
                  sx={{
                    cursor: 'pointer',
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
                  onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                      mb={2}
                      gap={2}
                    >
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkOutline sx={{ fontSize: '1rem', color: 'text.secondary', opacity: 0.7 }} />
                          <Typography
                            sx={{
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: 'text.secondary',
                            }}
                          >
                            {vacancy.companyName}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
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
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        mb: 2.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {vacancy.description.length > 200
                        ? `${vacancy.description.substring(0, 200)}...`
                        : vacancy.description}
                    </Typography>
                    <Box
                      display="flex"
                      gap={3}
                      flexWrap="wrap"
                      sx={{
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      {vacancy.salaryRange && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AttachMoney sx={{ fontSize: '1.125rem', color: 'text.primary', opacity: 0.7 }} />
                          <Typography
                            sx={{
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {vacancy.salaryRange}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'text.disabled',
                          }}
                        >
                          {new Date(vacancy.publishedAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {}
            {data.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={5}>
                <Pagination
                  count={data.totalPages}
                  page={filter.page || 1}
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      borderRadius: 0,
                      color: 'text.primary',
                      '&.Mui-selected': {
                        bgcolor: 'text.primary',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'text.secondary',
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 8, md: 12 },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.secondary',
                mb: 1,
              }}
            >
              Вакансии не найдены
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1rem',
                fontWeight: 400,
                color: 'text.secondary',
              }}
            >
              Попробуйте изменить параметры поиска
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VacanciesListPage;
