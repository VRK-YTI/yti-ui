import { useTranslation } from 'next-i18next';
import { ContentRevision } from '@app/common/interfaces/content-revision.interface';
import FormattedDate from 'yti-common-ui/components/formatted-date';
import GenericTable from '@app/common/components/generic-table';
import { VersionHistoryContainer } from '@app/common/components/version-history/version-history.styles';
import { Type } from '@app/common/interfaces/search.interface';
import { useRouter } from 'next/router';
import { State } from '@app/common/interfaces/state.interface';

interface RevisionRow {
  versionLabel: string;
  pid: string;
  created: JSX.Element | undefined;
  state: State | undefined;
  linkUrl: JSX.Element | string;
  highlight?: boolean;
}

export default function VersionHistory({
  revisions,
  contentType,
  currentRevision,
}: {
  revisions: ContentRevision[];
  contentType: Type;
  currentRevision: string;
}) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const headers = [
    t('metadata.version-label'),
    t('metadata.pid'),
    t('metadata.created'),
    t('metadata.state'),
    '',
  ];

  const revisionsFormatted = revisions.map((revision) => {
    const linkUrl =
      contentType == 'SCHEMA'
        ? router.basePath + '/schema/' + revision.pid
        : router.basePath + '/crosswalk/' + revision.pid;
    const revisionRow : RevisionRow = {
      versionLabel: revision.versionLabel,
      pid: revision.pid,
      created: <FormattedDate date={revision.created} />,
      state: revision.state,
      linkUrl: currentRevision == revision.pid ? t('metadata.viewing') : <a href={linkUrl}>{t('metadata.view')}</a>,
    };
    if (currentRevision == revision.pid) {
      revisionRow.highlight = true;
    }
    return revisionRow;
  });

  return (
    <>
      <VersionHistoryContainer>
        <GenericTable
          items={revisionsFormatted}
          headings={headers}
          caption={''}
          staticHighlight={true}
        ></GenericTable>
      </VersionHistoryContainer>
    </>
  );
}
