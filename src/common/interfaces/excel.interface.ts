export interface ImportStatus {
  processingProgress: number;
  processingTotal: number;
  status: string;
}

export interface ImportResponse {
  jobtoken: string;
  message: string;
}
