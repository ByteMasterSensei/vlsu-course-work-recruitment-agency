import axiosInstance from '../utils/axiosConfig';

export interface ApplicantProfile {
  id: number;
  userId: number;
  desiredPosition?: string;
  desiredSalary?: string;
  additionalInfo?: string;
  readyToRelocate: boolean;
  readyForBusinessTrips: boolean;
  status: string;
  createdAt: string;
  updatedAt?: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  skills: ApplicantSkill[];
}

export interface Education {
  id?: number;
  institution: string;
  specialty: string;
  degree?: string;
  graduationYear?: number;
}

export interface WorkExperience {
  id?: number;
  companyName: string;
  position: string;
  responsibilities?: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
}

export interface ApplicantSkill {
  id?: number;
  skillName: string;
  skillLevel?: string;
}

export interface CreateApplicantProfile {
  desiredPosition?: string;
  desiredSalary?: string;
  additionalInfo?: string;
  readyToRelocate: boolean;
  readyForBusinessTrips: boolean;
  educations: Education[];
  workExperiences: WorkExperience[];
  skills: ApplicantSkill[];
}

class ApplicantProfileService {
  async getMyProfiles(): Promise<ApplicantProfile[]> {
    const response = await axiosInstance.get<ApplicantProfile[]>('/applicant-profiles/my');
    return response.data;
  }

  async getProfileById(id: number): Promise<ApplicantProfile> {
    const response = await axiosInstance.get<ApplicantProfile>(`/applicant-profiles/${id}`);
    return response.data;
  }

  async createProfile(data: CreateApplicantProfile): Promise<ApplicantProfile> {
    const response = await axiosInstance.post<ApplicantProfile>('/applicant-profiles', data);
    return response.data;
  }

  async updateProfile(id: number, data: Partial<CreateApplicantProfile>): Promise<ApplicantProfile> {
    const response = await axiosInstance.put<ApplicantProfile>(`/applicant-profiles/${id}`, data);
    return response.data;
  }

  async deleteProfile(id: number): Promise<void> {
    await axiosInstance.delete(`/applicant-profiles/${id}`);
  }

  async updateStatus(id: number, status: number): Promise<void> {
    await axiosInstance.patch(`/applicant-profiles/${id}/status`, { status });
  }
}

export const applicantProfileService = new ApplicantProfileService();


