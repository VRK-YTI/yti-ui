export interface Schema {
  id: string;
  format: string;
  status: string;
  label: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  languages: {
    [key: string]: string;
  };
  organiztaion: [string];
}
