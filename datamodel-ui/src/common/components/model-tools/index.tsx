import { useState } from 'react';
import { Panel, useStore, useReactFlow } from 'reactflow';
import {
  Button,
  HintText,
  IconChevronLeft,
  IconChevronRight,
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
import {
  selectModelTools,
  selectSelected,
  setModelTools,
  setResetPosition,
  setSavePosition,
} from '../model/model.slice';
import HasPermission from '@app/common/utils/has-permission';
import DownloadPicture from './download-picture';

export default function ModelTools({
  modelId,
  applicationProfile,
}: {
  modelId: string;
  applicationProfile: boolean;
}) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const hasPermission = HasPermission({ actions: 'ADMIN_DATA_MODEL' });
  const { setViewport, setCenter, getNode } = useReactFlow();
  const dispatch = useStoreDispatch();
  const tools = useSelector(selectModelTools());
  const globalSelected = useSelector(selectSelected());
  const transform = useStore((state) => state.transform);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleResetPosition = () => {
    dispatch(setResetPosition(true));
  };

  const handleCenterNode = () => {
    if (!globalSelected.id || globalSelected.id === '') {
      return;
    }

    const node = getNode(globalSelected.id);

    if (!node) {
      return;
    }

    setCenter(
      node.position.x + (node.width ?? 1) / 2,
      node.position.y + (node.height ?? 1) / 2,
      {
        duration: 500,
        zoom: 3,
      }
    );
  };

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
          <Button
            icon={<IconPlus />}
            onClick={() =>
              setViewport({
                x: transform[0],
                y: transform[1],
                zoom: transform[2] + 0.25,
              })
            }
          />
          <Button
            icon={<IconMinus />}
            onClick={() =>
              setViewport({
                x: transform[0],
                y: transform[1],
                zoom: transform[2] - 0.25,
              })
            }
          />
          <Button
            icon={<IconFullscreen />}
            onClick={() => {
              dispatch(setModelTools('fullScreen', !tools.fullScreen));
            }}
          />
          <Button
            icon={<IconSwapRounded />}
            onClick={() => handleResetPosition()}
          />
          <Button
            icon={<IconMapMyLocation />}
            onClick={() => handleCenterNode()}
          />

          <DownloadPicture modelId={modelId} />

          {hasPermission && (
            <Button
              icon={<IconSave />}
              onClick={() => dispatch(setSavePosition(true))}
            />
          )}

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
                    setModelTools('showCardinality', !tools.showCardinality)
                  )
                }
              >
                {t('show-cardinality')}
              </ToggleButton>
              <ToggleButton
                checked={tools.showStatus}
                onClick={() =>
                  dispatch(setModelTools('showStatus', !tools.showStatus))
                }
              >
                {t('show-statuses', { ns: 'admin' })}
              </ToggleButton>
              <ToggleButton
                checked={tools.showNotes}
                onClick={() =>
                  dispatch(setModelTools('showNotes', !tools.showNotes))
                }
              >
                {t('show-notes')}
              </ToggleButton>
              <ToggleButton
                checked={tools.showOriginalClass}
                onClick={() =>
                  dispatch(
                    setModelTools('showOriginalClass', !tools.showOriginalClass)
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
