import { Organization } from '@app/common/interfaces/organizations.interface';

export interface Label {
  [key: string]: string;
}

export type Status =
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
  status: Status;
  visibility: Visibility;
  modified: Date;
  created: Date;
  contentModified: Date;
  type: Type;
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

export type Facet = 'state' | 'type' | 'format' | 'organization' | 'sourceType';

export interface Filter {
  label: string;
  facet: Facet;
  options: Array<{
    label: string;
    key: string;
    count: number;
  }>;
}

export interface Bucket {
  key: string;
  label: string;
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

export interface MscrSearchResultsX {
  took: number;
  timedOut: boolean;
  shards: {
    failed: number;
    successful: number;
    total: number;
    skipped: number;
  };
  hits: {
    total: {
      relation: string;
      value: number;
    };
    hits: [
      // ToDo: CrosswalkResult interface extending Crosswalk interface?
      {
        // ToDo: Update Crosswalk interface?
        _index: string; // ToDo: SchemaResult interface extending Schema interface?
        _id: string; // ToDo: Update Schema interface?
        source: {
          id: string;
          label: {
            [key: string]: string;
          };
          status: Status;
          state: string;
          visibility: string;
          modified: Date;
          created: Date;
          contentModified: Date;
          type: string;
          prefix: string;
          comment: {
            // ToDo: a Comment interface?
            [key: string]: string;
          };
          contributor: string[];
          organizations: Organization[];
          isPartOf: [];
          language: string[];
          format: string;
          aggregationKey: string;
          revisionOf: string;
          numberOfRevisions: number;
          revisions: [
            // ToDo: a Revision interface
            {
              pid: string;
              created: number;
              label: {
                [key: string]: string;
              };
              versionLabel: string;
            }
          ];
        };
        sort: Object[];
      }
    ];
  };
  aggregations: {
    // ToDo: an Aggregation interface
    [key: string]: {
      buckets: [
        {
          docCount: number;
          key: string;
        }
      ];
      docCountErrorUpperBound: number;
      sumOtherDocCount: number;
    };
  };
}
