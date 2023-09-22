import { ResourceType } from './resource-type.interface';

export interface ClassNodeDataType {
  applicationProfile?: boolean;
  identifier: string;
  label: { [key: string]: string };
  modelId: string;
  resources: {
    identifier: string;
    label: { [key: string]: string };
    type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE;
    codeLists?: string[];
    dataType?: string | null;
    maxCount?: number | null;
    minCount?: number | null;
  }[];
  refetch?: () => void;
}

export interface CornerNodeDataType {
  applicationProfile?: boolean;
  handleNodeDelete: (id: string) => void;
}

export interface EdgeDataType {
  identifier?: string;
  label?: { [key: string]: string };
  applicationProfile?: boolean;
  offsetSource?: number;
  offsetTarget?: number;
}
