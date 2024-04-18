import { Organization } from '@app/common/interfaces/organizations.interface';
import { State } from '@app/common/interfaces/state.interface';
import { Format } from '@app/common/interfaces/format.interface';
import { ContentRevision } from '@app/common/interfaces/content-revision.interface';
import { UrlState } from '@app/common/utils/hooks/use-url-state';

export interface Label {
  [key: string]: string;
}

export enum Visibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export enum Type {
  Crosswalk = 'CROSSWALK',
  Schema = 'SCHEMA'
}

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
  revisions: ContentRevision[];
  numberOfRevisions: number;
  versionLabel: string;
  namespace: string;
  format?: Format;
}

export interface PaginatedQuery {
  query?: string;
  type?: Type;
  ownerOrg?: string;
  pageSize: number;
  urlState: UrlState;
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

export interface Bucket {
  key: string;
  label?: string;
  doc_count: number;
}

export interface Aggregations {
  [key: string]: {
    buckets: Bucket[];
  };
}

export interface MscrSearchResults {
  hits: {
    total?: {
      value: number;
    };
    hits: MscrSearchResult[];
  };
  aggregations: Aggregations;
}
