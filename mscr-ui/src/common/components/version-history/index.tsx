import { useTranslation } from 'next-i18next';
import { ContentRevision } from '@app/common/interfaces/content-revision.interface';
import FormattedDate from 'yti-common-ui/components/formatted-date';
import GenericTable from '@app/common/components/generic-table';
import { VersionHistoryContainer } from '@app/common/components/version-history/version-history.styles';

export default function VersionHistory({
  revisions,
}: {
  revisions: ContentRevision[];
}) {
  const { t } = useTranslation('common');
  const headers = [
    t('metadata.version-label'),
    t('metadata.pid'),
    t('metadata.created'),
    t('metadata.state'),
  ];

  const revisionsFormatted = revisions.map((revision) => ({
    versionLabel: revision.versionLabel,
    pid: revision.pid,
    created: <FormattedDate date={revision.created} />,
    state: revision.state,
  }));

  return (
    <>
      <VersionHistoryContainer>
        <GenericTable
          items={revisionsFormatted}
          headings={headers}
          caption={t('metadata.versions')}
        ></GenericTable>
      </VersionHistoryContainer>
    </>
  );
}
