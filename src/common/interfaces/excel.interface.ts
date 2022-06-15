export interface ImportStatus {
  processingProgress: number;
  processingTotal: number;
  status: string;
}

export interface ImportResponse {
  jobToken: string;
  message: string;
}
