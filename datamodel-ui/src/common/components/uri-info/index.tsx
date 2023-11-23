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

export function getEnvParam(uri: string, v1?: boolean) {
  if (
    (uri.indexOf('uri.suomi.fi') === -1 &&
      uri.indexOf('iri.suomi.fi') === -1) ||
    typeof window === 'undefined'
  ) {
    return '';
  }

  const hostname = window.location.hostname;
  if (hostname.indexOf('dev') > -1) {
    return v1 ? '?env=awsdev' : '?env=awsdev_v2';
  } else if (hostname.indexOf('test') > -1) {
    return v1 ? '?env=awstest' : '?env=awstest_v2';
  } else if (hostname.indexOf('local') > -1) {
    return '?env=local';
  } else if (hostname.indexOf('beta') > -1) {
    return v1 ? '' : '?env=awsbeta_v2';
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
