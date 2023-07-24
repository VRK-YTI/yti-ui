import { StatusChip } from '@app/common/components/resource-list/resource-list.styles';
import { ClassType } from '@app/common/interfaces/class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  ExpanderGroup,
  ExternalLink,
  IconArrowLeft,
  IconCopy,
  IconMenu,
  Link,
  Text,
  Tooltip,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import FormattedDate from 'yti-common-ui/formatted-date';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import Separator from 'yti-common-ui/separator';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import ConceptView from '../concept-view';
import ResourceInfo from './resource-info';
import { TooltipWrapper } from '../model/model.styles';
import { useGetAwayListener } from '@app/common/utils/hooks/use-get-away-listener';
import HasPermission from '@app/common/utils/has-permission';
import DeleteModal from '../delete-modal';
import { useSelector } from 'react-redux';
import { selectDisplayLang } from '@app/common/components/model/model.slice';
import { ADMIN_EMAIL } from '@app/common/utils/get-value';

interface ClassInfoProps {
  data?: ClassType;
  modelId: string;
  applicationProfile?: boolean;
  handleReturn: () => void;
  handleEdit: () => void;
  handleRefecth: () => void;
}

export default function ClassInfo({
  data,
  modelId,
  applicationProfile,
  handleReturn,
  handleEdit,
  handleRefecth,
}: ClassInfoProps) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({ actions: ['ADMIN_CLASS'] });
  const ref = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const displayLang = useSelector(selectDisplayLang());
  const { ref: toolTipRef } = useGetAwayListener(showTooltip, setShowTooltip);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [data]);

  function renderTopInfoByType() {
    if (!data) {
      return <></>;
    }

    if (applicationProfile) {
      return (
        <>
          <BasicBlock title={t('targets-library-class')}>
            {data.targetClass ? (
              <ExternalLink
                key={data.targetClass.uri}
                href={data.targetClass.uri}
                style={{ fontSize: '16px' }}
                labelNewWindow={t('link-opens-new-window-external')}
              >
                {data.targetClass.curie}
              </ExternalLink>
            ) : (
              <Text smallScreen>{t('not-defined')}</Text>
            )}
          </BasicBlock>

          <BasicBlock title={t('utilizes-class-restriction')}>
            {data.targetNode ? (
              <ExternalLink
                key={data.targetNode.uri}
                href={data.targetNode.uri}
                style={{ fontSize: '16px' }}
                labelNewWindow={t('link-opens-new-window-external')}
              >
                {data.targetNode.curie}
              </ExternalLink>
            ) : (
              <Text smallScreen>{t('not-defined')}</Text>
            )}
          </BasicBlock>
        </>
      );
    }

    return (
      <>
        <BasicBlock title={t('upper-class')}>
          {!data.subClassOf || data.subClassOf.length === 0 ? (
            <> {t('no-upper-classes')}</>
          ) : (
            <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
              {data.subClassOf.map((c) => (
                <li key={c.uri}>
                  <Link key={c.uri} href={c.uri} style={{ fontSize: '16px' }}>
                    {c.curie}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BasicBlock>

        <BasicBlock title={t('equivalent-classes')}>
          {!data.equivalentClass || data.equivalentClass.length === 0 ? (
            <> {t('no-equivalent-classes')}</>
          ) : (
            <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
              {data.equivalentClass.map((c) => (
                <li key={c.uri}>
                  <Link key={c.uri} href={c.uri} style={{ fontSize: '16px' }}>
                    {c.curie}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BasicBlock>

        <BasicBlock title={t('disjoint-classes')}>
          {t('no-disjoint-classes')}
        </BasicBlock>

        <BasicBlock title={t('technical-description')}>
          {getLanguageVersion({
            data: data.note,
            lang: displayLang ?? i18n.language,
            appendLocale: true,
          }) !== '' ? (
            <SanitizedTextContent
              text={getLanguageVersion({
                data: data.note,
                lang: displayLang ?? i18n.language,
                appendLocale: true,
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
      <StaticHeader ref={ref}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="secondaryNoBorder"
            icon={<IconArrowLeft />}
            onClick={() => handleReturn()}
            style={{ textTransform: 'uppercase' }}
          >
            {t('back')}
          </Button>
          {hasPermission && data && (
            <div>
              <Button
                variant="secondary"
                iconRight={<IconMenu />}
                onClick={() => setShowTooltip(!showTooltip)}
                ref={toolTipRef}
              >
                {t('actions')}
              </Button>
              <TooltipWrapper id="actions-tooltip">
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                  open={showTooltip}
                  onCloseButtonClick={() => setShowTooltip(false)}
                >
                  <>
                    <Button
                      variant="secondaryNoBorder"
                      onClick={() => handleEdit()}
                      id="edit-class-button"
                    >
                      {t('edit', { ns: 'admin' })}
                    </Button>
                    <Separator />
                    <Button
                      variant="secondaryNoBorder"
                      onClick={() => setShowDeleteModal(true)}
                      id="delete-class-button"
                    >
                      {t('remove', { ns: 'admin' })}
                    </Button>
                  </>
                </Tooltip>
              </TooltipWrapper>
            </div>
          )}
        </div>
        {data ? (
          <DeleteModal
            modelId={modelId}
            resourceId={data.identifier}
            type="class"
            label={getLanguageVersion({
              data: data.label,
              lang: displayLang ?? i18n.language,
            })}
            onClose={handleReturn}
            applicationProfile={applicationProfile}
            visible={showDeleteModal}
            hide={() => setShowDeleteModal(false)}
          />
        ) : (
          <></>
        )}
      </StaticHeader>

      {data && (
        <DrawerContent height={headerHeight}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Text variant="bold">
              {getLanguageVersion({
                data: data.label,
                lang: displayLang ?? i18n.language,
              })}
            </Text>
            <StatusChip $isValid={data.status === 'VALID'}>
              {translateStatus(data.status, t)}
            </StatusChip>
          </div>

          <BasicBlock title={t('class-identifier')}>{data.curie}</BasicBlock>

          <BasicBlock title={t('uri')}>
            {data.uri}
            <Button
              icon={<IconCopy />}
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(data.uri)}
              style={{ width: 'max-content' }}
              id="copy-uri-button"
            >
              {t('copy-to-clipboard')}
            </Button>
          </BasicBlock>

          <BasicBlock title={t('concept')}>
            <ConceptView data={data.subject} />
          </BasicBlock>

          {renderTopInfoByType()}

          <Separator />

          <BasicBlock
            title={t('attributes', { count: data.attribute?.length ?? 0 })}
          >
            {data.attribute && data.attribute.length > 0 ? (
              <ExpanderGroup
                closeAllText=""
                openAllText=""
                showToggleAllButton={false}
              >
                {data.attribute.map((attr) => (
                  <ResourceInfo
                    key={`${data.identifier}-attr-${attr.identifier}`}
                    data={attr}
                    modelId={modelId}
                    classId={data.identifier}
                    hasPermission={hasPermission}
                    applicationProfile={applicationProfile}
                    handlePropertyDelete={handleRefecth}
                    attribute
                  />
                ))}
              </ExpanderGroup>
            ) : (
              t('no-attributes')
            )}
          </BasicBlock>

          <BasicBlock
            title={t('associations', {
              count: data.association?.length ?? 0,
            })}
          >
            {data.association && data.association.length > 0 ? (
              <ExpanderGroup
                closeAllText=""
                openAllText=""
                showToggleAllButton={false}
              >
                {data.association.map((assoc) => (
                  <ResourceInfo
                    key={`${data.identifier}-attr-${assoc.identifier}`}
                    data={assoc}
                    modelId={modelId}
                    classId={data.identifier}
                    hasPermission={hasPermission}
                    handlePropertyDelete={handleRefecth}
                    applicationProfile={applicationProfile}
                  />
                ))}
              </ExpanderGroup>
            ) : (
              t('no-assocations')
            )}
          </BasicBlock>

          {!applicationProfile ? (
            <>
              <Separator />

              <BasicBlock title={t('references-from-other-components')}>
                {t('no-references')}
              </BasicBlock>
            </>
          ) : (
            <></>
          )}

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
              {data.editorialNote ??
                t('no-work-group-comment', { ns: 'admin' })}
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
            {t('class-contact-description')}
            <ExternalLink
              href={`mailto:${
                data.contact ?? ADMIN_EMAIL
              }?subject=${getLanguageVersion({
                data: data.label,
                lang: displayLang ?? i18n.language,
              })}`}
              labelNewWindow={t('link-opens-new-window-external')}
            >
              {t('class-contact')}
            </ExternalLink>
          </BasicBlock>
        </DrawerContent>
      )}
    </>
  );
}
