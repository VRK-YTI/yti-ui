import { SingleSelectData } from 'suomifi-ui-components';

export interface UpdateTerminology {
  key: string;
  data?: Array<Object> | string | SingleSelectData | null;
}
