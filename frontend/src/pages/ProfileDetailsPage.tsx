import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowBack, Edit, School, Work, Star } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { applicantProfileService } from '../services/applicantProfileService';

const statusLabels: Record<string, string> = {
  'Активна': 'Активен',
  'Архивная': 'В архиве',
  'Черновик': 'Черновик',
  'Отправлена': 'Отправлена',
};

const ProfileDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => applicantProfileService.getProfileById(Number(id)),
    enabled: !!id,
  });

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

  if (error || !profile) {
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
              mb: 2,
            }}
          >
            Анкета не найдена
          </Typography>
          <Button
            onClick={() => navigate('/profiles')}
            startIcon={<ArrowBack />}
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'text.primary',
              bgcolor: 'transparent',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              px: 2.5,
              py: 1,
              borderRadius: 0,
              letterSpacing: '-0.015em',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                borderColor: 'rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Вернуться к списку
          </Button>
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
          Назад к списку
        </Button>

        <Box
          className="fade-in"
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.06)',
            borderRadius: 0,
            p: { xs: 3, md: 4 },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={3} flexWrap="wrap" gap={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                  mb: 1.5,
                }}
              >
                {profile.desiredPosition || 'Анкета без указания должности'}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={statusLabels[profile.status] || profile.status}
                  sx={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: 'rgba(0, 0, 0, 0.06)',
                    color: 'text.primary',
                    borderRadius: 0,
                  }}
                />
                {profile.readyToRelocate && (
                  <Chip
                    label="Готов к переезду"
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
                {profile.readyForBusinessTrips && (
                  <Chip
                    label="Готов к командировкам"
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
              </Box>
            </Box>
            <Button
              startIcon={<Edit />}
              onClick={() => navigate(`/profiles/${profile.id}/edit`)}
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
                letterSpacing: '-0.015em',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'text.secondary',
                },
              }}
            >
              Редактировать
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {profile.desiredSalary && (
            <Box mb={4}>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: 'text.secondary',
                  mb: 1,
                  textTransform: 'uppercase',
                }}
              >
                Желаемая зарплата
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                }}
              >
                {profile.desiredSalary}
              </Typography>
            </Box>
          )}

          {profile.additionalInfo && (
            <Box mb={4}>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: 'text.secondary',
                  mb: 2,
                  textTransform: 'uppercase',
                }}
              >
                Дополнительная информация
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  color: 'text.primary',
                  lineHeight: 1.7,
                }}
              >
                {profile.additionalInfo}
              </Typography>
            </Box>
          )}

          {profile.educations && profile.educations.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box mb={4}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <School sx={{ color: 'text.secondary' }} />
                  <Typography
                    sx={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                    }}
                  >
                    Образование
                  </Typography>
                </Box>
                {profile.educations.map((edu, index) => (
                  <Box
                    key={edu.id || index}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: index < profile.educations.length - 1 ? '1px solid' : 'none',
                      borderColor: 'rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {edu.institution}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 400,
                        color: 'text.secondary',
                        mb: 0.5,
                      }}
                    >
                      {edu.specialty}
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      {edu.degree && (
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'text.disabled',
                          }}
                        >
                          {edu.degree}
                        </Typography>
                      )}
                      {edu.graduationYear && (
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: 'text.disabled',
                          }}
                        >
                          Год окончания: {edu.graduationYear}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {profile.workExperiences && profile.workExperiences.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box mb={4}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Work sx={{ color: 'text.secondary' }} />
                  <Typography
                    sx={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                    }}
                  >
                    Опыт работы
                  </Typography>
                </Box>
                {profile.workExperiences.map((exp, index) => (
                  <Box
                    key={exp.id || index}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: index < profile.workExperiences.length - 1 ? '1px solid' : 'none',
                      borderColor: 'rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {exp.position}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        mb: 0.5,
                      }}
                    >
                      {exp.companyName}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'text.disabled',
                        mb: 1,
                      }}
                    >
                      {new Date(exp.startDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                      {' — '}
                      {exp.isCurrentJob ? 'по настоящее время' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) : ''}
                    </Typography>
                    {exp.responsibilities && (
                      <Typography
                        sx={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          color: 'text.primary',
                          lineHeight: 1.6,
                        }}
                      >
                        {exp.responsibilities}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box mb={3}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Star sx={{ color: 'text.secondary' }} />
                  <Typography
                    sx={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                    }}
                  >
                    Навыки
                  </Typography>
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {profile.skills.map((skill, index) => (
                    <Chip
                      key={skill.id || index}
                      label={skill.skillLevel ? `${skill.skillName} (${skill.skillLevel})` : skill.skillName}
                      sx={{
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        color: 'text.primary',
                        borderRadius: 0,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              <Box component="span" sx={{ fontWeight: 600 }}>Создано:</Box> {new Date(profile.createdAt).toLocaleDateString('ru-RU')}
            </Typography>
            {profile.updatedAt && (
              <Typography
                sx={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                }}
              >
                <Box component="span" sx={{ fontWeight: 600 }}>Обновлено:</Box> {new Date(profile.updatedAt).toLocaleDateString('ru-RU')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileDetailsPage;

