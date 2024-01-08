import { useEffect, useState } from 'react';
import { useStore, useReactFlow } from 'reactflow';
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
  Tooltip,
} from 'suomifi-ui-components';
import { ToolsButtonGroup } from 'yti-common-ui/drawer/drawer.styles';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  TipTooltipWrapper,
  ToggleButtonGroup,
  ToolsPanel,
  ToolsTooltip,
} from './model-tools.styles';
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
import { translateTooltip } from '@app/common/utils/translation-helpers';

export default function ModelTools({
  modelId,
  applicationProfile,
  organisations,
}: {
  modelId: string;
  applicationProfile: boolean;
  organisations: string[];
}) {
  const { t } = useTranslation('common');
  const { isSmall } = useBreakpoints();
  const hasPermission = HasPermission({
    actions: 'EDIT_DATA_MODEL',
    targetOrganization: organisations,
  });
  const { setViewport, setCenter, getNode } = useReactFlow();
  const dispatch = useStoreDispatch();
  const tools = useSelector(selectModelTools());
  const globalSelected = useSelector(selectSelected());
  const transform = useStore((state) => state.transform);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [ref, setRef] = useState<HTMLButtonElement | null>(null);
  const [showHover, setShowHover] = useState(false);

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

    const x = node.positionAbsolute ? node.positionAbsolute.x : node.position.x;
    const y = node.positionAbsolute ? node.positionAbsolute.y : node.position.y;

    setCenter(x + (node.width ?? 1) / 2, y + (node.height ?? 1), {
      duration: 500,
      zoom: 1.5,
    });
  };

  useEffect(() => {
    if (ref) {
      const timer = setTimeout(() => {
        setShowHover(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (!ref) {
      setShowHover(false);
    }
  }, [ref]);

  if (isSmall) {
    return <></>;
  }

  return (
    <ToolsPanel position="top-right">
      <div
        style={{
          marginRight: '10px',
        }}
      >
        <ToolsButtonGroup $isSmall={isSmall}>
          <Button
            id="graph-tools_zoom-in"
            icon={<IconPlus />}
            onClick={() =>
              setViewport({
                x: transform[0],
                y: transform[1],
                zoom: transform[2] + 0.25,
              })
            }
            onMouseEnter={(ref) => setRef(ref.currentTarget)}
            onMouseLeave={() => setRef(null)}
          />
          <Button
            id="graph-tools_zoom-out"
            icon={<IconMinus />}
            onClick={() =>
              setViewport({
                x: transform[0],
                y: transform[1],
                zoom: transform[2] - 0.25,
              })
            }
            onMouseEnter={(ref) => setRef(ref.currentTarget)}
            onMouseLeave={() => setRef(null)}
          />
          <Button
            id="graph-tools_fullscreen"
            icon={<IconFullscreen />}
            onClick={() => {
              dispatch(setModelTools('fullScreen', !tools.fullScreen));
            }}
            onMouseEnter={(ref) => setRef(ref.currentTarget)}
            onMouseLeave={() => setRef(null)}
          />
          <Button
            id="graph-tools_reset-positions"
            icon={<IconSwapRounded />}
            onClick={() => handleResetPosition()}
            onMouseEnter={(ref) => setRef(ref.currentTarget)}
            onMouseLeave={() => setRef(null)}
          />
          <Button
            id="graph-tools_zoom-to"
            icon={<IconMapMyLocation />}
            onClick={() => handleCenterNode()}
            onMouseEnter={(ref) => setRef(ref.currentTarget)}
            onMouseLeave={() => setRef(null)}
          />

          <DownloadPicture modelId={modelId} setRef={setRef} />

          {hasPermission && (
            <Button
              id="graph-tools_save-positions"
              icon={<IconSave />}
              onClick={() => dispatch(setSavePosition(true))}
              onMouseEnter={(ref) => setRef(ref.currentTarget)}
              onMouseLeave={() => setRef(null)}
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

      {ref && (
        <TipTooltipWrapper
          $x={ref && ref.getBoundingClientRect().x}
          $y={ref && ref.getBoundingClientRect().y}
        >
          <Tooltip
            ariaCloseButtonLabelText=""
            ariaToggleButtonLabelText=""
            anchorElement={ref}
            open={showHover}
          >
            {translateTooltip(ref.id, t)}
          </Tooltip>
        </TipTooltipWrapper>
      )}
    </ToolsPanel>
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
                checked={tools.showAssociations}
                onClick={() =>
                  dispatch(
                    setModelTools('showAssociations', !tools.showAssociations)
                  )
                }
              >
                {t('show-associations')}
              </ToggleButton>
              <ToggleButton
                checked={tools.showClassHighlights}
                onClick={() =>
                  dispatch(
                    setModelTools(
                      'showClassHighlights',
                      !tools.showClassHighlights
                    )
                  )
                }
              >
                {t('highlight-class-associations')}
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
              <ToggleButton
                checked={tools.showClassHighlights}
                onClick={() =>
                  dispatch(
                    setModelTools(
                      'showClassHighlights',
                      !tools.showClassHighlights
                    )
                  )
                }
              >
                {t('highlight-class-association-restrictions')}
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
