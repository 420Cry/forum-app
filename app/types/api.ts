export interface MeResponse {
  id: string | null;
  email: string | null;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface ApiErrResponse {
  success: false;
  statusCode: string;
  message: string | string[];
  timestamp: string;
}
