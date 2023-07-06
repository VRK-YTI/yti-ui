import { useState } from 'react';
import { Panel } from 'reactflow';
import {
  Button,
  HintText,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconFullscreen,
  IconMapMyLocation,
  IconMinus,
  IconPlus,
  IconSave,
  IconSwapRounded,
  RadioButton,
  RadioButtonGroup,
  Text,
  ToggleButton,
} from 'suomifi-ui-components';
import { ToolsButtonGroup } from 'yti-common-ui/drawer/drawer.styles';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { ToggleButtonGroup, ToolsTooltip } from './model-tools.styles';

export default function ModelTools() {
  const { isSmall } = useBreakpoints();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (isSmall) {
    return <></>;
  }

  return (
    <Panel position="top-right">
      <div
        style={{
          marginRight: '10px',
        }}
      >
        <ToolsButtonGroup $isSmall={isSmall}>
          <Button icon={<IconPlus />} />
          <Button icon={<IconMinus />} />
          <Button icon={<IconFullscreen />} />
          <Button icon={<IconSwapRounded />} />
          <Button icon={<IconMapMyLocation />} />
          <Button icon={<IconDownload />} />
          <Button icon={<IconSave />} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              gap: '5px',
            }}
          >
            <Button
              icon={tooltipOpen ? <IconChevronRight /> : <IconChevronLeft />}
              variant="secondary"
              onClick={() => setTooltipOpen(!tooltipOpen)}
            />
            {tooltipOpen && (
              <ToolsTooltip>
                <div>
                  <Text variant="bold">Kaavion asetukset</Text>
                </div>

                <ToggleButtonGroup>
                  <HintText>Näytä</HintText>
                  <ToggleButton>Assosiaatiorajoitteet</ToggleButton>
                  <ToggleButton>Attribuuttirajoitteet</ToggleButton>
                </ToggleButtonGroup>

                <div>
                  <RadioButtonGroup
                    labelText="Näytä resurssista"
                    name="resource"
                    defaultValue="name"
                  >
                    <RadioButton value="name">Nimi</RadioButton>
                    <RadioButton value="id">Tunnus / Tekninen nimi</RadioButton>
                  </RadioButtonGroup>
                </div>
              </ToolsTooltip>
            )}
          </div>
        </ToolsButtonGroup>
      </div>
    </Panel>
  );
}
