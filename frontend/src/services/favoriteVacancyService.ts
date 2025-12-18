import axiosInstance from '../utils/axiosConfig';
import type { Vacancy } from './vacancyService';

class FavoriteVacancyService {
  async getFavorites(): Promise<Vacancy[]> {
    const response = await axiosInstance.get<Vacancy[]>('/favorite-vacancies');
    return response.data;
  }

  async addToFavorites(vacancyId: number): Promise<void> {
    await axiosInstance.post(`/favorite-vacancies/${vacancyId}`);
  }

  async removeFromFavorites(vacancyId: number): Promise<void> {
    await axiosInstance.delete(`/favorite-vacancies/${vacancyId}`);
  }
}

export const favoriteVacancyService = new FavoriteVacancyService();

