import { Typography, Box, Button, Container, Card, CardContent } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { WorkOutline, PersonAddOutlined, TrendingUpOutlined, SecurityOutlined } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import { authService } from '../services/authService';

const HomePage = () => {
  const user = authService.getUser();

  if (user) {
    return <Navigate to="/vacancies" replace />;
  }

  const features = [
    {
      icon: <WorkOutline sx={{ fontSize: 40, color: 'text.primary' }} />,
      title: 'Каталог вакансий',
      description: 'Широкий выбор актуальных вакансий от ведущих компаний',
    },
    {
      icon: <PersonAddOutlined sx={{ fontSize: 40, color: 'text.primary' }} />,
      title: 'Простая регистрация',
      description: 'Быстрое создание профиля и управление анкетами',
    },
    {
      icon: <TrendingUpOutlined sx={{ fontSize: 40, color: 'text.primary' }} />,
      title: 'Карьерный рост',
      description: 'Найдите работу мечты и развивайте свою карьеру',
    },
    {
      icon: <SecurityOutlined sx={{ fontSize: 40, color: 'text.primary' }} />,
      title: 'Безопасность',
      description: 'Защита ваших персональных данных на высшем уровне',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />

      {}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          py: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="lg">
          <Box className="fade-in" sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                color: 'text.primary',
                mb: 3,
              }}
            >
              Найдите работу мечты
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                fontWeight: 400,
                color: 'text.secondary',
                mb: 5,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}
            >
              Современная платформа для эффективного подбора персонала и поиска работы
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                size="large"
                component={Link}
                to="/vacancies"
                startIcon={<WorkOutline />}
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
                }}
              >
                Смотреть вакансии
              </Button>
              <Button
                size="large"
                component={Link}
                to="/register"
                startIcon={<PersonAddOutlined />}
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
                    bgcolor: 'action.hover',
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Зарегистрироваться
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Typography
          sx={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontWeight: 700,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            color: 'text.primary',
            mb: 8,
          }}
        >
          Почему выбирают нас
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="fade-in"
              elevation={0}
              sx={{
                height: '100%',
                textAlign: 'center',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.06)',
                borderRadius: 0,
                transition: 'all 0.15s ease',
                animationDelay: `${index * 0.1}s`,
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography
                  sx={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    color: 'text.primary',
                    mb: 1.5,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
