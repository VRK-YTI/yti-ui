import { ResourceType } from './resource-type.interface';
import { ReferenceType } from './visualization.interface';

export interface ClassNodeDataType {
  applicationProfile?: boolean;
  identifier: string;
  label: { [key: string]: string };
  uri: string;
  modelId: string;
  resources: {
    identifier: string;
    label?: { [key: string]: string };
    uri: string;
    type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE;
    codeLists?: string[];
    dataType?: string | null;
    maxCount?: number | null;
    minCount?: number | null;
  }[];
  organizationIds?: string[];
}

export interface AttributeNodeType {
  identifier: string;
  label: { [key: string]: string };
  uri: string;
  modelId: string;
  dataType?: string;
}

export interface CornerNodeDataType {
  applicationProfile?: boolean;
  handleNodeDelete: (id: string) => void;
}

export interface EdgeDataType {
  identifier?: string;
  modelId?: string;
  label?: { [key: string]: string } | string;
  applicationProfile?: boolean;
  offsetSource?: number;
  offsetTarget?: number;
  origin?: string;
  /**
   * Type of reference this edge represents.
   * Refactored to be part of edge.data rather than spread at the edge root level,
   * following React Flow's recommended pattern for custom edge properties.
   * See: https://reactflow.dev/learn/advanced-use/typescript
   */
  referenceType?: ReferenceType;
}
