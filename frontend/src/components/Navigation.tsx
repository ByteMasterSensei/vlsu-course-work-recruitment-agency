import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import {
  PersonOutline,
  WorkOutline,
  LogoutOutlined,
  MenuOutlined,
  KeyboardArrowDownOutlined,
  FavoriteBorder,
  PeopleOutline,
  SearchOutlined,
  SettingsOutlined,
  HistoryOutlined,
  VpnKeyOutlined,
  BusinessOutlined,
} from "@mui/icons-material";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const roleLabels: Record<string, string> = {
  Visitor: "Посетитель",
  Applicant: "Соискатель",
  Manager: "Менеджер",
  Admin: "Администратор",
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const isManager = user?.role === "Manager" || user?.role === "Admin";
  const isAdmin = user?.role === "Admin";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    authService.logout();
    handleMenuClose();
    handleMobileMenuClose();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const NavButton = ({
    to,
    label,
    active,
  }: {
    to: string;
    label: string;
    active: boolean;
  }) => (
    <Button
      component={Link}
      to={to}
      sx={{
        color: active ? "text.primary" : "text.secondary",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: "0.9375rem",
        fontWeight: active ? 600 : 500,
        textTransform: "none",
        px: 2,
        py: 1.25,
        borderRadius: 0,
        minWidth: "auto",
        letterSpacing: "-0.015em",
        transition: "all 0.15s ease",
        "&:hover": {
          color: "text.primary",
          bgcolor: "rgba(0, 0, 0, 0.03)",
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.06)",
        borderRadius: 0,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1400px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {}
        <Typography
          component={Link}
          to={user ? "/vacancies" : "/"}
          sx={{
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: { xs: "1.125rem", sm: "1.3125rem" },
            fontWeight: 700,
            color: "text.primary",
            textDecoration: "none",
            letterSpacing: "-0.03em",
            mr: { xs: 3, md: 4 },
            transition: "opacity 0.2s ease",
            display: "flex",
            alignItems: "center",
            "&:hover": {
              opacity: 0.7,
            },
          }}
        >
          HR Agency
        </Typography>

        {}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 0,
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <NavButton
            to="/vacancies"
            label="Вакансии"
            active={isActive("/vacancies")}
          />

          {user && (
            <>
              <NavButton
                to="/profiles"
                label="Мои анкеты"
                active={isActive("/profiles")}
              />
              <NavButton
                to="/favorites"
                label="Избранное"
                active={isActive("/favorites")}
              />
            </>
          )}

          {isManager && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, my: 1.5 }}
              />
              <NavButton
                to="/applicants"
                label="База анкет"
                active={isActive("/applicants")}
              />
              <NavButton
                to="/personnel-selection"
                label="Подбор"
                active={isActive("/personnel-selection")}
              />
              <NavButton
                to="/manage/vacancies"
                label="Управление"
                active={isActive("/manage/vacancies")}
              />
              <NavButton
                to="/access-rights"
                label="Доступ"
                active={isActive("/access-rights")}
              />
            </>
          )}

          {isAdmin && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, my: 1.5 }}
              />
              <NavButton
                to="/admin/users"
                label="Пользователи"
                active={isActive("/admin/users")}
              />
              <NavButton
                to="/admin/logs"
                label="Журнал"
                active={isActive("/admin/logs")}
              />
            </>
          )}
        </Box>

        {}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1.5,
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <Button
                onClick={handleMenuOpen}
                endIcon={
                  <KeyboardArrowDownOutlined
                    sx={{
                      fontSize: 18,
                      transition: "transform 0.2s ease",
                      transform: Boolean(anchorEl)
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                }
                sx={{
                  color: "text.primary",
                  fontFamily:
                    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 0,
                  minWidth: "auto",
                  letterSpacing: "-0.015em",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    mr: 1,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: "text.primary",
                    color: "background.paper",
                  }}
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </Avatar>
                {user.firstName}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 0.5,
                    minWidth: 220,
                    borderRadius: 0,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    py: 0,
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography
                    sx={{
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "text.primary",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "text.secondary",
                      mt: 0.25,
                    }}
                  >
                    {user.email}
                  </Typography>
                  <Chip
                    label={roleLabels[user.role] || user.role}
                    size="small"
                    sx={{
                      mt: 1,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      height: 20,
                      bgcolor:
                        user.role === "Admin"
                          ? "error.light"
                          : user.role === "Manager"
                          ? "warning.light"
                          : "info.light",
                      color:
                        user.role === "Admin"
                          ? "error.dark"
                          : user.role === "Manager"
                          ? "warning.dark"
                          : "info.dark",
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Divider />
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    py: 1,
                    px: 2,
                    borderRadius: 0,
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <LogoutOutlined
                    sx={{ mr: 1.5, fontSize: 18, opacity: 0.7 }}
                  />
                  Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: "0.9375rem",
                fontWeight: 600,
                textTransform: "none",
                color: "white",
                bgcolor: "text.primary",
                px: 2.5,
                py: 1,
                borderRadius: 0,
                letterSpacing: "-0.015em",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "text.secondary",
                },
              }}
            >
              Войти
            </Button>
          )}
        </Box>

        {}
        <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
          <IconButton
            onClick={handleMobileMenuOpen}
            sx={{
              color: "text.primary",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <MenuOutlined sx={{ fontSize: 24 }} />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            PaperProps={{
              sx: {
                mt: 0.5,
                minWidth: 280,
                maxWidth: "calc(100vw - 32px)",
                borderRadius: 0,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                py: 1,
              },
            }}
          >
            {user && (
              <>
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "text.primary",
                        color: "background.paper",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Chip
                        label={roleLabels[user.role] || user.role}
                        size="small"
                        sx={{
                          mt: 0.5,
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          height: 18,
                          bgcolor:
                            user.role === "Admin"
                              ? "error.light"
                              : user.role === "Manager"
                              ? "warning.light"
                              : "info.light",
                          color:
                            user.role === "Admin"
                              ? "error.dark"
                              : user.role === "Manager"
                              ? "warning.dark"
                              : "info.dark",
                          borderRadius: 0,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
              </>
            )}

            <MenuItem
              component={Link}
              to="/vacancies"
              onClick={handleMobileMenuClose}
            >
              <WorkOutline sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }} />
              Вакансии
            </MenuItem>

            {user && (
              <>
                <MenuItem
                  component={Link}
                  to="/profiles"
                  onClick={handleMobileMenuClose}
                >
                  <PersonOutline sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }} />
                  Мои анкеты
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/favorites"
                  onClick={handleMobileMenuClose}
                >
                  <FavoriteBorder
                    sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }}
                  />
                  Избранное
                </MenuItem>
              </>
            )}

            {isManager && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography
                  sx={{
                    px: 2.5,
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "text.disabled",
                    textTransform: "uppercase",
                  }}
                >
                  Менеджер
                </Typography>
                <MenuItem
                  component={Link}
                  to="/applicants"
                  onClick={handleMobileMenuClose}
                >
                  <PeopleOutline sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }} />
                  База анкет
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/personnel-selection"
                  onClick={handleMobileMenuClose}
                >
                  <SearchOutlined
                    sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }}
                  />
                  Подбор персонала
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/manage/vacancies"
                  onClick={handleMobileMenuClose}
                >
                  <BusinessOutlined
                    sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }}
                  />
                  Управление вакансиями
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/access-rights"
                  onClick={handleMobileMenuClose}
                >
                  <VpnKeyOutlined
                    sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }}
                  />
                  Доступ к базе
                </MenuItem>
              </>
            )}

            {isAdmin && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography
                  sx={{
                    px: 2.5,
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "text.disabled",
                    textTransform: "uppercase",
                  }}
                >
                  Администратор
                </Typography>
                <MenuItem
                  component={Link}
                  to="/admin/users"
                  onClick={handleMobileMenuClose}
                >
                  <SettingsOutlined
                    sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }}
                  />
                  Пользователи
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/admin/logs"
                  onClick={handleMobileMenuClose}
                >
                  <HistoryOutlined
                    sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }}
                  />
                  Журнал действий
                </MenuItem>
              </>
            )}

            {user ? (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout}>
                  <LogoutOutlined
                    sx={{ mr: 1.5, fontSize: 20, opacity: 0.7 }}
                  />
                  Выйти
                </MenuItem>
              </>
            ) : (
              <>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ px: 2, py: 1 }}>
                  <Button
                    component={Link}
                    to="/login"
                    onClick={handleMobileMenuClose}
                    fullWidth
                    sx={{
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      textTransform: "none",
                      color: "white",
                      bgcolor: "text.primary",
                      py: 1,
                      borderRadius: 0,
                      "&:hover": {
                        bgcolor: "text.secondary",
                      },
                    }}
                  >
                    Войти
                  </Button>
                </Box>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
