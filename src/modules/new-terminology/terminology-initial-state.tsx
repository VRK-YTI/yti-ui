import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';

export const TerminologyDataInitialState: NewTerminologyInfo = {
  contact: ['', true],
  description: [[], true],
  infoDomains: [],
  contributors: [],
  prefix: ['', true],
  type: 'TERMINOLOGICAL_VOCABULARY',
};
