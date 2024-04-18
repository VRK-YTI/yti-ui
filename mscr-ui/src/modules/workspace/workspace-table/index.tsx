import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  MscrSearchResults,
  Type,
} from '@app/common/interfaces/search.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import GenericTable from '@app/common/components/generic-table';

export default function WorkspaceTable({
  data,
  contentType,
}: {
  data?: MscrSearchResults;
  contentType: Type;
}) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? '';

  if (!data) return <></>;

  const caption =
    contentType == 'SCHEMA'
      ? t('workspace.schemas')
      : t('workspace.crosswalks');

  const headings = [
    t('workspace.label'),
    t('workspace.namespace'),
    t('workspace.state'),
    t('workspace.numberOfRevisions'),
    t('workspace.pid'),
    '',
  ];

  const items = data.hits.hits.map((result) => {
    const info = result._source;
    const linkUrl =
      contentType == 'SCHEMA'
        ? router.basePath + '/schema/' + info.id
        : router.basePath + '/crosswalk/' + info.id;
    return {
      label: getLanguageVersion({
        data: info.label,
        lang,
      }),
      namespace: info.namespace,
      state: info.state,
      numberOfRevisions: info.numberOfRevisions.toString(),
      pid: info.handle ?? t('metadata.not-available'),
      linkUrl: <a href={linkUrl}>{t('workspace.view')}</a>,
    };
  });

  return <GenericTable items={items} headings={headings} caption={caption} />;
}
