import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Add, Delete, Person, AccessTime } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import Breadcrumbs from '../components/Breadcrumbs';
import { managerService, type CreateAccessRightDto } from '../services/managerService';

const accessTypeLabels: Record<string, string> = {
  'OneTime': 'Разовый',
  'Temporary': 'Временный',
};

const AccessRightsPage = () => {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [accessType, setAccessType] = useState<number>(0);
  const [daysValid, setDaysValid] = useState<number>(7);
  const [error, setError] = useState<string>('');

  const { data: accessRights, isLoading } = useQuery({
    queryKey: ['accessRights'],
    queryFn: () => managerService.getAllAccessRights(),
  });

  const { data: applicants } = useQuery({
    queryKey: ['applicantsForAccess'],
    queryFn: () => managerService.getApplicantsForAccess(),
  });

  const grantMutation = useMutation({
    mutationFn: (data: CreateAccessRightDto) => managerService.grantAccess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessRights'] });
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Ошибка при выдаче доступа');
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => managerService.revokeAccess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessRights'] });
    },
  });

  const resetForm = () => {
    setSelectedUserId('');
    setAccessType(0);
    setDaysValid(7);
    setError('');
  };

  const handleGrant = () => {
    if (!selectedUserId) {
      setError('Выберите пользователя');
      return;
    }
    grantMutation.mutate({
      userId: selectedUserId as number,
      accessType,
      daysValid: accessType === 1 ? daysValid : undefined,
    });
  };

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
          <Typography
            sx={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'text.primary',
            }}
          >
            Управление доступом к базе анкет
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
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
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            Выдать доступ
          </Button>
        </Box>

        {accessRights && accessRights.length > 0 ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            {accessRights.map((right, index) => (
              <Card
                key={right.id}
                className="fade-in"
                elevation={0}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.06)',
                  borderRadius: 0,
                  animationDelay: `${index * 0.03}s`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {right.userName} ({right.userEmail})
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                        <Chip
                          label={accessTypeLabels[right.accessType] || right.accessType}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: right.accessType === 'OneTime' ? 'info.light' : 'warning.light',
                            color: right.accessType === 'OneTime' ? 'info.dark' : 'warning.dark',
                            borderRadius: 0,
                          }}
                        />
                        {right.isUsed && (
                          <Chip
                            label="Использован"
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              bgcolor: 'rgba(0, 0, 0, 0.06)',
                              borderRadius: 0,
                            }}
                          />
                        )}
                        {right.expiresAt && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTime sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                              до {new Date(right.expiresAt).toLocaleDateString('ru-RU')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled', mt: 1 }}>
                        Выдал: {right.grantedByUserName} • {new Date(right.createdAt).toLocaleDateString('ru-RU')}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => revokeMutation.mutate(right.id)}
                      sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    >
                      <Delete />
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
              Права доступа не выданы
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Выдать доступ к базе анкет</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Пользователь</InputLabel>
              <Select
                value={selectedUserId}
                label="Пользователь"
                onChange={(e) => setSelectedUserId(e.target.value as number)}
              >
                {applicants?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.lastName} {user.firstName}{user.middleName ? ` ${user.middleName}` : ''} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Тип доступа</InputLabel>
              <Select
                value={accessType}
                label="Тип доступа"
                onChange={(e) => setAccessType(e.target.value as number)}
              >
                <MenuItem value={0}>Разовый (один просмотр)</MenuItem>
                <MenuItem value={1}>Временный (на N дней)</MenuItem>
              </Select>
            </FormControl>
            {accessType === 1 && (
              <TextField
                fullWidth
                type="number"
                label="Количество дней"
                value={daysValid}
                onChange={(e) => setDaysValid(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1, max: 365 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setCreateDialogOpen(false);
              resetForm();
            }}
            sx={{ borderRadius: 0 }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleGrant}
            disabled={grantMutation.isPending}
            sx={{
              bgcolor: 'text.primary',
              color: 'white',
              borderRadius: 0,
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            {grantMutation.isPending ? <CircularProgress size={20} /> : 'Выдать доступ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccessRightsPage;

