import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { InlineAlert, Text, ToggleButton } from 'suomifi-ui-components';

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
}: {
  inUse: boolean;
  setInUse: (inUse: boolean) => void;
  type: ResourceType;
  applicationProfile?: boolean;
}) {
  const { t } = useTranslation('admin');

  if (!applicationProfile) {
    return <></>;
  }

  return (
    <Wrapper>
      <InlineAlert status="neutral">
        {type === ResourceType.ASSOCIATION
          ? t('association-constraint-toggle-description')
          : t('attribute-constraint-toggle-description')}
      </InlineAlert>

      <ToggleWrapper>
        <div>
          <Text variant="bold" smallScreen>
            {t('in-use-in-this-model')}
          </Text>
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
