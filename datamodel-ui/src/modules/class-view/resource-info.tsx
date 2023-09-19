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
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import {
  setResource,
  useGetResourceQuery,
} from '@app/common/components/resource/resource.slice';
import { useState } from 'react';
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

interface ResourceInfoProps {
  data: SimpleResource;
  modelId: string;
  classId: string;
  hasPermission: boolean;
  applicationProfile?: boolean;
  attribute?: boolean;
  handlePropertyDelete: () => void;
}

export default function ResourceInfo({
  data,
  modelId,
  applicationProfile,
  attribute,
  classId,
  hasPermission,
  handlePropertyDelete,
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
    },
    { skip: !open }
  );

  const handleEdit = () => {
    if (isSuccess) {
      dispatch(setSelected(data.identifier, 'attributes', data.modelId));
      dispatch(setView(attribute ? 'attributes' : 'associations', 'edit'));
      dispatch(setResource(resourceToResourceFormType(resourceData)));
    }
  };

  function renderTitleButtonContent() {
    if (!applicationProfile) {
      return (
        <>
          {getLanguageVersion({
            data: data.label,
            lang: i18n.language,
            appendLocale: true,
          })}
        </>
      );
    }

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
            {getLanguageVersion({
              data: data.label,
              lang: i18n.language,
              appendLocale: true,
            })}
          </PrimaryTextWrapper>
          <SecondaryTextWrapper>
            {`${data.modelId}:${data.identifier}`}
          </SecondaryTextWrapper>
        </div>
        {data.deactivated ? (
          <IconDisabled fill="depthDark2" />
        ) : (
          <IconCheckCircle fill="#09a580" />
        )}
      </div>
    );
  }

  function renderActions() {
    return (
      <>
        {hasPermission && (!applicationProfile || modelId === data.modelId) && (
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
                {(!data.fromShNode || !applicationProfile) && (
                  <RemoveReferenceModal
                    modelId={modelId}
                    classId={classId}
                    uri={data.uri}
                    handleReturn={handlePropertyDelete}
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
