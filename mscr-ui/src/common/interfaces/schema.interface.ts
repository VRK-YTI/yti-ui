
export interface Schema {
  pid: string;
  format: string;
  status: string;
  label: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  languages: string[];
  organizations: Organization[];
  filedata: File;
  prefix: string;
  revision: string;
}
export interface Organization {
  id: string;
  parentOrganization?: string;
  label: { [key: string]: string };
}

export interface SchemaFormType {
  contact?: boolean;
  serviceCategories?: any;
  pid?: string;
  format: string;
  label?: { [key: string]: string };
  languages: any;
  organizations: any;
  filedata?: any;
  description?: any;
  status?: any;
}
