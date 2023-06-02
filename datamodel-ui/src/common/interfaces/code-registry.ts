export interface CodeRegistry {
  id: string;
  codeValue: string;
  uri: string;
  url: string;
  prefLabel: {
    [key: string]: string;
  };
  created: string;
  modified: string;
  codeSchemesUrl: string;
  organizations: {
    id: string;
  }[];
}
