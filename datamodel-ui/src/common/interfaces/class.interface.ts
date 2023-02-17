import { Status } from './status.interface';

export interface ClassType {
  label: { [key: string]: string };
  comment: string;
  status: Status;
  equivalentClass: string[];
  subClassOf: string[];
  subject: string;
  identifier: string;
  note: { [key: string]: string };
}
