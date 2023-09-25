export interface NewModel {
  id: string;
  description: { [key: string]: string };
  label: { [key: string]: string };
  groups: string[];
  languages: string[];
  organizations: string[];
  prefix: string;
  type: string;
  contact: string;
}
