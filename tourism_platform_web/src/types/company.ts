export interface Company {
  id: string;
  name: string;
  planType: string;
  isActive: boolean;
  createdAt: string;
  subscriptionEndsAt?: string | null;
  applicationId: number;
  applicationName: string;
  usersCount: number;
  travelPlansCount: number;
  quotesCount: number;
}

export interface CreateCompanyRequest {
  name: string;
  planType: string;
  applicationId: number;
  subscriptionEndsAt?: string | null;
}

export interface UpdateCompanyRequest {
  name?: string;
  planType?: string;
  isActive?: boolean;
  subscriptionEndsAt?: string | null;
}
