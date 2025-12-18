import { Typography, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0D0D0D' }}>
      {/* Header как в cursor.com */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ maxWidth: '1440px', width: '100%', mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Кадровое агентство
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/vacancies" 
            sx={{ mr: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Вакансии
          </Button>
          {user && (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/profiles" 
                sx={{ mr: 2, textTransform: 'none', fontWeight: 500 }}
              >
                Мои анкеты
              </Button>
              <Typography variant="body2" sx={{ mr: 2, color: '#8B8B8B' }}>
                {user.firstName} {user.lastName}
              </Typography>
            </>
          )}
          {user ? (
            <Button 
              color="inherit" 
              onClick={handleLogout}
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
      <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 3, md: 6 }, py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 2, 
              fontWeight: 600, 
              fontSize: { xs: '2rem', md: '3rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Добро пожаловать
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#8B8B8B', 
              fontSize: '1.125rem',
              maxWidth: '600px'
            }}
          >
            Система управления кадровым агентством для эффективного подбора персонала
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/vacancies"
            sx={{ 
              py: 2, 
              px: 4,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            Перейти к каталогу вакансий
          </Button>
          {!user && (
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/register"
              sx={{ 
                py: 2, 
                px: 4,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              Зарегистрироваться
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
