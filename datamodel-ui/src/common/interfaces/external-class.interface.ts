export interface ExternalClassType {
  uri: string;
  label: { [key: string]: string };
  description?: { [key: string]: string };
  attributes?: {
    label: { [key: string]: string };
    description?: { [key: string]: string };
    uri: string;
  }[];
  associations?: {
    label: { [key: string]: string };
    uri: string;
  }[];
}
