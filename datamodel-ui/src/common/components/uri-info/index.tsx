import { UriData } from '@app/common/interfaces/uri.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { ExternalLink, Text } from 'suomifi-ui-components';
import { getEnvParam } from 'yti-common-ui/utils/link-utils';

interface UriInfoProps {
  uri?: UriData;
  lang: string;
  notDefinedText?: string;
  showPlainText?: boolean;
}

export default function UriInfo({
  uri,
  lang,
  notDefinedText,
  showPlainText,
}: UriInfoProps) {
  const { t } = useTranslation('common');

  if (!uri) {
    return <>{notDefinedText ?? t('not-defined')}</>;
  }

  return (
    <div style={{ display: 'inline' }}>
      {!showPlainText ? (
        <>
          <Text style={{ fontSize: '16px', paddingRight: '2px' }}>
            {getLanguageVersion({
              data: uri.label,
              lang: lang ?? 'fi',
            })}
          </Text>
          (
          <ExternalLink
            key={uri.uri}
            href={`${uri.uri}${getEnvParam(uri.uri)}`}
            labelNewWindow={t('link-opens-new-window-external')}
          >
            {uri.curie}
          </ExternalLink>
          )
        </>
      ) : (
        uri.curie
      )}
    </div>
  );
}
