import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import HasPermission from '@app/common/utils/has-permission';
import {
  translateCommonForm,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  ActionMenu,
  ActionMenuDivider,
  ActionMenuItem,
  Button,
  IconArrowLeft,
  InlineAlert,
  Text,
} from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DeleteModal from '@app/modules/delete-modal';
import CommonViewContent from '@app/modules/common-view-content';
import { StatusChip } from 'yti-common-ui/components/status-chip';
import { useGetAwayListener } from '@app/common/utils/hooks/use-get-away-listener';
import LocalCopyModal from '@app/modules/local-copy-modal';
import { useSelector } from 'react-redux';
import {
  selectDisplayGraphHasChanges,
  selectDisplayLang,
  selectGraphHasChanges,
  setDisplayGraphHasChanges,
} from '@app/common/components/model/model.slice';
import ApplicationProfileTop from '../resource-form/components/application-profile-top';
import { useTogglePropertyShapeMutation } from '@app/common/components/resource/resource.slice';
import getApiError from '@app/common/utils/get-api-errors';
import { RenameModal } from '@app/modules/rename-modal';
import { useStoreDispatch } from '@app/store';
import UnsavedAlertModal from '@app/modules/unsaved-alert-modal';

interface CommonViewProps {
  data?: Resource;
  inUse?: boolean;
  modelId: string;
  handleReturn: () => void;
  handleShowResource: (id: string, modelPrefix: string) => void;
  handleEdit: () => void;
  handleRefetch: () => void;
  isPartOfCurrentModel: boolean;
  applicationProfile?: boolean;
  currentModelId?: string;
  disableEdit?: boolean;
  organizationIds?: string[];
}

