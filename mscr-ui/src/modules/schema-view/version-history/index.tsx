import { useTranslation } from 'next-i18next';
import { SchemaWithVersionInfo } from '@app/common/interfaces/schema.interface';
import HistoryTable from '@app/common/components/history-table';

export default function VersionHistory({
  schemaDetails,
}: {
  schemaDetails: SchemaWithVersionInfo;
}) {
  const { t } = useTranslation('common');

  const headers = [
    t('schema.version-label'),
    t('schema.pid'),
    t('schema.created'),
    t('schema.state'),
  ];

  return (
    <HistoryTable
      headers={headers}
      revisions={schemaDetails.revisions}
      ariaLabel={t('schema.versions')}
    />
  );
}
