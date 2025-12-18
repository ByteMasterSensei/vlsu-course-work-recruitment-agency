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
  AppBar,
  Toolbar,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { vacancyService } from '../services/vacancyService';
import type { VacancyFilter } from '../services/vacancyService';

const VacanciesListPage = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
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

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0D0D0D', p: 4 }}>
        <Typography color="error">Ошибка при загрузке вакансий</Typography>
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

      {/* Main content с сеткой как в cursor.com */}
      <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 3, md: 6 }, py: 6 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            mb: 4, 
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '2.5rem' },
            letterSpacing: '-0.02em'
          }}
        >
          Каталог вакансий
        </Typography>

        {/* Search and Filters - сетка как в cursor.com */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, 
            gap: 2,
            mb: 3
          }}>
            <TextField
              fullWidth
              placeholder="Поиск по названию, компании, описанию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      onClick={handleSearch} 
                      startIcon={<Search />}
                      sx={{ textTransform: 'none' }}
                    >
                      Найти
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Тип занятости</InputLabel>
              <Select
                value={filter.employmentType ?? ''}
                onChange={(e) => handleEmploymentTypeFilter(e.target.value ? Number(e.target.value) : undefined)}
                label="Тип занятости"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value={0}>Полная занятость</MenuItem>
                <MenuItem value={1}>Частичная занятость</MenuItem>
                <MenuItem value={2}>Контракт</MenuItem>
                <MenuItem value={3}>Стажировка</MenuItem>
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
        </Box>

        {/* Vacancies List - сетка как в cursor.com */}
        {data && data.items.length > 0 ? (
          <>
            <Stack spacing={2}>
              {data.items.map((vacancy) => (
                <Card
                  key={vacancy.id}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      borderColor: 'rgba(99, 102, 241, 0.4)'
                    }
                  }}
                  onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h5" 
                          component="h2" 
                          gutterBottom
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {vacancy.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#8B8B8B', mb: 1 }}>
                          {vacancy.companyName}
                        </Typography>
                      </Box>
                      <Chip 
                        label={vacancy.employmentType} 
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#8B8B8B',
                        mb: 2,
                        lineHeight: 1.6
                      }}
                    >
                      {vacancy.description.length > 200
                        ? `${vacancy.description.substring(0, 200)}...`
                        : vacancy.description}
                    </Typography>
                    <Box display="flex" gap={3} flexWrap="wrap">
                      {vacancy.salaryRange && (
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {vacancy.salaryRange}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: '#8B8B8B' }}>
                        Опубликовано: {new Date(vacancy.publishedAt).toLocaleDateString('ru-RU')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={data.totalPages}
                  page={filter.page || 1}
                  onChange={handlePageChange}
                />
              </Box>
            )}
          </>
        ) : (
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#8B8B8B', 
              textAlign: 'center', 
              mt: 8 
            }}
          >
            Вакансии не найдены
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default VacanciesListPage;
