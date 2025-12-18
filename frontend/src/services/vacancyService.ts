import axiosInstance from '../utils/axiosConfig';

export interface Vacancy {
  id: number;
  title: string;
  companyName: string;
  companyINN?: string;
  description: string;
  requirements?: string;
  workingConditions?: string;
  salaryRange?: string;
  employmentType: string;
  status: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  publishedAt: string;
  expiresAt?: string;
  createdByUserId: number;
}

export interface VacancyFilter {
  search?: string;
  companyName?: string;
  employmentType?: number;
  status?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface VacancyListResponse {
  items: Vacancy[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateVacancyDto {
  title: string;
  companyName: string;
  companyINN?: string;
  description: string;
  requirements?: string;
  workingConditions?: string;
  salaryRange?: string;
  employmentType: number;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  expiresAt?: string;
}

export interface UpdateVacancyDto {
  title?: string;
  companyName?: string;
  companyINN?: string;
  description?: string;
  requirements?: string;
  workingConditions?: string;
  salaryRange?: string;
  employmentType?: number;
  status?: number;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  expiresAt?: string;
}

class VacancyService {
  async getVacancies(filter: VacancyFilter = {}): Promise<VacancyListResponse> {
    const params = new URLSearchParams();
    if (filter.search) params.append('search', filter.search);
    if (filter.companyName) params.append('companyName', filter.companyName);
    if (filter.employmentType !== undefined) params.append('employmentType', filter.employmentType.toString());
    if (filter.status !== undefined) params.append('status', filter.status.toString());
    params.append('page', (filter.page || 1).toString());
    params.append('pageSize', (filter.pageSize || 10).toString());
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortDescending) params.append('sortDescending', 'true');

    const response = await axiosInstance.get<VacancyListResponse>(`/vacancies?${params.toString()}`);
    return response.data;
  }

  async getVacancyById(id: number): Promise<Vacancy> {
    const response = await axiosInstance.get<Vacancy>(`/vacancies/${id}`);
    return response.data;
  }

  async createVacancy(data: CreateVacancyDto): Promise<Vacancy> {
    const response = await axiosInstance.post<Vacancy>('/vacancies', data);
    return response.data;
  }

  async updateVacancy(id: number, data: UpdateVacancyDto): Promise<Vacancy> {
    const response = await axiosInstance.put<Vacancy>(`/vacancies/${id}`, data);
    return response.data;
  }

  async deleteVacancy(id: number): Promise<void> {
    await axiosInstance.delete(`/vacancies/${id}`);
  }
}

export const vacancyService = new VacancyService();

