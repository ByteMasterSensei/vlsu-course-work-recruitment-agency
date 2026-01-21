import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  vacancyApplicationService,
  ApplicationStatus,
} from '../services/vacancyApplicationService';
import type { VacancyApplication } from '../services/vacancyApplicationService';
import Navigation from '../components/Navigation';

const getStatusColor = (status: number) => {
  switch (status) {
    case ApplicationStatus.Pending:
      return 'warning';
    case ApplicationStatus.Reviewed:
      return 'info';
    case ApplicationStatus.Accepted:
      return 'success';
    case ApplicationStatus.Rejected:
      return 'error';
    case ApplicationStatus.Withdrawn:
      return 'default';
    default:
      return 'default';
  }
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<VacancyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawDialog, setWithdrawDialog] = useState<number | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await vacancyApplicationService.getMyApplications();
      setApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки откликов');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id: number) => {
    try {
      await vacancyApplicationService.withdrawApplication(id);
      setWithdrawDialog(null);
      loadApplications();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при отзыве отклика');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Мои отклики
        </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {applications.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            У вас пока нет откликов на вакансии
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/vacancies')}
          >
            Перейти к вакансиям
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Вакансия</TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Профиль</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата отклика</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => navigate(`/vacancies/${app.vacancyId}`)}
                    >
                      {app.vacancyTitle}
                    </Button>
                  </TableCell>
                  <TableCell>{app.companyName}</TableCell>
                  <TableCell>{app.desiredPosition || 'Не указана'}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.statusName}
                      color={getStatusColor(app.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    {app.status === ApplicationStatus.Pending && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setWithdrawDialog(app.id)}
                      >
                        Отозвать
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

        <Dialog open={withdrawDialog !== null} onClose={() => setWithdrawDialog(null)}>
          <DialogTitle>Отозвать отклик?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите отозвать отклик на эту вакансию?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWithdrawDialog(null)}>Отмена</Button>
            <Button
              color="error"
              onClick={() => withdrawDialog && handleWithdraw(withdrawDialog)}
            >
              Отозвать
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
