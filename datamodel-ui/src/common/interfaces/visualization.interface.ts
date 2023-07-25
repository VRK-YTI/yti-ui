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
    referenceTarget: string;
  }[];
}

export interface VisualizationPutType {
  identifier: string;
  x: number;
  y: number;
  referenceTargets: string[];
}

export interface VisualizationHiddenNode {
  identifier: string;
  position: {
    x: number;
    y: number;
  };
  referenceTarget: string;
}

export interface VisualizationResult {
  nodes: VisualizationType[];
  hiddenNodes: VisualizationHiddenNode[];
}
