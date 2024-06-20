import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  IconCheckCircle,
  IconDisabled,
  InlineAlert,
  ActionMenu,
  ActionMenuItem,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import {
  setResource,
  useGetResourceQuery,
} from '@app/common/components/resource/resource.slice';
import CommonViewContent from '@app/modules/common-view-content';
import {
  selectDisplayLang,
  setSelected,
  setView,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { resourceToResourceFormType } from '../resource/utils';
import RemoveReferenceModal from './remove-reference-modal';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import {
  PrimaryTextWrapper,
  SecondaryTextWrapper,
} from './resource-info-styles';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import { InternalClassInfo } from '@app/common/interfaces/internal-class.interface';
import { UriData } from '@app/common/interfaces/uri.interface';
import {
  useAddCodeListMutation,
  useUpdateClassResrictionTargetMutation,
} from '@app/common/components/class/class.slice';
import getApiError from '@app/common/utils/get-api-errors';
import { useEffect, useState } from 'react';
import ResourceError from '@app/common/components/resource-error';
import { useRouter } from 'next/router';
import { getSlugAsString } from '@app/common/utils/parse-slug';
import { useSelector } from 'react-redux';
import ExternalResourceInfo from './external-resource-info';
import CodeListModal from '../code-list-modal';
import { ModelCodeList } from '@app/common/interfaces/model.interface';
import RemoveCodeListModal from './remove-code-list-modal';
import { setNotification } from '@app/common/components/notifications/notifications.slice';

interface ResourceInfoProps {
  data: SimpleResource;
  modelId: string;
  classId: string;
  hasPermission: boolean;
  applicationProfile?: boolean;
  attribute?: boolean;
  handlePropertiesUpdate?: () => void;
  disableEdit?: boolean;
  targetInClassRestriction?: UriData;
  disableAssocTarget?: boolean;
}

export default function ResourceInfo({
  data,
  modelId,
  applicationProfile,
  attribute,
  classId,
  hasPermission,
  handlePropertiesUpdate,
  disableEdit,
  targetInClassRestriction,
  disableAssocTarget,
}: ResourceInfoProps) {
  const { t, i18n } = useTranslation('common');
  const displayLang = useSelector(selectDisplayLang());
  const [open, setOpen] = useState(false);
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const [showCodeListRemoveModal, setShowRemoveCodeListModal] = useState(false);
  const [showCodeListAddModal, setShowAddCodeListModal] = useState(false);
  const [removedCodeList, setRemovedCodeList] = useState<string>();

  const {
    data: resourceData,
    isSuccess,
    isError,
  } = useGetResourceQuery(
    {
      modelId: data.modelId,
      resourceIdentifier: data.identifier,
      applicationProfile,
      version: data.version,
    },
    { skip: !open || !data.modelId }
  );

  const [updateTarget, updateResult] = useUpdateClassResrictionTargetMutation();
  const [addCodeList, addCodeListResult] = useAddCodeListMutation();

  const handleEdit = () => {
    if (isSuccess) {
      dispatch(setSelected(data.identifier, 'attributes', data.modelId));
      dispatch(setView(attribute ? 'attributes' : 'associations', 'edit'));
      dispatch(setResource(resourceToResourceFormType(resourceData)));
    }
  };

  const handleChangeTarget = (newTarget?: InternalClassInfo) => {
    updateTarget({
      prefix: getSlugAsString(router.query.slug) ?? data.modelId,
      identifier: classId,
      uri: data.uri,
      currentTarget: targetInClassRestriction?.uri,
      newTarget: newTarget?.id,
    });
  };

  const handleAddCodeList = (selectedCodeLists: ModelCodeList[]) => {
    addCodeList({
      prefix: modelId,
      classIdentifier: classId,
      attributeUri: data.uri,
      codeLists: selectedCodeLists.map((c) => c.id),
    });
  };

  const handleShowRemoveCodeListModal = (codeList: string) => {
    setShowRemoveCodeListModal(true);
    setRemovedCodeList(codeList);
  };

  useEffect(() => {
    if (handlePropertiesUpdate && updateResult.isSuccess) {
      handlePropertiesUpdate();
    }
  }, [updateResult, handlePropertiesUpdate]);

  useEffect(() => {
    if (addCodeListResult.isSuccess) {
      dispatch(setNotification('CODE_LIST_ADDED'));
    }
  }, [addCodeListResult]);

  function renderTitleButtonContent() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <PrimaryTextWrapper>
            {`${getLanguageVersion({
              data: data.label,
              lang: displayLang ?? i18n.language,
              appendLocale: true,
            })} (${data.curie})`}
          </PrimaryTextWrapper>
          <SecondaryTextWrapper>
            {data.range && !attribute
              ? `${getLanguageVersion({
                  data: data.range.label,
                  lang: displayLang ?? i18n.language,
                  appendLocale: true,
                })} (${data.range.curie})`
              : ''}
          </SecondaryTextWrapper>
        </div>
        {applicationProfile &&
          (data.deactivated ? (
            <IconDisabled fill="depthDark2" />
          ) : (
            <IconCheckCircle fill="#09a580" />
          ))}
      </div>
    );
  }

  function renderActions() {
    return (
      <>
        {!disableEdit &&
          hasPermission &&
          (!applicationProfile || modelId === data.modelId) && (
            <ActionMenu id="actions-menu" buttonText={t('actions')}>
              {modelId === data.modelId ? (
                <ActionMenuItem onClick={handleEdit}>
                  {t('edit', { ns: 'admin' })}
                </ActionMenuItem>
              ) : (
                <></>
              )}

              {!applicationProfile && attribute ? (
                <ActionMenuItem onClick={() => setShowAddCodeListModal(true)}>
                  {t('add-reference-data', { ns: 'admin' })}
                </ActionMenuItem>
              ) : (
                <></>
              )}

              {!data.fromShNode || !applicationProfile ? (
                <RemoveReferenceModal
                  modelId={modelId}
                  classId={classId}
                  uri={data.uri}
                  name={getLanguageVersion({
                    data: data.label,
                    lang: displayLang ?? i18n.language,
                    appendLocale: true,
                  })}
                  applicationProfile={applicationProfile}
                  resourceType={
                    attribute
                      ? ResourceType.ATTRIBUTE
                      : ResourceType.ASSOCIATION
                  }
                  currentTarget={targetInClassRestriction?.uri}
                />
              ) : (
                <></>
              )}
            </ActionMenu>
          )}

        <CodeListModal
          extendedView
          modalTitle={t('add-reference-data')}
          initialData={[]}
          setData={(value) => handleAddCodeList(value)}
          hideAddButton={true}
          isOpen={showCodeListAddModal}
          setOpen={setShowAddCodeListModal}
        />
        <RemoveCodeListModal
          modelId={modelId}
          classId={classId}
          attributeUri={data.uri}
          showModal={showCodeListRemoveModal}
          setShowModal={setShowRemoveCodeListModal}
          codeList={removedCodeList}
        />
      </>
    );
  }

  return (
    <Expander open={open} onOpenChange={() => setOpen(!open)}>
      <ExpanderTitleButton>{renderTitleButtonContent()}</ExpanderTitleButton>
      {updateResult.error && (
        <InlineAlert status="error">
          {getApiError(updateResult.error)[0]}
        </InlineAlert>
      )}
      <ExpanderContent>
        {isError && <ResourceError noHeader={true} />}
        {isSuccess && (
          <CommonViewContent
            data={resourceData}
            modelId={data.modelId}
            displayLabel
            inUse={!data.deactivated}
            applicationProfile={applicationProfile}
            disableAssocTarget={disableAssocTarget}
            renderActions={renderActions}
            handleChangeTarget={handleChangeTarget}
            targetInClassRestriction={targetInClassRestriction}
            simpleResourceCodeLists={data.codeLists}
            disableEdit={disableEdit}
            handleRemoveCodeList={handleShowRemoveCodeListModal}
          />
        )}
        {!data.modelId && (
          <ExternalResourceInfo resource={data} renderActions={renderActions} />
        )}
      </ExpanderContent>
    </Expander>
  );
}
