import { StatusChip } from 'yti-common-ui/components/status-chip';
import { ClassType } from '@app/common/interfaces/class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  ExpanderGroup,
  ExternalLink,
  IconArrowLeft,
  IconCopy,
  Text,
  InlineAlert,
  ActionMenu,
  ActionMenuItem,
  ActionMenuDivider,
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
import HasPermission from '@app/common/utils/has-permission';
import DeleteModal from '../delete-modal';
import { useSelector } from 'react-redux';
import {
  selectAddResourceRestrictionToClass,
  selectDisplayGraphHasChanges,
  selectDisplayLang,
  selectGraphHasChanges,
  selectUpdateClassData,
  setAddResourceRestrictionToClass,
  setDisplayGraphHasChanges,
  setUpdateClassData,
} from '@app/common/components/model/model.slice';
import { ADMIN_EMAIL, SUOMI_FI_NAMESPACE } from '@app/common/utils/get-value';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import ResourceModal from './resource-modal';
import { useAddPropertyReferenceMutation } from '@app/common/components/class/class.slice';
import ResourceForm from '../resource/resource-form';
import { initializeResource } from '@app/common/components/resource/resource.slice';
import { useStoreDispatch } from '@app/store';
import UriList from '@app/common/components/uri-list';
import UriInfo from '@app/common/components/uri-info';
import { UriData } from '@app/common/interfaces/uri.interface';
import { RenameModal } from '../rename-modal';
import getApiError from '@app/common/utils/get-api-errors';
import {
  translatePageTitle,
  translateResourceAddition,
} from '@app/common/utils/translation-helpers';
import UnsavedAlertModal from '../unsaved-alert-modal';

interface ClassInfoProps {
  data?: ClassType;
  modelId: string;
  applicationProfile?: boolean;
  languages: string[];
  terminologies: string[];
  handleReturn: () => void;
  handleEdit: () => void;
  handleShowClass: (classId: string) => void;
  disableEdit?: boolean;
  organizationIds?: string[];
}

