export interface SimpleResource {
  identifier: string;
  label: { [key: string]: string };
  modelId: string;
  uri: string;
  deactivated?: boolean;
  fromShNode?: boolean;
}
