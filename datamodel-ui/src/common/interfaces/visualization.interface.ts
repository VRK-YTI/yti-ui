export interface VisualizationType {
  identifier: string;
  label: { [key: string]: string };
  parentClasses: string[];
  position: {
    x: number;
    y: number;
  };
  attributes: {
    identifier: string;
    label: { [key: string]: string };
  }[];
  associations: {
    identifier: string;
    label: { [key: string]: string };
    path: string[];
  }[];
}
