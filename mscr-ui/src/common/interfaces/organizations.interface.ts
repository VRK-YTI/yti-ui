// Are we using anywhere parentId field of organization?

/* export interface Organization {
  id: string;
  label: {
    [key: string]: string;
  };
  parentId?: string;
} */

export interface Organization {
  id: string;
  parentOrganization?: string;
  label: { [key: string]: string };
}