import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import { History, Person } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { adminService, type ActionLogFilter } from '../services/adminService';

const actionTypeLabels: Record<string, string> = {
  'Create': 'Создание',
  'Update': 'Изменение',
  'Delete': 'Удаление',
  'Login': 'Вход',
  'Logout': 'Выход',
  'GrantAccess': 'Выдача доступа',
  'RevokeAccess': 'Отзыв доступа',
};

const actionTypeColors: Record<string, { bg: string; color: string }> = {
  'Create': { bg: 'success.light', color: 'success.dark' },
  'Update': { bg: 'info.light', color: 'info.dark' },
  'Delete': { bg: 'error.light', color: 'error.dark' },
  'Login': { bg: 'warning.light', color: 'warning.dark' },
  'Logout': { bg: 'rgba(0, 0, 0, 0.06)', color: 'text.primary' },
  'GrantAccess': { bg: 'success.light', color: 'success.dark' },
  'RevokeAccess': { bg: 'warning.light', color: 'warning.dark' },
};

const ActionLogsPage = () => {
  const [filter, setFilter] = useState<ActionLogFilter>({
    page: 1,
    pageSize: 20,
  });

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['actionLogs', filter],
    queryFn: () => adminService.getActionLogs(filter),
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

  const logs = logsData?.items || [];

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
          Журнал действий
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Тип действия</InputLabel>
            <Select
              value={filter.actionType || ''}
              label="Тип действия"
              onChange={(e) => setFilter({ ...filter, actionType: e.target.value || undefined, page: 1 })}
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="Create">Создание</MenuItem>
              <MenuItem value="Update">Изменение</MenuItem>
              <MenuItem value="Delete">Удаление</MenuItem>
              <MenuItem value="Login">Вход</MenuItem>
              <MenuItem value="GrantAccess">Выдача доступа</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Тип сущности</InputLabel>
            <Select
              value={filter.entityType || ''}
              label="Тип сущности"
              onChange={(e) => setFilter({ ...filter, entityType: e.target.value || undefined, page: 1 })}
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="User">Пользователь</MenuItem>
              <MenuItem value="Vacancy">Вакансия</MenuItem>
              <MenuItem value="ApplicantProfile">Анкета</MenuItem>
              <MenuItem value="AccessRight">Право доступа</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="С даты"
            InputLabelProps={{ shrink: true }}
            value={filter.startDate || ''}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value || undefined, page: 1 })}
          />
          <TextField
            type="date"
            label="По дату"
            InputLabelProps={{ shrink: true }}
            value={filter.endDate || ''}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value || undefined, page: 1 })}
          />
        </Box>

        <Typography sx={{ mb: 3, color: 'text.secondary' }}>
          Всего записей: {logsData?.totalCount || 0}
        </Typography>

        {logs.length > 0 ? (
          <>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {logs.map((log, index) => (
                <Card
                  key={log.id}
                  className="fade-in"
                  elevation={0}
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.06)',
                    borderRadius: 0,
                    animationDelay: `${index * 0.02}s`,
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" gap={2}>
                      <Box sx={{ flex: 1 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <History sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Chip
                            label={actionTypeLabels[log.actionType] || log.actionType}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: actionTypeColors[log.actionType]?.bg || 'rgba(0, 0, 0, 0.06)',
                              color: actionTypeColors[log.actionType]?.color || 'text.primary',
                              borderRadius: 0,
                            }}
                          />
                          <Chip
                            label={log.entityType}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              bgcolor: 'rgba(0, 0, 0, 0.06)',
                              borderRadius: 0,
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '0.9375rem',
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {log.description}
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Person sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                              {log.userName}{log.userEmail ? ` (${log.userEmail})` : ''}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled' }}>
                            {new Date(log.createdAt).toLocaleString('ru-RU')}
                          </Typography>
                          {log.ipAddress && (
                            <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled' }}>
                              IP: {log.ipAddress}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {logsData && logsData.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={logsData.totalPages}
                  page={filter.page || 1}
                  onChange={(_, page) => setFilter({ ...filter, page })}
                  shape="rounded"
                />
              </Box>
            )}
          </>
        ) : (
          <Box textAlign="center" py={10}>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: 'text.secondary' }}>
              Записи не найдены
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ActionLogsPage;

