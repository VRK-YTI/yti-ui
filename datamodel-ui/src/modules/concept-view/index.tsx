import { getEnvParam } from '@app/common/components/uri-info';
import { ConceptType } from '@app/common/interfaces/concept-interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  ExternalLink,
  Heading,
  Paragraph,
} from 'suomifi-ui-components';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import Separator from 'yti-common-ui/separator';

export default function ConceptView({
  data,
}: {
  data: ConceptType | undefined;
}) {
  const { t, i18n } = useTranslation('common');

  if (!data) {
    return <>{t('concept-not-added')}</>;
  } else if (Object.keys(data.label).length === 0) {
    return <>{data.conceptURI}</>;
  }

  return (
    <div style={{ marginTop: '5px' }}>
      <Expander>
        <ExpanderTitleButton>
          {getLanguageVersion({
            data: data.label,
            lang: i18n.language,
            appendLocale: true,
          })}
        </ExpanderTitleButton>
        <ExpanderContent>
          {data.definition && Object.keys(data.definition).length !== 0 && (
            <Paragraph mb="m">
              <SanitizedTextContent
                text={getLanguageVersion({
                  data: data.definition,
                  lang: i18n.language,
                  appendLocale: true,
                })}
              />
            </Paragraph>
          )}
          <Heading variant="h4">{t('concept')}</Heading>
          <Paragraph mb="m">
            <ExternalLink
              href={`${data.conceptURI}${getEnvParam(data.conceptURI, true)}`}
              labelNewWindow={t('link-opens-new-window-external')}
            >
              {getLanguageVersion({
                data: data.label,
                lang: i18n.language,
                appendLocale: true,
              })}
            </ExternalLink>
          </Paragraph>

          <Separator />

          <Heading variant="h4">{t('concept-status')}</Heading>
          <Paragraph mb="m">{translateStatus(data.status, t)}</Paragraph>

          <Heading variant="h4">{t('terminology')}</Heading>
          <Paragraph>
            <ExternalLink
              href={`${data.terminology.uri}${getEnvParam(
                data.terminology.uri,
                true
              )}`}
              labelNewWindow={t('link-opens-new-window-external')}
            >
              {getLanguageVersion({
                data: data.terminology?.label,
                lang: i18n.language,
                appendLocale: true,
              })}
            </ExternalLink>
          </Paragraph>
        </ExpanderContent>
      </Expander>
    </div>
  );
}
