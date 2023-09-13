import { ExternalLink, Text } from 'suomifi-ui-components';
import { UriData } from '@app/common/interfaces/uri.interface';
import { UriListWrapper } from './uri-list.style';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { getEnvParam } from '../uri-info';
import { useTranslation } from 'next-i18next';

interface UriListProps {
  items: UriData[];
  lang: string;
}

export default function UriList({ items, lang }: UriListProps) {
  const { t } = useTranslation('common');

  if (!items) {
    return <></>;
  }

  return (
    <UriListWrapper>
      {items.map((c) => (
        <li key={c.uri}>
          <Text style={{ fontSize: '16px', paddingRight: '2px' }}>
            {getLanguageVersion({
              data: c.label,
              lang: lang ?? 'fi',
            })}
          </Text>
          (
          <ExternalLink
            key={c.uri}
            href={`${c.uri}${getEnvParam(c.uri)}`}
            style={{ fontSize: '16px' }}
            labelNewWindow={t('link-opens-new-window-external')}
          >
            {c.curie}
          </ExternalLink>
          )
        </li>
      ))}
    </UriListWrapper>
  );
}
