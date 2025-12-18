import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';
import { authService } from '../services/authService';
import type { RegisterData } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      navigate('/vacancies');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        className="fade-in"
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '600px',
          p: { xs: 4, md: 5 },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          borderRadius: 0,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'text.primary',
              mb: 1,
            }}
          >
            Регистрация
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 400,
              color: 'text.secondary',
            }}
          >
            Создайте аккаунт для доступа к системе
          </Typography>
        </Box>

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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <TextField
                fullWidth
                label="Имя"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Фамилия"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Box>
            <TextField
              fullWidth
              label="Отчество"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              helperText="Минимум 6 символов"
            />
            <TextField
              fullWidth
              label="Телефон"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            size="large"
            startIcon={loading ? null : <PersonAddOutlined />}
            disabled={loading}
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'white',
              bgcolor: 'text.primary',
              px: 3,
              py: 1.5,
              mt: 3.5,
              mb: 2.5,
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
            {loading ? <CircularProgress size={24} sx={{ color: 'rgba(0, 0, 0, 0.26)' }} /> : 'Зарегистрироваться'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'text.secondary',
              }}
            >
              Уже есть аккаунт?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Войти
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
