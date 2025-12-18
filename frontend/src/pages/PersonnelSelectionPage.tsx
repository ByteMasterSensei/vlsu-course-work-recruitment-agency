import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Search, Person, Visibility } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { managerService, type PersonnelSearchDto, type PersonnelSearchResult } from '../services/managerService';

const PersonnelSelectionPage = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState<PersonnelSearchDto>({
    desiredPosition: '',
    education: '',
    experience: '',
    skills: [],
    readyToRelocate: undefined,
    readyForBusinessTrips: undefined,
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [results, setResults] = useState<PersonnelSearchResult[]>([]);

  const searchMutation = useMutation({
    mutationFn: (criteria: PersonnelSearchDto) => managerService.searchPersonnel(criteria),
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const handleSearch = () => {
    const criteria: PersonnelSearchDto = {
      ...searchCriteria,
      skills: skillsInput ? skillsInput.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
    };
    searchMutation.mutate(criteria);
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
          Подбор персонала
        </Typography>

        <Card
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.06)',
            borderRadius: 0,
            p: 3,
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'text.primary',
              mb: 3,
            }}
          >
            Критерии поиска
          </Typography>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <TextField
              fullWidth
              label="Желаемая должность"
              value={searchCriteria.desiredPosition}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, desiredPosition: e.target.value })}
              placeholder="Например: Frontend разработчик"
            />
            <TextField
              fullWidth
              label="Образование"
              value={searchCriteria.education}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, education: e.target.value })}
              placeholder="Например: Высшее техническое"
            />
            <TextField
              fullWidth
              label="Опыт работы"
              value={searchCriteria.experience}
              onChange={(e) => setSearchCriteria({ ...searchCriteria, experience: e.target.value })}
              placeholder="Например: от 3 лет"
            />
            <TextField
              fullWidth
              label="Навыки (через запятую)"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchCriteria.readyToRelocate === true}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      readyToRelocate: e.target.checked ? true : undefined,
                    })
                  }
                />
              }
              label="Готов к переезду"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchCriteria.readyForBusinessTrips === true}
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      readyForBusinessTrips: e.target.checked ? true : undefined,
                    })
                  }
                />
              }
              label="Готов к командировкам"
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              onClick={handleSearch}
              disabled={searchMutation.isPending}
              startIcon={searchMutation.isPending ? <CircularProgress size={20} /> : <Search />}
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
              Найти кандидатов
            </Button>
          </Box>
        </Card>

        {searchMutation.isError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
            Ошибка при поиске кандидатов
          </Alert>
        )}

        {results.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
              }}
            >
              Найдено кандидатов: {results.length}
            </Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {results.map((result, index) => (
                <Card
                  key={result.profileId}
                  className="fade-in"
                  elevation={0}
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: 0,
                    animationDelay: `${index * 0.03}s`,
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    },
                  }}
                  onClick={() => navigate(`/profiles/${result.profileId}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" gap={2}>
                      <Box sx={{ flex: 1 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography
                            sx={{
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                              fontSize: '1.125rem',
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {result.desiredPosition || 'Должность не указана'}
                          </Typography>
                          {result.matchScore > 0 && (
                            <Chip
                              label={`Совпадение: ${result.matchScore}%`}
                              size="small"
                              sx={{
                                ml: 1,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                bgcolor: 'success.light',
                                color: 'success.dark',
                                borderRadius: 0,
                              }}
                            />
                          )}
                        </Box>

                        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                          <Chip
                            label={result.userName}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: 'info.light',
                              color: 'info.dark',
                              borderRadius: 0,
                            }}
                          />
                          {result.desiredSalary && (
                            <Chip
                              label={result.desiredSalary}
                              size="small"
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                bgcolor: 'rgba(0, 0, 0, 0.06)',
                                borderRadius: 0,
                              }}
                            />
                          )}
                        </Box>

                        {result.skills && result.skills.length > 0 && (
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {result.skills.slice(0, 6).map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
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
                          </Box>
                        )}
                      </Box>
                      <Button
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profiles/${result.profileId}`);
                        }}
                        sx={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          color: 'text.primary',
                          border: '1px solid',
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                          borderRadius: 0,
                          '&:hover': { borderColor: 'rgba(0, 0, 0, 0.2)' },
                        }}
                      >
                        Просмотр
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}

        {searchMutation.isSuccess && results.length === 0 && (
          <Box textAlign="center" py={10}>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              Кандидаты не найдены
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '1rem',
                color: 'text.secondary',
                mt: 1,
              }}
            >
              Попробуйте изменить критерии поиска
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PersonnelSelectionPage;

