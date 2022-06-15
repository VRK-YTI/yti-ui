import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';

export const TerminologyDataInitialState: NewTerminologyInfo = {
  contact: ['', true],
  description: [[], true],
  infoDomains: [],
  mainOrg: undefined,
  otherOrgs: [],
  prefix: ['', true],
  type: 'TERMINOLOGICAL_VOCABULARY',
};
