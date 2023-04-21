import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import HasPermission from '@app/common/utils/has-permission';
import {
  translateCommonForm,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Button, Text, Tooltip } from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import Separator from 'yti-common-ui/separator';
import { StatusChip } from '@app/common/components/multi-column-search/multi-column-search.styles';
import { TooltipWrapper } from '../model/model.styles';
import DeleteModal from '../delete-modal';
import CommonViewContent from './common-view-content';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';

interface CommonViewProps {
  data: Resource;
  modelId: string;
  type: ResourceType;
  handleReturn: () => void;
}

export default function CommonView({
  data,
  modelId,
  type,
  handleReturn,
}: CommonViewProps) {
  const { t, i18n } = useTranslation('common');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasPermission = HasPermission({
    actions: ['ADMIN_ASSOCIATION', 'ADMIN_ATTRIBUTE'],
  });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <>
      <StaticHeader ref={ref}>
        <div>
          <Button
            variant="secondaryNoBorder"
            icon="arrowLeft"
            style={{ textTransform: 'uppercase' }}
            onClick={handleReturn}
          >
            {translateCommonForm('return', data.type, t)}
          </Button>
          {hasPermission && (
            <div>
              <Button
                variant="secondary"
                iconRight="menu"
                style={{ height: 'min-content' }}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                {t('actions')}
              </Button>
              <TooltipWrapper>
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                  open={showTooltip}
                  onCloseButtonClick={() => setShowTooltip(false)}
                >
                  <Button variant="secondaryNoBorder">
                    {t('edit', { ns: 'admin' })}
                  </Button>
                  <Separator />
                  <DeleteModal
                    modelId={modelId}
                    resourceId={data.identifier}
                    type={
                      data.type === 'ASSOCIATION' ? 'association' : 'attribute'
                    }
                    label={getLanguageVersion({
                      data: data.label,
                      lang: i18n.language,
                    })}
                    onClose={handleReturn}
                  />
                </Tooltip>
              </TooltipWrapper>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text variant="bold">
              {getLanguageVersion({
                data: data.label,
                lang: i18n.language,
              })}
            </Text>
            <StatusChip $isValid={data.status === 'VALID'}>
              {translateStatus(data.status, t)}
            </StatusChip>
          </div>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        <CommonViewContent modelId={modelId} data={data} />
      </DrawerContent>
    </>
  );
}
