import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VacanciesListPage from "./pages/VacanciesListPage";
import VacancyDetailsPage from "./pages/VacancyDetailsPage";
import MyProfilesPage from "./pages/MyProfilesPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import EditProfilePage from "./pages/EditProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import PersonnelSelectionPage from "./pages/PersonnelSelectionPage";
import ManageVacanciesPage from "./pages/ManageVacanciesPage";
import CreateVacancyPage from "./pages/CreateVacancyPage";
import AccessRightsPage from "./pages/AccessRightsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import ActionLogsPage from "./pages/ActionLogsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
          path="/profiles/new"
          element={
            <ProtectedRoute>
              <CreateProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:id"
          element={
            <ProtectedRoute>
              <ProfileDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:id/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applicants"
          element={
            <ProtectedRoute>
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personnel-selection"
          element={
            <ProtectedRoute requiredRoles={["Manager", "Admin"]}>
              <PersonnelSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/vacancies"
          element={
            <ProtectedRoute requiredRoles={["Manager", "Admin"]}>
              <ManageVacanciesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/vacancies/new"
          element={
            <ProtectedRoute requiredRoles={["Manager", "Admin"]}>
              <CreateVacancyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/access-rights"
          element={
            <ProtectedRoute requiredRoles={["Manager", "Admin"]}>
              <AccessRightsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <ActionLogsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
