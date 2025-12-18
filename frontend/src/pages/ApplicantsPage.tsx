import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Visibility, Search, Person, School, Work, Lock } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { managerService } from '../services/managerService';
import { authService } from '../services/authService';

const statusLabels: Record<string, string> = {
  'Active': 'Активен',
  'Archive': 'В архиве',
  'NotLooking': 'Не ищу работу',
};

const ApplicantsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  
  const user = authService.getUser();
  const isManagerOrAdmin = user?.role === 'Manager' || user?.role === 'Admin';

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: () => managerService.getAllApplicantProfiles(),
    retry: false,
    onError: (err: any) => {
      if (err.response?.status === 403) {
        setAccessDenied(true);
      }
    },
  });

  const filteredProfiles = profiles?.filter((profile) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      profile.desiredPosition?.toLowerCase().includes(search) ||
      profile.skills?.some((s) => s.skillName.toLowerCase().includes(search)) ||
      profile.educations?.some((e) => e.specialty?.toLowerCase().includes(search))
    );
  });

  const isAccessDenied = accessDenied || (error && (error as any).response?.status === 403);
  if (isAccessDenied && !isManagerOrAdmin) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Box
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Lock sx={{ fontSize: 64, color: 'text.disabled', mb: 3 }} />
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'text.primary',
              mb: 2,
            }}
          >
            Доступ ограничен
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '1rem',
              color: 'text.secondary',
              mb: 4,
            }}
          >
            У вас нет доступа к базе анкет соискателей. 
            Для получения доступа обратитесь к менеджеру кадрового агентства.
          </Typography>
          <Button
            onClick={() => navigate('/vacancies')}
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'white',
              bgcolor: 'text.primary',
              px: 3,
              py: 1.5,
              borderRadius: 0,
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            Перейти к вакансиям
          </Button>
        </Box>
      </Box>
    );
  }

  if (isLoading && !accessDenied) {
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
          База анкет соискателей
        </Typography>

        <TextField
          fullWidth
          placeholder="Поиск по должности, навыкам, образованию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />

        {filteredProfiles && filteredProfiles.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {filteredProfiles.map((profile, index) => (
              <Card
                key={profile.id}
                className="fade-in"
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.06)',
                  borderRadius: 0,
                  transition: 'all 0.15s ease',
                  animationDelay: `${index * 0.03}s`,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={() => navigate(`/profiles/${profile.id}`)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" gap={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                            color: 'text.primary',
                          }}
                        >
                          {profile.desiredPosition || 'Должность не указана'}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                        <Chip
                          label={statusLabels[profile.status] || profile.status}
                          size="small"
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: profile.status === 'Active' ? 'success.light' : 'rgba(0, 0, 0, 0.06)',
                            color: profile.status === 'Active' ? 'success.dark' : 'text.primary',
                            borderRadius: 0,
                          }}
                        />
                        {profile.desiredSalary && (
                          <Chip
                            label={profile.desiredSalary}
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
                        {profile.readyToRelocate && (
                          <Chip
                            label="Переезд"
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: 'info.light',
                              color: 'info.dark',
                              borderRadius: 0,
                            }}
                          />
                        )}
                      </Box>

                      <Box display="flex" gap={4} flexWrap="wrap">
                        {profile.educations && profile.educations.length > 0 && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <School sx={{ fontSize: 16, color: 'text.disabled' }} />
                            <Typography
                              sx={{
                                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                fontSize: '0.8125rem',
                                color: 'text.secondary',
                              }}
                            >
                              {profile.educations.length} образование
                            </Typography>
                          </Box>
                        )}
                        {profile.workExperiences && profile.workExperiences.length > 0 && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Work sx={{ fontSize: 16, color: 'text.disabled' }} />
                            <Typography
                              sx={{
                                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                fontSize: '0.8125rem',
                                color: 'text.secondary',
                              }}
                            >
                              {profile.workExperiences.length} мест работы
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {profile.skills && profile.skills.length > 0 && (
                        <Box display="flex" gap={0.5} mt={1.5} flexWrap="wrap">
                          {profile.skills.slice(0, 5).map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill.skillName}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: 22,
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                color: 'text.secondary',
                                borderRadius: 0,
                              }}
                            />
                          ))}
                          {profile.skills.length > 5 && (
                            <Chip
                              label={`+${profile.skills.length - 5}`}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: 22,
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                color: 'text.disabled',
                                borderRadius: 0,
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profiles/${profile.id}`);
                      }}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      <Visibility />
                    </IconButton>
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
              }}
            >
              {searchTerm ? 'Анкеты не найдены' : 'База анкет пуста'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ApplicantsPage;

