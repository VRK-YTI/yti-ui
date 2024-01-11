import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  translateCommonForm,
  translateCommonTooltips,
} from '@app/common/utils/translation-helpers';
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
import { useGetAllCodesQuery } from '@app/common/components/code/code.slice';
import UriList from '@app/common/components/uri-list';
import UriInfo, { getEnvParam } from '@app/common/components/uri-info';
import ClassModal from '../class-modal';
import { InternalClassInfo } from '@app/common/interfaces/internal-class.interface';
import { default as NextLink } from 'next/link';
import { UriData } from '@app/common/interfaces/uri.interface';

export default function CommonViewContent({
  modelId,
  inUse,
  data,
  displayLabel,
  applicationProfile,
  disableAssocTarget = false,
  renderActions,
  handleChangeTarget,
  targetInClassRestriction,
}: {
  modelId: string;
  inUse?: boolean;
  data: Resource;
  displayLabel?: boolean;
  applicationProfile?: boolean;
  disableAssocTarget?: boolean;
  renderActions?: () => void;
  handleChangeTarget?: (value?: InternalClassInfo) => void;
  targetInClassRestriction?: UriData;
}) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({
    actions: ['EDIT_ASSOCIATION', 'EDIT_ATTRIBUTE'],
  });
  const displayLang = useSelector(selectDisplayLang());
  const { data: codesResult } = useGetAllCodesQuery(
    data.codeLists?.map((codelist) => codelist) ?? [],
    {
      skip:
        !applicationProfile || !data.codeLists || data.codeLists.length === 0,
    }
  );

  function getCodeListLabel(uri: string) {
    if (!codesResult) {
      return uri;
    }

    const prefLabel = codesResult.find((code) => code.uri === uri)?.prefLabel;

    return prefLabel
      ? getLanguageVersion({ data: prefLabel, lang: i18n.language })
      : uri;
  }

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
              <BasicBlock
                title={t('target-association', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.target-association'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                <UriInfo uri={data.path} lang={displayLang} />
              </BasicBlock>

              <BasicBlock
                title={t('association-targets-class')}
                tooltip={{
                  text: t('tooltip.association-targets-class'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                <UriInfo uri={data.classType} lang={displayLang} />
              </BasicBlock>

              <BasicBlock
                title={t('minimum-count')}
                tooltip={{
                  text: t('tooltip.minimum-amount'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.minCount ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('maximum-count')}
                tooltip={{
                  text: t('tooltip.minimum-amount'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.maxCount ?? t('not-defined')}
              </BasicBlock>
            </>
          ) : (
            <>
              <BasicBlock
                title={t('target-attribute', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.target-attribute'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                <UriInfo uri={data.path} lang={displayLang} />
              </BasicBlock>
              <BasicBlock
                title={t('data-type')}
                tooltip={{
                  text: t('tooltip.data-type'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.dataType?.curie ?? t('not-defined')}
              </BasicBlock>
              <Separator />
              <div>
                <Text variant="bold">{t('restrictions')}</Text>
              </div>

              <BasicBlock title={t('codelist', { ns: 'admin' })}>
                {data.codeLists && data.codeLists?.length > 0
                  ? data.codeLists.map((codeList) => (
                      <Link
                        key={codeList}
                        href={`${codeList}${getEnvParam(codeList, true)}`}
                      >
                        {codeList.split('/').slice(-2).join(':')}
                      </Link>
                    ))
                  : t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('allowed-values', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.allowed-values'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.allowedValues && data.allowedValues.length > 0 ? (
                  <ul
                    style={{ padding: '0', margin: '0', paddingLeft: '20px' }}
                  >
                    {data.allowedValues.map((value) => (
                      <li key={value}>{getCodeListLabel(value)}</li>
                    ))}
                  </ul>
                ) : (
                  t('not-defined')
                )}
              </BasicBlock>

              <BasicBlock
                title={t('default-value', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.default-value'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.defaultValue
                  ? getCodeListLabel(data.defaultValue)
                  : t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('required-value', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.required-value'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.hasValue
                  ? getCodeListLabel(data.hasValue)
                  : t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('minimum-length', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.minimum-length'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.minLength ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('maximum-length', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.maximum-length'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.maxLength ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('minimum-count')}
                tooltip={{
                  text: t('tooltip.minimum-amount'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.minCount ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('maximum-count')}
                tooltip={{
                  text: t('tooltip.maximum-amount'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.maxCount ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('larger-or-as-large-as', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.larger-or-as-large-as', { ns: 'common' }),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.minInclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('smaller-or-as-small-as', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.smaller-or-as-small-as', { ns: 'common' }),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.maxInclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('larger-than', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.larger-than', { ns: 'common' }),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.minExclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('smaller-than', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.smaller-than', { ns: 'common' }),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.maxExclusive ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('string-attribute-format', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.string-attribute-format'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.pattern ?? t('not-defined')}
              </BasicBlock>

              <BasicBlock
                title={t('string-attribute-languages', { ns: 'admin' })}
                tooltip={{
                  text: t('tooltip.string-attribute-languages'),
                  ariaCloseButtonLabelText: '',
                  ariaToggleButtonLabelText: '',
                }}
              >
                {data.languageIn
                  ? data.languageIn.join(', ')
                  : t('not-defined')}
              </BasicBlock>

              <Separator />
            </>
          )}
        </>
      );
    }

    return (
      <>
        {data.type === ResourceType.ATTRIBUTE && (
          <>
            <BasicBlock
              title={t('data-type')}
              tooltip={{
                text: t('tooltip.data-type'),
                ariaCloseButtonLabelText: '',
                ariaToggleButtonLabelText: '',
              }}
            >
              <UriInfo
                uri={data.range}
                lang={displayLang}
                notDefinedText={t('no-datatype')}
                showPlainText={true}
              />
            </BasicBlock>

            <BasicBlock
              title={`${t('class')} (rdfs:domain)`}
              tooltip={{
                text: t('tooltip.class'),
                ariaCloseButtonLabelText: '',
                ariaToggleButtonLabelText: '',
              }}
            >
              <UriInfo
                uri={data.domain}
                lang={displayLang}
                notDefinedText={t('no-domain')}
              />
            </BasicBlock>
          </>
        )}

        {data.type === ResourceType.ASSOCIATION && (
          <>
            <BasicBlock
              title={t('associations-source', { ns: 'admin' })}
              tooltip={{
                text: t('tooltip.associations-source'),
                ariaToggleButtonLabelText: '',
                ariaCloseButtonLabelText: '',
              }}
            >
              <UriInfo
                uri={data.domain}
                lang={displayLang}
                notDefinedText={t('no-source-class')}
              />
            </BasicBlock>

            <BasicBlock
              title={t('associations-target', { ns: 'admin' })}
              tooltip={{
                text: t('tooltip.associations-target'),
                ariaToggleButtonLabelText: '',
                ariaCloseButtonLabelText: '',
              }}
            >
              <UriInfo
                uri={data.range}
                lang={displayLang}
                notDefinedText={t('no-target-class')}
              />
            </BasicBlock>
          </>
        )}

        <BasicBlock
          title={translateCommonForm('upper', data.type, t)}
          tooltip={{
            text: translateCommonTooltips('upper', data.type, t),
            ariaToggleButtonLabelText: '',
            ariaCloseButtonLabelText: '',
          }}
        >
          {!data.subResourceOf || data.subResourceOf.length === 0 ? (
            <>{translateCommonForm('no-upper', data.type, t)}</>
          ) : (
            <UriList items={data.subResourceOf} lang={displayLang} />
          )}
        </BasicBlock>

        <BasicBlock
          title={translateCommonForm('equivalent', data.type, t)}
          tooltip={{
            text: translateCommonTooltips('equivalent', data.type, t),
            ariaToggleButtonLabelText: '',
            ariaCloseButtonLabelText: '',
          }}
        >
          {!data.equivalentResource || data.equivalentResource.length === 0 ? (
            <>{translateCommonForm('no-equivalent', data.type, t)}</>
          ) : (
            <UriList items={data.equivalentResource} lang={displayLang} />
          )}
        </BasicBlock>

        {!applicationProfile && (
          <>
            <BasicBlock
              title={translateCommonForm('functional', data.type, t)}
              tooltip={{
                text: translateCommonTooltips('functional', data.type, t),
                ariaCloseButtonLabelText: '',
                ariaToggleButtonLabelText: '',
              }}
            >
              {data.functionalProperty ? t('yes') : t('no')}
            </BasicBlock>

            {data.type === ResourceType.ASSOCIATION && (
              <>
                <BasicBlock
                  title={translateCommonForm('transitive', data.type, t)}
                  tooltip={{
                    text: translateCommonTooltips('transitive', data.type, t),
                    ariaCloseButtonLabelText: '',
                    ariaToggleButtonLabelText: '',
                  }}
                >
                  {data.transitiveProperty ? t('yes') : t('no')}
                </BasicBlock>
                <BasicBlock
                  title={translateCommonForm('reflexive', data.type, t)}
                  tooltip={{
                    text: translateCommonTooltips('reflexive', data.type, t),
                    ariaCloseButtonLabelText: '',
                    ariaToggleButtonLabelText: '',
                  }}
                >
                  {data.reflexiveProperty ? t('yes') : t('no')}
                </BasicBlock>
              </>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <>
      {applicationProfile && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <BasicBlock
            title={t('in-use-in-this-model', { ns: 'admin' })}
            tooltip={{
              text: t('tooltip.in-use-in-this-model'),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
          >
            {inUse
              ? t('in-use', { ns: 'admin' })
              : t('not-in-use', { ns: 'admin' })}
          </BasicBlock>
          {renderActions && renderActions()}
        </div>
      )}

      {!applicationProfile &&
        renderActions &&
        data.type === ResourceType.ASSOCIATION && (
          <>
            {renderActions()}
            <Separator />
          </>
        )}

      {!disableAssocTarget &&
        !applicationProfile &&
        data.type === ResourceType.ASSOCIATION &&
        handleChangeTarget && (
          <>
            <BasicBlock
              title={t('association-target-in-this-class', { ns: 'admin' })}
              largeGap
              extra={
                <div
                  style={{
                    width: 'max-content',
                  }}
                >
                  <ClassModal
                    modalButtonLabel={t('choose-association-target', {
                      ns: 'admin',
                    })}
                    mode="select"
                    handleFollowUp={handleChangeTarget}
                    modelId={modelId}
                    applicationProfile={applicationProfile}
                  />
                </div>
              }
            >
              {targetInClassRestriction && (
                <NextLink
                  href={`${targetInClassRestriction.uri}${getEnvParam(
                    targetInClassRestriction.uri,
                    true
                  )}`}
                  passHref
                  legacyBehavior
                >
                  <Link href="">
                    {getLanguageVersion({
                      data: targetInClassRestriction.label,
                      lang: displayLang ?? i18n.language,
                      appendLocale: true,
                    })}
                    <br />({targetInClassRestriction.curie})
                  </Link>
                </NextLink>
              )}
            </BasicBlock>
            <Separator />
          </>
        )}

      {displayLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <BasicBlock title={getDisplayLabelTitle(data.type)}>
            {getLanguageVersion({
              data: data.label,
              lang: displayLang ?? i18n.language,
              appendLocale: true,
            })}
          </BasicBlock>
          {!applicationProfile &&
            renderActions &&
            data.type === ResourceType.ATTRIBUTE &&
            renderActions()}
        </div>
      )}

      <BasicBlock
        title={translateCommonForm('identifier', data.type, t)}
        tooltip={{
          text: translateCommonTooltips('identifier', data.type, t),
          ariaCloseButtonLabelText: '',
          ariaToggleButtonLabelText: '',
        }}
      >
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

      <BasicBlock
        title={translateCommonForm('note', data.type, t)}
        tooltip={{
          text: t('tooltip.technical-description'),
          ariaCloseButtonLabelText: '',
          ariaToggleButtonLabelText: '',
        }}
      >
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
