import { useState } from 'react';
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
  defaultChecked,
  applicationProfile,
}: {
  defaultChecked: boolean;
  applicationProfile?: boolean;
}) {
  const [toggle, setToggle] = useState(defaultChecked);

  if (!applicationProfile) {
    return <></>;
  }

  return (
    <Wrapper>
      <InlineAlert status="neutral">
        Huomioi, että attribuutin muokkaus vaikuttaa jokaiseen attribuutin
        esiintymään.
      </InlineAlert>

      <ToggleWrapper>
        <div>
          <Text variant="bold" smallScreen>
            Käytössä tässä tietomallissa
          </Text>
        </div>
        <ToggleButton
          defaultChecked={toggle}
          onClick={() => setToggle(!toggle)}
        >
          {toggle ? 'Käytössä' : 'Ei käytössä'}
        </ToggleButton>
      </ToggleWrapper>
    </Wrapper>
  );
}
