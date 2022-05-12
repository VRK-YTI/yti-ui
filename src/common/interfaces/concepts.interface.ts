export interface Concepts {
  altLabel: { [key: string]: string };
  definition: { [key: string]: string };
  id: string;
  label: { [key: string]: string };
  modified: string;
  status: string;
  terminology: {
    id: string;
    label: { [key: string]: string };
    status: string;
    uri: string;
  };
  uri: string;
}
