import { NewTerminologyInfo } from '@app/common/interfaces/new-terminology-info';

export const TerminologyDataInitialState: NewTerminologyInfo = {
  contact: '',
  description: [[], true],
  infoDomains: [],
  contributors: [],
  prefix: ['', true],
  type: 'TERMINOLOGICAL_VOCABULARY',
};
