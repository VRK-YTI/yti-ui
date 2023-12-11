import { Organization } from '@app/common/interfaces/organizations.interface';
import { Revision } from '@app/common/interfaces/schema.interface';

export interface Label {
  [key: string]: string;
}

export type State =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'INVALID'
  | 'DEPRECATED'
  | 'REMOVED';

export type Visibility = 'PRIVATE' | 'PUBLIC';

export type Type = 'CROSSWALK' | 'SCHEMA';

export interface ResultInfo {
  id: string;
  label: Label;
  state: State;
  comment: { [key: string]: string };
  visibility: Visibility;
  modified: Date;
  created: Date;
  contentModified: Date;
  type: Type;
  prefix: string;
  organizations: Organization[];
  revisions: Revision[];
  versionLabel: string;
  namespace: string;
}

export interface PatchedResult extends ResultInfo {
  description: {
    [key: string]: string;
  };
}

export interface MscrSearchResult {
  _id: string;
  _source: ResultInfo;
}

export type Facet =
  | 'state'
  | 'type'
  | 'format'
  | 'organization'
  | 'isReferenced';

export interface Filter {
  label: string;
  facet: Facet;
  options: Array<{
    label?: string;
    key: string;
    count: number;
  }>;
}

export interface Bucket {
  key: string;
  label?: string;
  doc_count: number;
}

export interface MscrSearchResults {
  hits: {
    hits: MscrSearchResult[];
  };
  aggregations: {
    [key: string]: {
      buckets: Bucket[];
    };
  };
}
