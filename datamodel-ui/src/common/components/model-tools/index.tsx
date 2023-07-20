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
import { useTranslation } from 'next-i18next';
import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { selectModelTools, setModelTools } from '../model/model.slice';

export default function ModelTools({
  applicationProfile,
}: {
  applicationProfile: boolean;
}) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const dispatch = useStoreDispatch();
  const tools = useSelector(selectModelTools());
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
            {renderLibraryVersion()}
            {renderAppProfileVersion()}
          </div>
        </ToolsButtonGroup>
      </div>
    </Panel>
  );

  function renderLibraryVersion() {
    if (applicationProfile) {
      return <></>;
    }

    return (
      <>
        <Button
          icon={tooltipOpen ? <IconChevronRight /> : <IconChevronLeft />}
          variant="secondary"
          onClick={() => setTooltipOpen(!tooltipOpen)}
        />
        {tooltipOpen && (
          <ToolsTooltip>
            <div>
              <Text variant="bold">{t('graph-settings')}</Text>
            </div>

            <ToggleButtonGroup>
              <ToggleButton
                checked={tools.showAttributes}
                onClick={() =>
                  dispatch(
                    setModelTools('showAttributes', !tools.showAttributes)
                  )
                }
              >
                {t('show-attributes')}
              </ToggleButton>
              <ToggleButton
                checked={tools.showCardinality}
                onClick={() =>
                  dispatch(
                    setModelTools('showCardinality', !tools.showAttributes)
                  )
                }
              >
                {t('show-cardinality')}
              </ToggleButton>
              <ToggleButton
                checked={tools.showStatus}
                onClick={() =>
                  dispatch(setModelTools('showStatus', !tools.showAttributes))
                }
              >
                {t('show-statuses', { ns: 'admin' })}
              </ToggleButton>
              <ToggleButton
                checked={tools.showNotes}
                onClick={() =>
                  dispatch(setModelTools('showNotes', !tools.showAttributes))
                }
              >
                {t('show-notes')}
              </ToggleButton>
              <ToggleButton
                checked={tools.showOriginalClass}
                onClick={() =>
                  dispatch(
                    setModelTools('showOriginalClass', !tools.showAttributes)
                  )
                }
              >
                {t('show-original-class')}
              </ToggleButton>
            </ToggleButtonGroup>

            <div>
              <RadioButtonGroup
                labelText={t('show-from-resource')}
                name="resource"
                value={tools.showByName ? 'name' : 'id'}
                onChange={(e) =>
                  e === 'name'
                    ? dispatch(setModelTools('showByName', true))
                    : dispatch(setModelTools('showById', false))
                }
              >
                <RadioButton value="name">{t('name')}</RadioButton>
                <RadioButton value="id">
                  {t('prefix')} / {t('technical-name')}
                </RadioButton>
              </RadioButtonGroup>
            </div>
          </ToolsTooltip>
        )}
      </>
    );
  }

  function renderAppProfileVersion() {
    if (!applicationProfile) {
      return <></>;
    }

    return (
      <>
        <Button
          icon={tooltipOpen ? <IconChevronRight /> : <IconChevronLeft />}
          variant="secondary"
          onClick={() => setTooltipOpen(!tooltipOpen)}
        />
        {tooltipOpen && (
          <ToolsTooltip>
            <div>
              <Text variant="bold">{t('graph-settings')}</Text>
            </div>

            <ToggleButtonGroup>
              <HintText>{t('show')}</HintText>
              <ToggleButton
                checked={tools.showAssociationRestrictions}
                onClick={() =>
                  dispatch(
                    setModelTools(
                      'showAssociationRestrictions',
                      !tools.showAssociationRestrictions
                    )
                  )
                }
              >
                {t('association-restr')}
              </ToggleButton>
              <ToggleButton
                checked={tools.showAttributeRestrictions}
                onClick={() =>
                  dispatch(
                    setModelTools(
                      'showAttributeRestrictions',
                      !tools.showAttributeRestrictions
                    )
                  )
                }
              >
                {t('attribute-restr')}
              </ToggleButton>
            </ToggleButtonGroup>

            <div>
              <RadioButtonGroup
                labelText={t('show-from-resource')}
                name="resource"
                value={tools.showByName ? 'name' : 'id'}
                onChange={(e) =>
                  e === 'name'
                    ? dispatch(setModelTools('showByName', true))
                    : dispatch(setModelTools('showById', false))
                }
              >
                <RadioButton value="name">{t('name')}</RadioButton>
                <RadioButton value="id">
                  {t('prefix')} / {t('technical-name')}
                </RadioButton>
              </RadioButtonGroup>
            </div>
          </ToolsTooltip>
        )}
      </>
    );
  }
}
