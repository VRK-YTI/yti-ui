import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateCommonForm } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import {
  Button,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  Link,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import FormattedDate from 'yti-common-ui/formatted-date';
import Separator from 'yti-common-ui/separator';

export default function CommonViewContent({
  modelId,
  data,
  type,
  displayLabel,
}: {
  modelId: string;
  data: Resource;
  type: ResourceType;
  displayLabel?: boolean;
}) {
  const { t, i18n } = useTranslation('common');

  return (
    <>
      {displayLabel && (
        <BasicBlock title={`${type} nimi`}>
          {getLanguageVersion({
            data: data.label,
            lang: i18n.language,
            appendLocale: true,
          })}
        </BasicBlock>
      )}

      <BasicBlock title={t('concept')}>
        <ExpanderGroup
          closeAllText=""
          openAllText=""
          showToggleAllButton={false}
        >
          <Expander>
            <ExpanderTitleButton>Käsitteen määritelmä</ExpanderTitleButton>
          </Expander>
        </ExpanderGroup>
      </BasicBlock>

      <BasicBlock title={translateCommonForm('identifier', data.type, t)}>
        {`${modelId}:${data.identifier}`}
        <Button
          icon="copy"
          variant="secondary"
          style={{ width: 'min-content', whiteSpace: 'nowrap' }}
          onClick={() => navigator.clipboard.writeText(data.identifier)}
        >
          {t('copy-to-clipboard')}
        </Button>
      </BasicBlock>

      {type === ResourceType.ATTRIBUTE && (
        <>
          <BasicBlock title={t('range', { ns: 'admin' })}>
            {t('literal', { ns: 'admin' })} (rdfs:Literal)
          </BasicBlock>

          <BasicBlock title={`${t('class', { ns: 'admin' })} (rdfs:domain)`}>
            {data.domain
              ? (data.domain as string).split('/').pop()?.replace('#', ':')
              : t('no-upper-attributes')}
          </BasicBlock>
        </>
      )}

      {type === ResourceType.ASSOCIATION && (
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
        }) || t('no-note')}
      </BasicBlock>

      <Separator />

      <BasicBlock title="Viittaukset muista komponenteista">
        Ei viittauksia
      </BasicBlock>

      <Separator />

      <BasicBlock title={t('created')}>
        <FormattedDate date={data.created} />
      </BasicBlock>

      <BasicBlock title={t('modified-at')}>
        <FormattedDate date={data.created} />
      </BasicBlock>

      <BasicBlock title={t('editorial-note')}>
        {data.editorialNote ?? t('no-editorial-note')}
      </BasicBlock>

      <BasicBlock title={t('uri')}>{data.uri}</BasicBlock>
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
          labelNewWindow=""
        >
          {translateCommonForm('contact', data.type, t)}
        </ExternalLink>
      </BasicBlock>
    </>
  );
}
