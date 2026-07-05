export interface ApiErrResponse {
  success: false;
  statusCode: string;
  message: string | string[];
  timestamp: string;
}
