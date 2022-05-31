export interface ImportStatus {
  processingProgress: number;
  processingTota: number;
  status: string;
}

export interface ImportResponse {
  jobToken: string;
  message: string;
}
