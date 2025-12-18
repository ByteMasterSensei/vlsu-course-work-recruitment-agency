import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbLabel = (path: string, index: number, pathnames: string[]): string => {

    const hasProfilesInPath = pathnames.includes('profiles');
    const hasVacanciesInPath = pathnames.includes('vacancies');
    
    if (path === 'new' && hasProfilesInPath) {
      return 'Создать анкету';
    }
    if (path === 'edit' && hasProfilesInPath) {
      return 'Редактировать анкету';
    }
    if (path === 'new' && hasVacanciesInPath) {
      return 'Создать вакансию';
    }
    if (path === 'edit' && hasVacanciesInPath) {
      return 'Редактировать вакансию';
    }
    
    if (/^\d+$/.test(path)) {
      const parent = pathnames[index - 1];
      if (parent === 'profiles') return 'Просмотр анкеты';
      if (parent === 'vacancies') return 'Просмотр вакансии';
      if (parent === 'users') return 'Пользователь';
      return 'Просмотр';
    }
    
    const labels: Record<string, string> = {
      vacancies: 'Вакансии',
      profiles: 'Мои анкеты',
      login: 'Вход',
      register: 'Регистрация',
      favorites: 'Избранное',
      applicants: 'База анкет',
      'personnel-selection': 'Подбор персонала',
      manage: 'Управление',
      'access-rights': 'Доступ к базе',
      admin: 'Администрирование',
      users: 'Пользователи',
      logs: 'Журнал действий',
    };
    return labels[path] || path;
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Главная', path: '/' },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        label: getBreadcrumbLabel(value, index, pathnames),
        path: index === pathnames.length - 1 ? undefined : to,
      };
    }),
  ];

  if (breadcrumbs.length <= 1) return null;

  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      sx={{
        mb: 3,
        '& .MuiBreadcrumbs-ol': {
          flexWrap: 'nowrap',
        },
        '& .MuiBreadcrumbs-separator': {
          color: 'text.disabled',
          mx: 1,
        },
      }}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        return breadcrumb.path ? (
          <Link
            key={breadcrumb.path}
            component={RouterLink}
            to={breadcrumb.path}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'color var(--transition-base)',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {index === 0 && <Home sx={{ fontSize: '1rem' }} />}
            {breadcrumb.label}
          </Link>
        ) : (
          <Typography
            key={breadcrumb.label}
            sx={{
              color: 'text.primary',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {breadcrumb.label}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;

