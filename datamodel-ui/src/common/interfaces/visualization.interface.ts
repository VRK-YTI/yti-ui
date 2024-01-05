export interface VisualizationType {
  identifier: string;
  label: { [key: string]: string };
  uri: string;
  references: VisualizationReferenceType[];
  position: Position;
  attributes?: {
    identifier: string;
    label: { [key: string]: string };
    uri: string;
    dataType?: string;
    minCount?: number;
    maxCount?: number;
    codeLists?: string[];
  }[];
  associations?: VisualizationReferenceType[];
  type: NodeType;
  dataType?: string;
  targetClass?: string;
}

export interface VisualizationReferenceType {
  identifier: string;
  label?: { [key: string]: string };
  uri: string;
  referenceTarget: string;
  referenceType: ReferenceType;
  minCount?: number;
  maxCount?: number;
}

export interface Position {
  x: number;
  y: number;
}

export type NodeType = 'CLASS' | 'EXTERNAL_CLASS' | 'ATTRIBUTE';

export type ReferenceType = 'ATTRIBUTE_DOMAIN' | 'PARENT_CLASS' | 'ASSOCIATION';

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
  referenceType: ReferenceType;
}

export interface VisualizationResult {
  nodes: VisualizationType[];
  hiddenNodes: VisualizationHiddenNode[];
}
