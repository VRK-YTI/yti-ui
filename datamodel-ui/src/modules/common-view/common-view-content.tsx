import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateCommonForm } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { Button, ExternalLink, IconCopy, Link } from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import FormattedDate from 'yti-common-ui/formatted-date';
import Separator from 'yti-common-ui/separator';
import ConceptView from '../concept-view';
import HasPermission from '@app/common/utils/has-permission';

export default function CommonViewContent({
  modelId,
  data,
}: {
  modelId: string;
  data: Resource;
}) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({
    actions: ['ADMIN_ASSOCIATION', 'ADMIN_ATTRIBUTE'],
  });

  return (
    <>
      <BasicBlock title={translateCommonForm('identifier', data.type, t)}>
        {`${modelId}:${data.identifier}`}
        <Button
          icon={<IconCopy />}
          variant="secondary"
          style={{ width: 'max-content' }}
          onClick={() =>
            navigator.clipboard.writeText(`${modelId}:${data.identifier}`)
          }
        >
          {t('copy-to-clipboard')}
        </Button>
      </BasicBlock>

      <BasicBlock title={t('concept')}>
        <ConceptView data={data.subject} />
      </BasicBlock>

      {data.type === ResourceType.ATTRIBUTE && (
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
        }) || t('no-note')}
      </BasicBlock>

      <Separator />

      <BasicBlock title="Viittaukset muista komponenteista">
        Ei viittauksia
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
