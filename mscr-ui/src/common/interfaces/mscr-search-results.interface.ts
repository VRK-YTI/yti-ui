import {Status} from '@app/common/interfaces/status.interface';
import {Organization} from '@app/common/interfaces/organizations.interface';

export interface MscrSearchResults {
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
        index: string;          // ToDo: SchemaResult interface extending Schema interface
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
        sort: string[];                 // No idea what this should be, all I have is null
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
      sunOtherDocCoint: number;
    };
  };
}
