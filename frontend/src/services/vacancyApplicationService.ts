import api from '../utils/axiosConfig';

export type VacancyApplication = {
  id: number;
  applicantProfileId: number;
  applicantName: string;
  desiredPosition?: string;
  vacancyId: number;
  vacancyTitle: string;
  companyName: string;
  status: number;
  statusName: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt?: string;
};

export type CreateApplicationDto = {
  applicantProfileId: number;
  vacancyId: number;
  coverLetter?: string;
};

export const vacancyApplicationService = {
  // Подать отклик на вакансию
  createApplication: async (dto: CreateApplicationDto): Promise<VacancyApplication> => {
    const response = await api.post('/vacancy-applications', dto);
    return response.data;
  },

  // Получить мои отклики
  getMyApplications: async (): Promise<VacancyApplication[]> => {
    const response = await api.get('/vacancy-applications/my');
    return response.data;
  },

  // Получить отклики на вакансию (для менеджера)
  getApplicationsForVacancy: async (vacancyId: number): Promise<VacancyApplication[]> => {
    const response = await api.get(`/vacancy-applications/vacancy/${vacancyId}`);
    return response.data;
  },

  // Получить отклик по ID
  getApplication: async (id: number): Promise<VacancyApplication> => {
    const response = await api.get(`/vacancy-applications/${id}`);
    return response.data;
  },

  // Обновить статус отклика (для менеджера)
  updateApplicationStatus: async (id: number, status: number): Promise<void> => {
    await api.patch(`/vacancy-applications/${id}/status`, { status });
  },

  // Отозвать отклик
  withdrawApplication: async (id: number): Promise<void> => {
    await api.post(`/vacancy-applications/${id}/withdraw`);
  },
};

export const ApplicationStatus = {
  Pending: 0,
  Reviewed: 1,
  Accepted: 2,
  Rejected: 3,
  Withdrawn: 4,
};

export const ApplicationStatusNames: Record<number, string> = {
  0: 'На рассмотрении',
  1: 'Просмотрено',
  2: 'Принято',
  3: 'Отклонено',
  4: 'Отозвано',
};
