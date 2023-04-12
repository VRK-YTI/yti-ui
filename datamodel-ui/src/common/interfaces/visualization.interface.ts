export interface VisualizationType {
  identifier: string;
  label: { [key: string]: string };
  parentClasses: string[];
  position: {
    x: number;
    y: number;
  };
  attributes: [];
  associations: [];
}
