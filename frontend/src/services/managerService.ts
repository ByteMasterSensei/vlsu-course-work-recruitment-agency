import axiosInstance from '../utils/axiosConfig';
import type { ApplicantProfile } from './applicantProfileService';

export interface PersonnelSearchDto {
  education?: string;
  experience?: string;
  skills?: string[];
  desiredPosition?: string;
  minSalary?: number;
  maxSalary?: number;
  readyToRelocate?: boolean;
  readyForBusinessTrips?: boolean;
}

export interface PersonnelSearchResult {
  profileId: number;
  userName: string;
  desiredPosition?: string;
  desiredSalary?: string;
  educations: string[];
  workExperiences: { companyName: string; position: string; startDate: string; endDate?: string; yearsOfExperience?: number }[];
  skills: string[];
  matchScore: number;
}

export interface AccessRight {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  grantedByUserId: number;
  grantedByUserName: string;
  accessType: string;
  expiresAt?: string;
  isUsed: boolean;
  usedAt?: string;
  createdAt: string;
}

export interface CreateAccessRightDto {
  userId: number;
  accessType: number; 
  daysValid?: number;
}

export interface ApplicantForAccess {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

class ManagerService {
  
  async searchPersonnel(criteria: PersonnelSearchDto): Promise<PersonnelSearchResult[]> {
    const response = await axiosInstance.post<PersonnelSearchResult[]>('/personnelselection/search', criteria);
    return response.data;
  }

  async getAllApplicantProfiles(): Promise<ApplicantProfile[]> {
    const response = await axiosInstance.get<ApplicantProfile[]>('/applicant-profiles');
    return response.data;
  }

  async getAllAccessRights(): Promise<AccessRight[]> {
    const response = await axiosInstance.get<AccessRight[]>('/accessrights');
    return response.data;
  }

  async grantAccess(data: CreateAccessRightDto): Promise<AccessRight> {
    const response = await axiosInstance.post<AccessRight>('/accessrights', data);
    return response.data;
  }

  async revokeAccess(id: number): Promise<void> {
    await axiosInstance.delete(`/accessrights/${id}`);
  }

  async checkUserAccess(): Promise<boolean> {
    const response = await axiosInstance.get<boolean>('/accessrights/check');
    return response.data;
  }

  async getApplicantsForAccess(): Promise<ApplicantForAccess[]> {
    const response = await axiosInstance.get<ApplicantForAccess[]>('/accessrights/applicants');
    return response.data;
  }
}

export const managerService = new ManagerService();

