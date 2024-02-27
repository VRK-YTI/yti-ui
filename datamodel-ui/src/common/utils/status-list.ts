import { Status } from '../interfaces/status.interface';

export const statusList: Status[] = [
  'DRAFT',
  'RETIRED',
  'SUGGESTED',
  'SUPERSEDED',
  'VALID',
];

export const inUseStatusList: Status[] = ['DRAFT', 'SUGGESTED', 'VALID'];

export const usedStatusList: Status[] = ['SUGGESTED', 'VALID'];

export const notInUseStatusList: Status[] = ['RETIRED', 'SUPERSEDED'];
