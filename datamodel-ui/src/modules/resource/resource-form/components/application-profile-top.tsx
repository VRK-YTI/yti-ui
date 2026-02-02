import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { translateApplicationProfileTopDescription } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import styled from 'styled-components';
import {
  InlineAlert,
  Text,
  ToggleButton,
  Button,
  Tooltip,
} from 'suomifi-ui-components';
import LocalCopyModal from '@app/modules/local-copy-modal';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};

  .fi-toggle {
    button:first-child {
      position: unset;
    }
  }
`;

export default function ApplicationProfileTop({
  inUse,
  setInUse,
  type,
  applicationProfile,
  external,
  currentModelId,
  sourceModelId,
  sourceIdentifier,
  handleReturn,
}: {
  inUse: boolean;
  setInUse: (inUse: boolean) => void;
  type: ResourceType;
  applicationProfile?: boolean;
  external?: boolean;
  currentModelId?: string;
  sourceModelId?: string;
  sourceIdentifier?: string;
  handleReturn?: (id: string, modelPrefix: string) => void;
}) {
  const { t } = useTranslation('admin');
  const [localCopyVisible, setLocalCopyVisible] = useState(false);

  const handleLocalCopySuccess = (id: string, modelPrefix: string) => {
    if (handleReturn) {
      handleReturn(id, modelPrefix);
    }
  };

  if (!applicationProfile) {
    return <></>;
  }

  return (
    <>
      <Wrapper>
        {external && (
          <InlineAlert status="neutral">
            <Text>
              {translateApplicationProfileTopDescription(type, t, external)}
            </Text>
            <div style={{ marginTop: '15px' }}>
              <Button
                variant="secondary"
                onClick={() => setLocalCopyVisible(true)}
                id="create-local-copy-button"
              >
                {t('create-local-copy')}
              </Button>
            </div>
          </InlineAlert>
        )}

        {!external && (
          <InlineAlert status="neutral">
            <Text>
              {translateApplicationProfileTopDescription(type, t, external)}
            </Text>
          </InlineAlert>
        )}

        <ToggleWrapper>
          <div>
            <Text variant="bold" smallScreen>
              {t('in-use-in-this-model')}
            </Text>
            <Tooltip ariaCloseButtonLabelText="" ariaToggleButtonLabelText="">
              {t('tooltip.in-use-in-this-model', { ns: 'common' })}
            </Tooltip>
          </div>
          <ToggleButton
            checked={inUse}
            defaultChecked={inUse}
            onClick={() => setInUse(!inUse)}
          >
            {inUse ? t('in-use') : t('not-in-use')}
          </ToggleButton>
        </ToggleWrapper>
      </Wrapper>

      {external &&
        currentModelId &&
        sourceModelId &&
        sourceIdentifier &&
        handleReturn && (
          <LocalCopyModal
            visible={localCopyVisible}
            hide={() => setLocalCopyVisible(false)}
            targetModelId={currentModelId}
            sourceModelId={sourceModelId}
            sourceIdentifier={sourceIdentifier}
            handleReturn={handleLocalCopySuccess}
            resourceType={type}
          />
        )}
    </>
  );
}
