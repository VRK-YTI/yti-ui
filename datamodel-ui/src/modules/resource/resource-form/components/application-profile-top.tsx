import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { translateApplicationProfileTopDescription } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import {
  InlineAlert,
  Text,
  ToggleButton,
  Button,
  Tooltip,
} from 'suomifi-ui-components';

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
}: {
  inUse: boolean;
  setInUse: (inUse: boolean) => void;
  type: ResourceType;
  applicationProfile?: boolean;
  external?: boolean;
}) {
  const { t } = useTranslation('admin');

  if (!applicationProfile) {
    return <></>;
  }

  return (
    <Wrapper>
      <InlineAlert status="neutral">
        <Text>
          {translateApplicationProfileTopDescription(type, t, external)}
        </Text>
        {external && (
          <div style={{ marginTop: '15px' }}>
            <Button variant="secondary">{t('create-local-copy')}</Button>
          </div>
        )}
      </InlineAlert>

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
  );
}
