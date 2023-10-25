import {Organization} from "@app/common/interfaces/organizations.interface";

export interface Label {
  [key: string]: string;
}

export type Status = 'DRAFT' | 'PUBLISHED' | 'INVALID' | 'DEPRECATED' | 'REMOVED'

export type Visibility = 'PRIVATE' | 'PUBLIC'

export type Type = 'CROSSWALK' | 'SCHEMA'

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

export interface MscrSearchResults {
  hits: {
    hits: MscrSearchResult[];
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
    total:{
      relation: string;
      value: number;
    };
    hits: [                     // ToDo: CrosswalkResult interface extending Crosswalk interface
      {                         // ToDo: Update Crosswalk interface
        _index: string;          // ToDo: SchemaResult interface extending Schema interface
        _id: string;             // ToDo: Update Schema interface
        source: {
          id: string;
          label: {              // ToDo: a Label interface?
            [key: string]: string;
          };
          status: Status;
          state: string;        // ToDo: a State interface
          visibility: string;   // ToDo: a Visibility interface
          modified: Date;
          created: Date;
          contentModified: Date;
          type: string;         // ToDo: a Type interface (ours, with SCHEMA and CROSSWALK)
          prefix: string;
          comment: {            // ToDo: a Comment interface?
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
          revisions: [                  // ToDo: a Revision interface
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
  aggregations: {                       // ToDo: an Aggregation interface
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