export default function ClassInfo({
  data,
  modelId,
  applicationProfile,
  languages,
  terminologies,
  handleReturn,
  handleEdit,
  handleShowClass,
  disableEdit,
  organizationIds,
}: ClassInfoProps) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({
    actions: ['EDIT_CLASS'],
    targetOrganization: organizationIds,
  });
  const [headerHeight, setHeaderHeight] = useState(hasPermission ? 57 : 55);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const dispatch = useStoreDispatch();
  const updateClassData = useSelector(selectUpdateClassData());
  const displayGraphHasChanges = useSelector(selectDisplayGraphHasChanges());
  const graphHasChanges = useSelector(selectGraphHasChanges());
  const renderResourceForm = useSelector(selectAddResourceRestrictionToClass());
  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [associationModalVisible, setAssociationModalVisible] = useState(false);
  const displayLang = useSelector(selectDisplayLang());
  const [addReference, addReferenceResult] = useAddPropertyReferenceMutation();

  useEffect(() => {
    if (updateClassData) {
      dispatch(setUpdateClassData(false));
    }
  }, [dispatch, updateClassData]);

  const handleFollowUp = (value: {
    uriData: UriData;
    type: ResourceType;
    mode: 'select' | 'create';
  }) => {
    if (!data) {
      return;
    }

    if (value.mode === 'select') {
      addReference({
        prefix: modelId,
        identifier: data.identifier,
        uri: value.uriData.uri,
        applicationProfile: applicationProfile ?? false,
      });
    } else {
      dispatch(initializeResource(value.type, value.uriData, true));
      dispatch(setAddResourceRestrictionToClass(true));
    }
  };

  const handleIsEdit = () => {
    if (graphHasChanges) {
      dispatch(setDisplayGraphHasChanges(true));
      return;
    }

    handleEdit();
  };

  function renderTopInfoByType() {
    if (!data) {
      return <></>;
    }

    if (applicationProfile) {
      return (
        <>
          <BasicBlock
            title={t('targets-library-class')}
            tooltip={{
              text: t('tooltip.target-class-profile'),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
          >
            <UriInfo uri={data.targetClass} lang={displayLang} />
          </BasicBlock>

          <BasicBlock
            title={t('utilizes-class-restriction')}
            tooltip={{
              text: t('tooltip.utilizes-class-restriction'),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
          >
            <UriInfo uri={data.targetNode} lang={displayLang} />
          </BasicBlock>
        </>
      );
    }

    return (
      <>
        <BasicBlock
          title={t('upper-class')}
          tooltip={{
            text: t('tooltip.upper-classes'),
            ariaCloseButtonLabelText: '',
            ariaToggleButtonLabelText: '',
          }}
        >
          {!data.subClassOf || data.subClassOf.length === 0 ? (
            <> {t('no-upper-classes')}</>
          ) : (
            <UriList items={data.subClassOf} lang={displayLang} />
          )}
        </BasicBlock>

        <BasicBlock
          title={t('equivalent-classes')}
          tooltip={{
            text: t('tooltip.equivalent-classes'),
            ariaCloseButtonLabelText: '',
            ariaToggleButtonLabelText: '',
          }}
        >
          {!data.equivalentClass || data.equivalentClass.length === 0 ? (
            <> {t('no-equivalent-classes')}</>
          ) : (
            <UriList items={data.equivalentClass} lang={displayLang} />
          )}
        </BasicBlock>

        <BasicBlock
          title={t('disjoint-classes')}
          tooltip={{
            text: t('tooltip.disjoint-classes'),
            ariaCloseButtonLabelText: '',
            ariaToggleButtonLabelText: '',
          }}
        >
          {!data.disjointWith || data.disjointWith.length === 0 ? (
            <>{t('no-disjoint-classes')}</>
          ) : (
            <UriList items={data.disjointWith} lang={displayLang} />
          )}
        </BasicBlock>
      </>
    );
  }

  if (renderResourceForm) {
    return (
      <ResourceForm
        modelId={modelId}
        languages={languages}
        terminologies={terminologies}
        handleReturn={() => dispatch(setAddResourceRestrictionToClass(false))}
        handleFollowUp={(identifier, type) => {
          dispatch(setAddResourceRestrictionToClass(false));
          handleFollowUp({
            uriData: {
              uri: `${SUOMI_FI_NAMESPACE}${modelId}/${identifier}`,
              curie: `${modelId}:${identifier}`,
              label: {},
            },
            type: type,
            mode: 'select',
          });
        }}
        applicationProfile
        currentModelId={modelId}
      />
    );
  }

  return (
    <>
      <StaticHeader
        ref={(node) => {
          setHeaderHeight(node?.clientHeight ?? 50);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="secondaryNoBorder"
            icon={<IconArrowLeft />}
            onClick={() => handleReturn()}
            style={{ textTransform: 'uppercase' }}
          >
            {translatePageTitle(
              'return-to-list',
              ResourceType.CLASS,
              t,
              applicationProfile
            )}
          </Button>
          {!disableEdit && hasPermission && data && (
            <ActionMenu buttonText={t('actions')} id="actions-menu">
              <ActionMenuItem onClick={() => handleIsEdit()}>
                {t('edit', { ns: 'admin' })}
              </ActionMenuItem>
              <ActionMenuItem onClick={() => setShowRenameModal(true)}>
                {t('rename', { ns: 'admin' })}
              </ActionMenuItem>
              <ActionMenuDivider />
              <ActionMenuItem onClick={() => setShowDeleteModal(true)}>
                {t('remove', { ns: 'admin' })}
              </ActionMenuItem>
            </ActionMenu>
          )}
        </div>
        {data ? (
          <div>
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
            <RenameModal
              modelId={modelId}
              resourceId={data.identifier}
              visible={showRenameModal}
              hide={() => setShowRenameModal(false)}
              handleReturn={handleShowClass}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text variant="bold">
                {getLanguageVersion({
                  data: data.label,
                  lang: displayLang ?? i18n.language,
                })}
              </Text>
              <StatusChip status={data.status}>
                {translateStatus(data.status, t)}
              </StatusChip>
            </div>
          </div>
        ) : (
          <></>
        )}

        <UnsavedAlertModal
          visible={displayGraphHasChanges}
          handleFollowUp={() => handleEdit()}
        />
      </StaticHeader>

      {data && (
        <DrawerContent height={headerHeight}>
          {addReferenceResult.error ? (
            <InlineAlert status="error">
              {getApiError(addReferenceResult.error)[0]}
            </InlineAlert>
          ) : (
            <></>
          )}
          <BasicBlock
            title={t('class-identifier')}
            tooltip={{
              text: t('tooltip.class-identifier'),
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
              id="copy-uri-button"
            >
              {t('copy-to-clipboard')}
            </Button>
          </BasicBlock>

          <BasicBlock title={t('concept')}>
            <ConceptView data={data.subject} />
          </BasicBlock>

          {renderTopInfoByType()}

          <BasicBlock
            title={t('technical-description')}
            tooltip={{
              text: t('tooltip.technical-description'),
              ariaCloseButtonLabelText: '',
              ariaToggleButtonLabelText: '',
            }}
          >
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
                {data.attribute.map((attr, idx) => (
                  <ResourceInfo
                    key={`${data.identifier}-attr-${attr.identifier}-${idx}`}
                    data={attr}
                    modelId={modelId}
                    classId={data.identifier}
                    hasPermission={hasPermission}
                    applicationProfile={applicationProfile}
                    attribute
                    disableEdit={disableEdit}
                  />
                ))}
              </ExpanderGroup>
            ) : (
              t('no-attributes')
            )}
          </BasicBlock>

          {!disableEdit && hasPermission ? (
            <div style={{ marginTop: '10px' }}>
              <Button
                variant="secondary"
                onClick={() => setAttributeModalVisible(true)}
                id="add-attribute-button"
              >
                {translateResourceAddition(
                  ResourceType.ATTRIBUTE,
                  t,
                  applicationProfile
                )}
              </Button>
              <ResourceModal
                modelId={modelId}
                type={ResourceType.ATTRIBUTE}
                handleFollowUp={handleFollowUp}
                limitSearchTo={'LIBRARY'}
                visible={attributeModalVisible}
                setVisible={setAttributeModalVisible}
                applicationProfile={applicationProfile}
                limitToSelect={!applicationProfile}
                hiddenResources={data.attribute?.map((attr) => attr.uri)}
              />
            </div>
          ) : (
            <></>
          )}

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
                    key={`${data.identifier}-attr-${assoc.identifier}-${assoc.range?.curie}`}
                    data={assoc}
                    modelId={modelId}
                    classId={data.identifier}
                    hasPermission={hasPermission}
                    applicationProfile={applicationProfile}
                    disableEdit={disableEdit}
                    targetInClassRestriction={assoc.range}
                  />
                ))}
              </ExpanderGroup>
            ) : (
              t('no-assocations')
            )}
          </BasicBlock>

          {!disableEdit && hasPermission ? (
            <div style={{ marginTop: '10px' }}>
              <Button
                variant="secondary"
                onClick={() => setAssociationModalVisible(true)}
                id="add-association-button"
              >
                {translateResourceAddition(
                  ResourceType.ASSOCIATION,
                  t,
                  applicationProfile
                )}
              </Button>
              <ResourceModal
                modelId={modelId}
                type={ResourceType.ASSOCIATION}
                limitSearchTo="LIBRARY"
                visible={associationModalVisible}
                setVisible={setAssociationModalVisible}
                handleFollowUp={handleFollowUp}
                applicationProfile={applicationProfile}
                limitToSelect={!applicationProfile}
                hiddenResources={data.association?.map((assoc) => assoc.uri)}
              />
            </div>
          ) : (
            <></>
          )}
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
