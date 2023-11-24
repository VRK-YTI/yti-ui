import {useTranslation} from 'next-i18next';
import { SchemaWithVersionInfo } from '@app/common/interfaces/schema.interface';
import HistoryTable from '@app/common/components/history-table';

export default function VersionHistory({ schemaDetails }: {schemaDetails: SchemaWithVersionInfo}) {
  const { t } = useTranslation('common');

  const headers = [
    t('schema.version-label'),
    t('schema.pid'),
    t('schema.created'),
    t('schema.state'),
  ];

  const revisions = schemaDetails.revisions;
  // Temporarily mock data, really should be schemaDetails.revisions or something
  // const revisions =
  //   [
  //     {
  //       'pid': 'urn:IAMNOTAPID:9f02b4da-1766-4f3a-aa61-270c0bd3e460',
  //       'label': {
  //         'en': 'string'
  //       },
  //       'versionLabel': '1',
  //       'created': '2023-11-21',
  //       'state': 'PUBLISHED'
  //     },
  //     {
  //       'pid': 'urn:IAMNOTAPID:4faa61a3-1de9-451d-80f2-cce179e82084',
  //       'label': {
  //         'en': 'string'
  //       },
  //       'versionLabel': '1.1',
  //       'created': '2023-11-21',
  //       'state': 'DRAFT'
  //     }
  //   ];

  return (
    <HistoryTable
      headers={headers}
      revisions={revisions}
      ariaLabel={t('schema.versions')}
    />
  );
}