export default function ResourceInfo({
  data,
  inUse,
  modelId,
  handleReturn,
  handleShowResource,
  handleEdit,
  handleRefetch,
  isPartOfCurrentModel,
  applicationProfile,
  currentModelId,
  disableEdit,
  organizationIds,
}: CommonViewProps) {
  const { t, i18n } = useTranslation('common');
  const displayLang = useSelector(selectDisplayLang());
  const hasPermission = HasPermission({
    actions: ['EDIT_ASSOCIATION', 'EDIT_ATTRIBUTE'],
    targetOrganization: organizationIds,
  });
  const dispatch = useStoreDispatch();
  const displayGraphHasChanges = useSelector(selectDisplayGraphHasChanges());
  const graphHasChanges = useSelector(selectGraphHasChanges());
  const [headerHeight, setHeaderHeight] = useState(hasPermission ? 117 : 55);
  const [showTooltip, setShowTooltip] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [localCopyVisible, setLocalCopyVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [externalEdit, setExternalEdit] = useState(false);
  const [externalActive, setExternalActive] = useState(inUse);
  const [togglePropertyShape, toggleResult] = useTogglePropertyShapeMutation();
  const { ref: toolTipRef } = useGetAwayListener(showTooltip, setShowTooltip);

  const handleExternalEditSave = () => {
    if (externalActive !== inUse) {
      togglePropertyShape({
        modelId: currentModelId ?? '',
        uri: data?.uri ?? '',
      });
    }
  };

  const handleIsEdit = () => {
    if (graphHasChanges) {
      dispatch(setDisplayGraphHasChanges(true));
      return;
    }

    handleEdit();
  };

  useEffect(() => {
    setExternalActive(inUse);
  }, [inUse]);

  useEffect(() => {
    if (toggleResult.isSuccess) {
      handleRefetch();
    }
  }, [toggleResult, handleRefetch]);

  return (
    <>
      <StaticHeader
        ref={(node) => {
          setHeaderHeight(node?.clientHeight ?? 50);
        }}
      >
        <div>
          <Button
            variant="secondaryNoBorder"
            icon={<IconArrowLeft />}
            style={{ textTransform: 'uppercase' }}
            onClick={handleReturn}
            ref={toolTipRef}
            id="back-button"
          >
            {data ? translateCommonForm('return', data.type, t) : t('back')}
          </Button>
          {!disableEdit && hasPermission && data && !externalEdit && (
            <div>
              <ActionMenu id="action-menu" buttonText={t('actions')}>
                {isPartOfCurrentModel
                  ? [
                      <ActionMenuItem
                        key="edit-button"
                        onClick={() => handleIsEdit()}
                      >
                        {t('edit', { ns: 'admin' })}
                      </ActionMenuItem>,
                      <ActionMenuItem
                        key="rename-button"
                        onClick={() => setRenameVisible(true)}
                      >
                        {t('rename', { ns: 'admin' })}
                      </ActionMenuItem>,
                      <ActionMenuDivider key="separator" />,
                      <ActionMenuItem
                        key="remove-button"
                        onClick={() => setDeleteVisible(true)}
                      >
                        {t('remove', { ns: 'admin' })}
                      </ActionMenuItem>,
                    ]
                  : applicationProfile
                  ? [
                      <ActionMenuItem
                        key="external-edit-button"
                        onClick={() => {
                          setExternalActive(inUse);
                          setExternalEdit(true);
                        }}
                      >
                        {t('edit', { ns: 'admin' })}
                      </ActionMenuItem>,
                      <ActionMenuItem
                        key="create-local-copy-button"
                        onClick={() => setLocalCopyVisible(true)}
                      >
                        {t('create-local-copy', { ns: 'admin' })}
                      </ActionMenuItem>,
                    ]
                  : []}
              </ActionMenu>

              <LocalCopyModal
                visible={localCopyVisible}
                hide={() => setLocalCopyVisible(false)}
                targetModelId={currentModelId ?? ''}
                sourceModelId={modelId}
                sourceIdentifier={data.identifier}
                handleReturn={handleShowResource}
              />
              <DeleteModal
                modelId={modelId}
                resourceId={data.identifier}
                type={data.type === 'ASSOCIATION' ? 'association' : 'attribute'}
                label={getLanguageVersion({
                  data: data.label,
                  lang: i18n.language,
                })}
                onClose={handleReturn}
                visible={deleteVisible}
                hide={() => setDeleteVisible(false)}
              />
              <RenameModal
                modelId={modelId}
                resourceId={data.identifier}
                visible={renameVisible}
                hide={() => setRenameVisible(false)}
                handleReturn={handleShowResource}
              />
              <UnsavedAlertModal
                visible={displayGraphHasChanges}
                handleFollowUp={() => handleEdit()}
              />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!externalEdit ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text variant="bold">
                {data &&
                  getLanguageVersion({
                    data: data.label,
                    lang: displayLang ?? i18n.language,
                  })}
              </Text>
              <StatusChip status={data?.status}>
                {data && translateStatus(data.status, t)}
              </StatusChip>
            </div>
          ) : (
            <>
              <Text variant="bold">
                {data &&
                  getLanguageVersion({
                    data: data.label,
                    lang: displayLang ?? i18n.language,
                  })}
              </Text>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Button onClick={handleExternalEditSave} id="submit-button">
                  {t('save', { ns: 'admin' })}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setExternalEdit(false)}
                  id="cancel-button"
                >
                  {t('cancel-variant', { ns: 'admin' })}
                </Button>
              </div>
            </>
          )}
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        {data && (
          <>
            {externalEdit && (
              <>
                {toggleResult.error && (
                  <InlineAlert status="error">
                    {getApiError(toggleResult.error)[0]}
                  </InlineAlert>
                )}
                <ApplicationProfileTop
                  inUse={externalActive === undefined ? true : externalActive}
                  setInUse={setExternalActive}
                  type={data.type}
                  applicationProfile={applicationProfile}
                  external
                />
              </>
            )}

            <CommonViewContent
              applicationProfile={applicationProfile}
              modelId={modelId}
              data={data}
              inUse={inUse}
            />
          </>
        )}
      </DrawerContent>
    </>
  );
}
