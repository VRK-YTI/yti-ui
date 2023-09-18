export interface Organization {
  id: string;
  label: {
    [key: string]: string;
  };
  parentId?: string;
}
