import { useGetResourceReferencesQuery } from '@app/common/components/resource/resource.slice';
import UriInfo from '@app/common/components/uri-info';
import { useTranslation } from 'react-i18next';
import { BasicBlock } from 'yti-common-ui/block';

export default function ResourceReferences({
  open,
  uri,
}: {
  open: boolean;
  uri: string;
}) {
  const { t, i18n } = useTranslation('common');
  const { data: referencesResult } = useGetResourceReferencesQuery(
    { uri },
    { skip: !open }
  );

  if (!referencesResult) {
    return <></>;
  }

  const keys = Object.keys(referencesResult);

  if (keys.length === 0) {
    return <>{t('no-references')}</>;
  }

  return (
    <>
      {keys.map((key) => (
        <BasicBlock key={key} title={t(key.toLowerCase())}>
          <ul style={{ margin: '0px', paddingLeft: '30px' }}>
            {referencesResult[key]?.map((ref) => (
              <li key={`${ref.resourceURI}_${ref.property}`}>
                <UriInfo lang={i18n.language} uri={ref.resourceURI}></UriInfo>
                <div style={{ fontSize: '14px' }}>{ref.property}</div>
              </li>
            ))}
          </ul>
        </BasicBlock>
      ))}
    </>
  );
}
