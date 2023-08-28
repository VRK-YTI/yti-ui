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
import { useSelector } from 'react-redux';
import { selectDisplayLang } from '@app/common/components/model/model.slice';
import { ADMIN_EMAIL } from '@app/common/utils/get-value';

export default function CommonViewContent({
  modelId,
  inUse,
  data,
  displayLabel,
  applicationProfile,
}: {
  modelId: string;
  inUse?: boolean;
  data: Resource;
  displayLabel?: boolean;
  applicationProfile?: boolean;
}) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({
    actions: ['ADMIN_ASSOCIATION', 'ADMIN_ATTRIBUTE'],
  });
  const displayLang = useSelector(selectDisplayLang());

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
                {data.path ? (
                  <Link href={data.path.uri}>{data.path.curie}</Link>
                ) : (
                  t('not-defined')
                )}
              </BasicBlock>

              <BasicBlock title={t('association-targets-class')}>
                {data.classType?.curie ? (
                  <Link href={data.classType.uri}>{data.classType.curie}</Link>
                ) : (
                  t('not-defined')
                )}
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
                  lang: displayLang ?? i18n.language,
                }) !== '' ? (
                  <SanitizedTextContent
                    text={getLanguageVersion({
                      data: data.note,
                      lang: displayLang ?? i18n.language,
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
                  <Link href={data.path.uri}>{data.path.curie}</Link>
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
                {data.codeLists && data.codeLists?.length > 0
                  ? data.codeLists.map((codeList) => (
                      <Link key={codeList} href={codeList}>
                        {codeList.split('/').slice(-2).join(':')}
                      </Link>
                    ))
                  : t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('allowed-values')}>
                {data.allowedValues && data.allowedValues.length > 0
                  ? data.allowedValues.join(', ')
                  : t('not-defined')}
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
                {data.minInclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('smaller-or-as-small-as', { ns: 'admin' })}>
                {data.maxInclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('larger-than', { ns: 'admin' })}>
                {data.minExclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('smaller-than', { ns: 'admin' })}>
                {data.maxExclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock title={t('string-attribute-format', { ns: 'admin' })}>
                {data.pattern ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('string-attribute-languages', { ns: 'admin' })}
              >
                {data.languageIn
                  ? data.languageIn.join(', ')
                  : t('not-defined')}
              </BasicBlock>

              <Separator />

              <BasicBlock title={translateCommonForm('note', data.type, t)}>
                {getLanguageVersion({
                  data: data.note,
                  lang: displayLang ?? i18n.language,
                }) !== '' ? (
                  <SanitizedTextContent
                    text={getLanguageVersion({
                      data: data.note,
                      lang: displayLang ?? i18n.language,
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
              {data.range?.curie}
            </BasicBlock>

            <BasicBlock title={`${t('class', { ns: 'admin' })} (rdfs:domain)`}>
              {data.domain ? data.domain?.curie : t('no-upper-attributes')}
            </BasicBlock>
          </>
        )}

        {data.type === ResourceType.ASSOCIATION && (
          <>
            <BasicBlock title={t('source-class', { ns: 'admin' })}>
              {data.range ? data.range?.curie : t('no-source-class')}
            </BasicBlock>

            <BasicBlock title={t('target-class', { ns: 'admin' })}>
              {data.domain ? data.domain?.curie : t('no-target-class')}
            </BasicBlock>
          </>
        )}

        <BasicBlock title={translateCommonForm('upper', data.type, t)}>
          {!data.subResourceOf || data.subResourceOf.length === 0 ? (
            <>{translateCommonForm('no-upper', data.type, t)}</>
          ) : (
            <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
              {data.subResourceOf.map((c) => (
                <li key={c.uri}>
                  <Link key={c.uri} href={c.uri} style={{ fontSize: '16px' }}>
                    {c.curie}
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
                <li key={c.uri}>
                  <Link key={c.uri} href={c.uri} style={{ fontSize: '16px' }}>
                    {c.curie}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BasicBlock>

        <BasicBlock title={translateCommonForm('note', data.type, t)}>
          {getLanguageVersion({
            data: data.note,
            lang: displayLang ?? i18n.language,
          }) !== '' ? (
            <SanitizedTextContent
              text={getLanguageVersion({
                data: data.note,
                lang: displayLang ?? i18n.language,
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
      {applicationProfile && (
        <BasicBlock title={t('in-use-in-this-model', { ns: 'admin' })}>
          {inUse
            ? t('in-use', { ns: 'admin' })
            : t('not-in-use', { ns: 'admin' })}
        </BasicBlock>
      )}

      {displayLabel && (
        <BasicBlock title={getDisplayLabelTitle(data.type)}>
          {getLanguageVersion({
            data: data.label,
            lang: displayLang ?? i18n.language,
            appendLocale: true,
          })}
        </BasicBlock>
      )}

      <BasicBlock title={translateCommonForm('identifier', data.type, t)}>
        {data.curie}
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
            data.contact ?? ADMIN_EMAIL
          }?subject=${getLanguageVersion({
            data: data.label,
            lang: displayLang ?? i18n.language,
          })}`}
          labelNewWindow={t('link-opens-new-window-external')}
        >
          {translateCommonForm('contact', data.type, t)}
        </ExternalLink>
      </BasicBlock>
    </>
  );
}
