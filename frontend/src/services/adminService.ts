import axiosInstance from '../utils/axiosConfig';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  role?: number;
  isActive?: boolean;
}

export interface ActionLog {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  actionType: string;
  entityType: string;
  entityId?: number;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

export interface ActionLogListResponse {
  items: ActionLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ActionLogFilter {
  page?: number;
  pageSize?: number;
  userId?: number;
  actionType?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

class AdminService {
  
  async getAllUsers(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  }

  async getActionLogs(filter: ActionLogFilter = {}): Promise<ActionLogListResponse> {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
    if (filter.userId) params.append('userId', filter.userId.toString());
    if (filter.actionType) params.append('actionType', filter.actionType);
    if (filter.entityType) params.append('entityType', filter.entityType);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);

    const response = await axiosInstance.get<ActionLogListResponse>(`/actionlogs?${params.toString()}`);
    return response.data;
  }

  async getUserActionLogs(userId: number): Promise<ActionLog[]> {
    const response = await axiosInstance.get<ActionLog[]>(`/actionlogs/user/${userId}`);
    return response.data;
  }
}

export const adminService = new AdminService();

