import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  Button,
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  IconMenu,
  Tooltip,
  Text,
} from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import {
  setResource,
  useGetResourceQuery,
} from '@app/common/components/resource/resource.slice';
import { useState } from 'react';
import CommonViewContent from '@app/modules/common-view-content';
import { TooltipWrapper } from '../model/model.styles';
import { BasicBlock } from 'yti-common-ui/block';
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
        <Text>
          {data.deactivated
            ? t('not-in-use', { ns: 'admin' })
            : t('in-use', { ns: 'admin' })}
        </Text>
      </div>
    );
  }

  function renderActions() {
    if (!applicationProfile) {
      return <></>;
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <BasicBlock title={t('in-use-in-this-model', { ns: 'admin' })}>
          {data.deactivated
            ? t('not-in-use', { ns: 'admin' })
            : t('in-use', { ns: 'admin' })}
        </BasicBlock>
        {hasPermission && modelId === data.modelId && (
          <div>
            <Button
              variant="secondary"
              iconRight={<IconMenu />}
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
                <Button
                  variant="secondaryNoBorder"
                  onClick={handleEdit}
                  id="edit-reference-button"
                >
                  {t('edit', { ns: 'admin' })}
                </Button>
                {!data.fromShNode && (
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
      </div>
    );
  }

  return (
    <Expander open={open} onOpenChange={() => setOpen(!open)}>
      <ExpanderTitleButton>{renderTitleButtonContent()}</ExpanderTitleButton>
      <ExpanderContent>
        {isSuccess && (
          <>
            {renderActions()}
            <CommonViewContent
              data={resourceData}
              modelId={data.modelId}
              displayLabel
              applicationProfile={applicationProfile}
            />
          </>
        )}
      </ExpanderContent>
    </Expander>
  );
}
