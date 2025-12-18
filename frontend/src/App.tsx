import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VacanciesListPage from './pages/VacanciesListPage';
import VacancyDetailsPage from './pages/VacancyDetailsPage';
import MyProfilesPage from './pages/MyProfilesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0D0D0D' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vacancies" element={<VacanciesListPage />} />
        <Route path="/vacancies/:id" element={<VacancyDetailsPage />} />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <MyProfilesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
