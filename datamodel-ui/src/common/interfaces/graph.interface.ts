import { ResourceType } from './resource-type.interface';

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
  refetch?: () => void;
}

export interface AttributeNodeType {
  identifier: string;
  label: { [key: string]: string };
  uri: string;
  modelId: string;
  dataType?: string;
  refetch?: () => void;
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
}
