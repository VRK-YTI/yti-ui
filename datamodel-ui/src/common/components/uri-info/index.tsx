import { UriData } from '@app/common/interfaces/uri.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { ExternalLink, Text } from 'suomifi-ui-components';

interface UriInfoProps {
  uri?: UriData;
  lang: string;
  notDefinedText?: string;
  showPlainText?: boolean;
}

export function getEnvParam(uri?: string) {
  if (!uri || uri.indexOf('uri.suomi.fi') === -1) {
    return '';
  }

  const hostname = window.location.hostname;
  if (hostname.indexOf('dev') > -1) {
    return '?env=awsdev';
  } else if (hostname.indexOf('test') > -1) {
    return '?env=awstest';
  } else if (hostname.indexOf('local') > -1) {
    return '?env=local';
  }
  return '';
}

export default function UriInfo({
  uri,
  lang,
  notDefinedText,
  showPlainText,
}: UriInfoProps) {
  const { t } = useTranslation('common');
  const envParam = getEnvParam(uri?.uri);

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
            href={`${uri.uri}${envParam}`}
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
