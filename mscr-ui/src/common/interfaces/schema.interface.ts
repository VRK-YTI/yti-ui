export interface Schema {
  namespace?: string;
  pid?: string;
  format?: string;
  // TODO: Change all mentions of 'status' into 'state'
  status?: string;
  state?: string;
  label?: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  languages?: string[];
  organizations: Organization[];
  filedata?: File;
  prefix?: string;
  revision?: string;
  visibility?: string;
  created?: string;
  uri?: string;
  versionLabel?: string;
}

export interface Revision {
  pid: string;
  label: {
    [key: string]: string;
  };
  versionLabel: string;
  state?: string;
  created?: string;
}

export interface SchemaWithVersionInfo extends Schema {
  revisions: Revision[];
}

export interface Organization {
  id: string;
  parentOrganization?: string;
  label: { [key: string]: string };
}

export interface SchemaFormType {
  namespace?: string;
  contact?: boolean;
  serviceCategories?: any;
  pid?: string;
  format?: string;
  label?: { [key: string]: string };
  languages: any;
  organizations: any;
  filedata?: any;
  description?: any;
  status?: any;
  uri?: any;
}
