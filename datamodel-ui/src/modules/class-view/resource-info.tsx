import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  Button,
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  Tooltip,
  IconCheckCircle,
  IconDisabled,
  IconOptionsVertical,
  InlineAlert,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import {
  setResource,
  useGetResourceQuery,
} from '@app/common/components/resource/resource.slice';
import CommonViewContent from '@app/modules/common-view-content';
import { TooltipWrapper } from '../model/model.styles';
import { setSelected, setView } from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { resourceToResourceFormType } from '../resource/utils';
import RemoveReferenceModal from './remove-reference-modal';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import {
  PrimaryTextWrapper,
  SecondaryTextWrapper,
} from './resource-info-styles';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import ClassModal from '../class-modal';
import { InternalClassInfo } from '@app/common/interfaces/internal-class.interface';
import { UriData } from '@app/common/interfaces/uri.interface';
import { useUpdateClassResrictionTargetMutation } from '@app/common/components/class/class.slice';
import getApiError from '@app/common/utils/get-api-errors';
import { useEffect, useState } from 'react';

interface ResourceInfoProps {
  data: SimpleResource;
  modelId: string;
  classId: string;
  hasPermission: boolean;
  applicationProfile?: boolean;
  attribute?: boolean;
  handlePropertiesUpdate: () => void;
  disableEdit?: boolean;
  targetInClassRestriction?: UriData;
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
}: ResourceInfoProps) {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const dispatch = useStoreDispatch();
  const [showTooltip, setShowTooltip] = useState(false);

  const { data: resourceData, isSuccess } = useGetResourceQuery(
    {
      modelId: data.modelId,
      resourceIdentifier: data.identifier,
      applicationProfile,
      version: data.version,
    },
    { skip: !open }
  );

  const [updateTarget, updateResult] = useUpdateClassResrictionTargetMutation();

  const handleEdit = () => {
    if (isSuccess) {
      dispatch(setSelected(data.identifier, 'attributes', data.modelId));
      dispatch(setView(attribute ? 'attributes' : 'associations', 'edit'));
      dispatch(setResource(resourceToResourceFormType(resourceData)));
    }
  };

  const handleChangeTarget = (newTarget?: InternalClassInfo) => {
    updateTarget({
      prefix: data.modelId,
      identifier: classId,
      uri: data.uri,
      currentTarget: targetInClassRestriction?.uri,
      newTarget: newTarget?.id,
    });
    setShowTooltip(false);
  };

  useEffect(() => {
    if (updateResult.isSuccess) {
      handlePropertiesUpdate();
    }
  }, [updateResult, handlePropertiesUpdate]);

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
              lang: i18n.language,
              appendLocale: true,
            })} (${data.modelId}:${data.identifier})`}
          </PrimaryTextWrapper>
          <SecondaryTextWrapper>
            {data.range && !attribute
              ? `${getLanguageVersion({
                  data: data.range.label,
                  lang: i18n.language,
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
            <div>
              <Button
                variant="secondary"
                iconRight={<IconOptionsVertical />}
                onClick={() => setShowTooltip(!showTooltip)}
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
                  {modelId === data.modelId && (
                    <Button
                      variant="secondaryNoBorder"
                      onClick={handleEdit}
                      id="edit-reference-button"
                    >
                      {t('edit', { ns: 'admin' })}
                    </Button>
                  )}
                  {!applicationProfile && !attribute && (
                    <ClassModal
                      modalButtonLabel={t('choose-association-target')}
                      mode="select"
                      handleFollowUp={handleChangeTarget}
                      modelId={modelId}
                      applicationProfile={applicationProfile}
                      buttonVariant="secondaryNoBorder"
                    />
                  )}
                  {(!data.fromShNode || !applicationProfile) && (
                    <RemoveReferenceModal
                      modelId={modelId}
                      classId={classId}
                      uri={data.uri}
                      handleReturn={handlePropertiesUpdate}
                      name={getLanguageVersion({
                        data: data.label,
                        lang: i18n.language,
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
                  )}
                </Tooltip>
              </TooltipWrapper>
            </div>
          )}
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
        {isSuccess && (
          <CommonViewContent
            data={resourceData}
            modelId={data.modelId}
            displayLabel
            inUse={!data.deactivated}
            applicationProfile={applicationProfile}
            renderActions={renderActions}
          />
        )}
      </ExpanderContent>
    </Expander>
  );
}
