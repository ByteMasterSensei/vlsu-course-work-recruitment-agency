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
import { LoginOutlined } from '@mui/icons-material';
import { authService } from '../services/authService';
import type { LoginData } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData);
      navigate('/vacancies');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при входе в систему');
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
          maxWidth: '440px',
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
            Вход в систему
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 400,
              color: 'text.secondary',
            }}
          >
            Войдите, чтобы продолжить работу
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
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoComplete="email"
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
            sx={{ mb: 3.5 }}
          />

          <Button
            type="submit"
            fullWidth
            size="large"
            startIcon={loading ? null : <LoginOutlined />}
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
            {loading ? <CircularProgress size={24} sx={{ color: 'rgba(0, 0, 0, 0.26)' }} /> : 'Войти'}
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
              Нет аккаунта?{' '}
              <MuiLink
                component={Link}
                to="/register"
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
                Зарегистрироваться
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
