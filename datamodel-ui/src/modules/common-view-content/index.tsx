import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateCommonForm } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import {
  Button,
  ExternalLink,
  IconCopy,
  Link,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import FormattedDate from 'yti-common-ui/formatted-date';
import Separator from 'yti-common-ui/separator';
import ConceptView from '../concept-view';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import HasPermission from '@app/common/utils/has-permission';

export default function CommonViewContent({
  modelId,
  data,
  displayLabel,
  applicationProfile,
}: {
  modelId: string;
  data: Resource;
  displayLabel?: boolean;
  applicationProfile?: boolean;
}) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({
    actions: ['ADMIN_ASSOCIATION', 'ADMIN_ATTRIBUTE'],
  });

  function getDisplayLabelTitle(type: ResourceType) {
    switch (type) {
      case ResourceType.ASSOCIATION:
        return t('association-name', { ns: 'admin' });
      case ResourceType.ATTRIBUTE:
        return t('attribute-name', { ns: 'admin' });
      default:
        return t('name');
    }
  }

  function renderInfoTopPart() {
    if (!data) {
      return <></>;
    }

    if (applicationProfile) {
      return (
        <>
          {data.type === ResourceType.ASSOCIATION ? (
            <>
              <BasicBlock title={t('target-association', { ns: 'admin' })}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('association-targets-class')}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('minimum-count')}>
                {data.minCount ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('maximum-count')}>
                {data.maxCount ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={translateCommonForm('note', data.type, t)}>
                {getLanguageVersion({
                  data: data.note,
                  lang: i18n.language,
                }) !== '' ? (
                  <SanitizedTextContent
                    text={getLanguageVersion({
                      data: data.note,
                      lang: i18n.language,
                    })}
                  />
                ) : (
                  t('no-note')
                )}
              </BasicBlock>
            </>
          ) : (
            <>
              <BasicBlock title={t('target-attribute', { ns: 'admin' })}>
                {data.path ? (
                  <Link href={data.path}>
                    {data.path
                      .split('/')
                      .map((item, index) => {
                        const length: number = data.path
                          ? data.path.split('/').length
                          : 0;
                        if (index === length - 1 || index === length - 2) {
                          return item;
                        }
                        return undefined;
                      })
                      .filter(Boolean)
                      .join(':') ?? data.path}
                  </Link>
                ) : (
                  t('not-defined')
                )}
              </BasicBlock>
              <BasicBlock title={t('data-type')}>
                {data.dataType ?? t('not-defined')}
              </BasicBlock>
              <Separator />
              <div>
                <Text variant="bold">{t('restrictions')}</Text>
              </div>

              <BasicBlock title={t('codelist', { ns: 'admin' })}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('allowed-values')}>
                {data.allowedValues && data.allowedValues.length > 0
                  ? data.allowedValues.join(', ')
                  : t('selected-codelists')}
              </BasicBlock>

              <BasicBlock title={t('default-value', { ns: 'admin' })}>
                {data.defaultValue ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('required-value', { ns: 'admin' })}>
                {data.hasValue ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('minimum-length', { ns: 'admin' })}>
                {data.minLength ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('maximum-length', { ns: 'admin' })}>
                {data.maxLength ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('minimum-amount', { ns: 'admin' })}>
                {data.minCount ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('maximum-amount', { ns: 'admin' })}>
                {data.maxCount ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('larger-or-as-large-as', { ns: 'admin' })}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('smaller-or-as-small-as', { ns: 'admin' })}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('larger-than', { ns: 'admin' })}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('smaller-than', { ns: 'admin' })}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('string-attribute-format', { ns: 'admin' })}>
                {t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('string-attribute-languages', { ns: 'admin' })}
              >
                {t('not-defined')}
              </BasicBlock>

              <Separator />

              <BasicBlock title={translateCommonForm('note', data.type, t)}>
                {getLanguageVersion({
                  data: data.note,
                  lang: i18n.language,
                }) !== '' ? (
                  <SanitizedTextContent
                    text={getLanguageVersion({
                      data: data.note,
                      lang: i18n.language,
                    })}
                  />
                ) : (
                  t('no-note')
                )}
              </BasicBlock>
            </>
          )}
        </>
      );
    }

    return (
      <>
        {data.type === ResourceType.ATTRIBUTE && (
          <>
            <BasicBlock title={t('range', { ns: 'admin' })}>
              {data.range}
            </BasicBlock>

            <BasicBlock title={`${t('class', { ns: 'admin' })} (rdfs:domain)`}>
              {data.domain
                ? (data.domain as string).split('/').pop()?.replace('#', ':')
                : t('no-upper-attributes')}
            </BasicBlock>
          </>
        )}

        {data.type === ResourceType.ASSOCIATION && (
          <>
            <BasicBlock title={t('source-class', { ns: 'admin' })}>
              {data.range
                ? data.range.split('/').pop()?.replace('#', ':')
                : t('no-source-class')}
            </BasicBlock>

            <BasicBlock title={t('target-class', { ns: 'admin' })}>
              {data.domain
                ? (data.domain as string).split('/').pop()?.replace('#', ':')
                : t('no-target-class')}
            </BasicBlock>
          </>
        )}

        <BasicBlock title={translateCommonForm('upper', data.type, t)}>
          {!data.subResourceOf || data.subResourceOf.length === 0 ? (
            <>{translateCommonForm('no-upper', data.type, t)}</>
          ) : (
            <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
              {data.subResourceOf.map((c) => (
                <li key={c}>
                  <Link key={c} href={c} style={{ fontSize: '16px' }}>
                    {c.split('/').pop()?.replace('#', ':')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BasicBlock>

        <BasicBlock title={translateCommonForm('equivalent', data.type, t)}>
          {!data.equivalentResource || data.equivalentResource.length === 0 ? (
            <>{translateCommonForm('no-equivalent', data.type, t)}</>
          ) : (
            <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
              {data.equivalentResource.map((c) => (
                <li key={c}>
                  <Link key={c} href={c} style={{ fontSize: '16px' }}>
                    {c.split('/').pop()?.replace('#', ':')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BasicBlock>

        <BasicBlock title={translateCommonForm('note', data.type, t)}>
          {getLanguageVersion({
            data: data.note,
            lang: i18n.language,
          }) !== '' ? (
            <SanitizedTextContent
              text={getLanguageVersion({
                data: data.note,
                lang: i18n.language,
              })}
            />
          ) : (
            t('no-note')
          )}
        </BasicBlock>
      </>
    );
  }

  return (
    <>
      {displayLabel && (
        <BasicBlock title={getDisplayLabelTitle(data.type)}>
          {getLanguageVersion({
            data: data.label,
            lang: i18n.language,
            appendLocale: true,
          })}
        </BasicBlock>
      )}

      <BasicBlock title={translateCommonForm('identifier', data.type, t)}>
        {`${modelId}:${data.identifier}`}
      </BasicBlock>

      <BasicBlock title={t('uri')}>
        {data.uri}

        <Button
          icon={<IconCopy />}
          variant="secondary"
          onClick={() => navigator.clipboard.writeText(data.uri)}
          style={{ width: 'max-content' }}
          id="copy-to-clipboard-button"
        >
          {t('copy-to-clipboard')}
        </Button>
      </BasicBlock>

      <BasicBlock title={t('concept')}>
        <ConceptView data={data.subject} />
      </BasicBlock>

      {renderInfoTopPart()}

      <Separator />

      <BasicBlock title={t('references-from-other-components')}>
        {t('no-references')}
      </BasicBlock>

      <Separator />

      <BasicBlock title={t('created')}>
        <FormattedDate date={data.created} />
        {data.creator.name ? `, ${data.creator.name}` : ''}
      </BasicBlock>

      <BasicBlock title={t('modified-at')}>
        <FormattedDate date={data.modified} />
        {data.modifier.name ? `, ${data.modifier.name}` : ''}
      </BasicBlock>

      {hasPermission ? (
        <BasicBlock title={t('work-group-comment', { ns: 'admin' })}>
          {data.editorialNote ?? t('no-work-group-comment', { ns: 'admin' })}
        </BasicBlock>
      ) : (
        <></>
      )}

      <Separator />

      <BasicBlock title={t('contributors')}>
        {data.contributor?.map((contributor) =>
          getLanguageVersion({
            data: contributor.label,
            lang: i18n.language,
          })
        )}
      </BasicBlock>
      <BasicBlock>
        {translateCommonForm('contact-description', data.type, t)}
        <ExternalLink
          href={`mailto:${
            data.contact ?? 'yhteentoimivuus@dvv.fi'
          }?subject=${getLanguageVersion({
            data: data.label,
            lang: i18n.language,
          })}`}
          labelNewWindow={t('link-opens-new-window-external')}
        >
          {translateCommonForm('contact', data.type, t)}
        </ExternalLink>
      </BasicBlock>
    </>
  );
}
