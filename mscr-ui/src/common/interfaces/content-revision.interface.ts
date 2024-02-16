export interface ContentRevision {
  pid: string;
  label: {
    [key: string]: string;
  };
  versionLabel: string;
  state?: string;
  created?: string;
}
