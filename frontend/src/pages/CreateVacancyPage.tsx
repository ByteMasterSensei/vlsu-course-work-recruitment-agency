import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { vacancyService, type CreateVacancyDto } from '../services/vacancyService';

const employmentTypes = [
  { value: 0, label: 'Полная занятость' },
  { value: 1, label: 'Частичная занятость' },
  { value: 2, label: 'Удалённая работа' },
  { value: 3, label: 'Стажировка' },
  { value: 4, label: 'Проектная работа' },
];

const CreateVacancyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<CreateVacancyDto>({
    title: '',
    companyName: '',
    companyINN: '',
    description: '',
    requirements: '',
    workingConditions: '',
    salaryRange: '',
    employmentType: 0,
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.companyName.trim() || !formData.description.trim()) {
        setError('Заполните обязательные поля: название, компания, описание');
        setLoading(false);
        return;
      }

      await vacancyService.createVacancy(formData);
      navigate('/manage/vacancies');
    } catch (err: any) {
      let errorMessage = 'Ошибка при создании вакансии';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.title) {
        errorMessage = err.response.data.title;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => navigate('/manage/vacancies')}
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
            '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
          }}
        >
          Назад к вакансиям
        </Button>

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
          Создать вакансию
        </Typography>

        <Paper
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.06)',
            borderRadius: 0,
            p: { xs: 3, md: 4 },
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <TextField
                fullWidth
                required
                label="Название должности"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                fullWidth
                required
                label="Компания"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
              <TextField
                fullWidth
                label="ИНН компании"
                value={formData.companyINN}
                onChange={(e) => setFormData({ ...formData, companyINN: e.target.value })}
              />
              <TextField
                fullWidth
                label="Зарплата"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                placeholder="от 100 000 до 150 000 руб."
              />
              <FormControl fullWidth>
                <InputLabel>Тип занятости</InputLabel>
                <Select
                  value={formData.employmentType}
                  label="Тип занятости"
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as number })}
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Описание вакансии"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Требования"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Условия работы"
                value={formData.workingConditions}
                onChange={(e) => setFormData({ ...formData, workingConditions: e.target.value })}
              />
            </Box>

            <Typography sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Контактная информация
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
              <TextField
                fullWidth
                label="Контактное лицо"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
              <TextField
                fullWidth
                label="Телефон"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                type="submit"
                startIcon={loading ? null : <Save />}
                disabled={loading}
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
                  '&:disabled': { bgcolor: 'rgba(0, 0, 0, 0.12)', color: 'rgba(0, 0, 0, 0.26)' },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Создать вакансию'}
              </Button>
              <Button
                onClick={() => navigate('/manage/vacancies')}
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: 'text.primary',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  px: 3,
                  py: 1.25,
                  borderRadius: 0,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateVacancyPage;







