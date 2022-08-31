export interface NewTerminologyInfo {
  contact: [string, boolean];
  description: [
    {
      lang: string;
      name: string;
      description: string;
    }[],
    boolean
  ];
  infoDomains: {
    groupId: string;
    labelText: string;
    name: string;
    uniqueItemId: string;
  }[];
  contributors: {
    labelText: string;
    name: string;
    organizationId: string;
    uniqueItemId: string;
  }[];
  prefix: [string, boolean];
  status?: string;
  type: string;
}
