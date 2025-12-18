import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { applicantProfileService, type CreateApplicantProfile } from '../services/applicantProfileService';

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<CreateApplicantProfile>({
    desiredPosition: '',
    desiredSalary: '',
    additionalInfo: '',
    readyToRelocate: false,
    readyForBusinessTrips: false,
    educations: [],
    workExperiences: [],
    skills: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Подготовка данных: пустые строки в undefined, чтобы соответствовать бэкенду
      const dataToSend: CreateApplicantProfile = {
        desiredPosition: formData.desiredPosition?.trim() || undefined,
        desiredSalary: formData.desiredSalary?.trim() || undefined,
        additionalInfo: formData.additionalInfo?.trim() || undefined,
        readyToRelocate: formData.readyToRelocate,
        readyForBusinessTrips: formData.readyForBusinessTrips,
        educations: formData.educations || [],
        workExperiences: formData.workExperiences || [],
        skills: formData.skills || [],
      };

      console.log('Отправка данных:', dataToSend);
      await applicantProfileService.createProfile(dataToSend);
      navigate('/profiles');
    } catch (err: any) {
      console.error('Ошибка при создании анкеты:', err);
      console.error('Детали ошибки:', err.response?.data);
      
      let errorMessage = 'Ошибка при создании анкеты';
      
      if (err.response?.data) {
        
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.title) {
          errorMessage = err.response.data.title;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.errors) {
          
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage = errors.join(', ');
        }
      } else if (err.message) {
        errorMessage = err.message;
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
          onClick={() => navigate('/profiles')}
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
          Назад к анкетам
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
          Создать анкету
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
            <Alert
              severity="error"
              sx={{
                mb: 3,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.875rem',
                borderRadius: 0,
                border: '1px solid',
                borderColor: 'error.main',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Желаемая должность"
                value={formData.desiredPosition}
                onChange={(e) => setFormData({ ...formData, desiredPosition: e.target.value })}
                placeholder="Например: Frontend разработчик"
              />

              <TextField
                fullWidth
                label="Желаемая зарплата"
                value={formData.desiredSalary}
                onChange={(e) => setFormData({ ...formData, desiredSalary: e.target.value })}
                placeholder="Например: 100 000 - 150 000 руб."
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Дополнительная информация"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                placeholder="Расскажите о себе, своих достижениях и опыте..."
              />

              <Divider />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.readyToRelocate}
                      onChange={(e) => setFormData({ ...formData, readyToRelocate: e.target.checked })}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      Готов к переезду
                    </Typography>
                  }
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.readyForBusinessTrips}
                      onChange={(e) => setFormData({ ...formData, readyForBusinessTrips: e.target.checked })}
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 20,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      Готов к командировкам
                    </Typography>
                  }
                />
              </Box>
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
                  letterSpacing: '-0.015em',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: 'text.secondary',
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'rgba(0, 0, 0, 0.26)' }} /> : 'Создать анкету'}
              </Button>
              <Button
                onClick={() => navigate('/profiles')}
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: 'text.primary',
                  bgcolor: 'transparent',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  px: 3,
                  py: 1.25,
                  borderRadius: 0,
                  letterSpacing: '-0.015em',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                  },
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

export default CreateProfilePage;

