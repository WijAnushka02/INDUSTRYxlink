/**
 * INDUSTRYxLINK – Frontend Type Definitions
 *
 * Shared TypeScript types for the frontend application.
 */

/** User roles matching the backend */
export type UserRole = 'STUDENT' | 'LECTURER' | 'UNIVERSITY_COORDINATOR' | 'COMPANY_COORDINATOR' | 'ADMIN';

/** Authenticated user */
export interface User {
  _id: string;
  email: string;
  role: UserRole;
  universityId?: string;
  companyId?: string;
}

/** Visit Opportunity */
export interface VisitOpportunity {
  _id: string;
  companyId: {
    _id: string;
    name: string;
    location?: string;
  };
  visitDate: string;
  durationHours?: number;
  capacity: number;
  topic?: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  eligibleDegrees: string[];
  createdAt: string;
}

/** Visit Request */
export interface VisitRequest {
  _id: string;
  universityId: string;
  companyId: string;
  opportunityId: string;
  requestedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  studentCount?: number;
  createdAt: string;
}

/** Company match result from Company Matching Agent */
export interface CompanyMatch {
  companyId: string;
  companyName: string;
  opportunityId: string;
  suitabilityScore: number;
  matchDetails: {
    degreeMatch: number;
    topicMatch: number;
    capacityMatch: number;
    dateCompatibility: number;
    locationScore: number;
    previousEngagement: number;
  };
}

/** Agent pipeline result */
export interface PipelineResult {
  pipelineId: string;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  matchedCompanies: CompanyMatch[];
  availableCompanies: CompanyMatch[];
  emailsSent: number;
  remindersScheduled: number;
  errors: string[];
}

/** Agent status */
export interface AgentInfo {
  name: string;
  status: string;
  description: string;
}

/** Agent system status response */
export interface AgentSystemStatus {
  agents: AgentInfo[];
  totalAgents: number;
  recentPipelines: number;
  systemStatus: string;
}

/** Visit report */
export interface VisitReportData {
  visitId: string;
  universityName: string;
  companyName: string;
  visitDate: string;
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  noShows: number;
  summary: string;
  recommendations: string[];
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  page: number;
  pages: number;
  total: number;
  [key: string]: T[] | number;
}

/** Public statistics */
export interface PublicStats {
  totalOpportunities: number;
  totalRequests: number;
  totalUniversities: number;
  totalCompanies: number;
}
