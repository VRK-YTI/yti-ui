import { Status } from 'yti-common-ui/interfaces/status.interface';

export interface CodeInformationDomainType {
  id: string;
  codeValue: string;
  status: Status;
  prefLabel: { [key: string]: string };
  count: number;
}
