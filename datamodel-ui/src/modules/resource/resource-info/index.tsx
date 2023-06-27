import { Resource } from '@app/common/interfaces/resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import HasPermission from '@app/common/utils/has-permission';
import {
  translateCommonForm,
  translateStatus,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  IconArrowLeft,
  IconMenu,
  Text,
  Tooltip,
} from 'suomifi-ui-components';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import Separator from 'yti-common-ui/separator';
import { TooltipWrapper } from '@app/modules/model/model.styles';
import DeleteModal from '@app/modules/delete-modal';
import CommonViewContent from '@app/modules/common-view-content';
import { StatusChip } from '@app/common/components/resource-list/resource-list.styles';
import { useGetAwayListener } from '@app/common/utils/hooks/use-get-away-listener';

interface CommonViewProps {
  data?: Resource;
  modelId: string;
  handleReturn: () => void;
  handleEdit: () => void;
}

export default function ResourceInfo({
  data,
  modelId,
  handleReturn,
  handleEdit,
}: CommonViewProps) {
  const { t, i18n } = useTranslation('common');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasPermission = HasPermission({
    actions: ['ADMIN_ASSOCIATION', 'ADMIN_ATTRIBUTE'],
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [visible, setVisible] = useState(false);
  const { ref: toolTipRef } = useGetAwayListener(showTooltip, setShowTooltip);

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
            icon={<IconArrowLeft />}
            style={{ textTransform: 'uppercase' }}
            onClick={handleReturn}
            ref={toolTipRef}
            id="back-button"
          >
            {data ? translateCommonForm('return', data.type, t) : t('back')}
          </Button>
          {hasPermission && data && (
            <div>
              <Button
                variant="secondary"
                iconRight={<IconMenu />}
                style={{ height: 'min-content' }}
                onClick={() => setShowTooltip(!showTooltip)}
                id="actions-button"
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
                    onClick={() => handleEdit()}
                    id="edit-button"
                  >
                    {t('edit', { ns: 'admin' })}
                  </Button>
                  <Separator />
                  <Button
                    variant="secondaryNoBorder"
                    onClick={() => setVisible(true)}
                    id="remove-button"
                  >
                    {t('remove', { ns: 'admin' })}
                  </Button>
                </Tooltip>
              </TooltipWrapper>
              <DeleteModal
                modelId={modelId}
                resourceId={data.identifier}
                type={data.type === 'ASSOCIATION' ? 'association' : 'attribute'}
                label={getLanguageVersion({
                  data: data.label,
                  lang: i18n.language,
                })}
                onClose={handleReturn}
                visible={visible}
                hide={() => setVisible(false)}
              />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text variant="bold">
              {data &&
                getLanguageVersion({
                  data: data.label,
                  lang: i18n.language,
                })}
            </Text>
            <StatusChip $isValid={data && data.status === 'VALID'}>
              {data && translateStatus(data.status, t)}
            </StatusChip>
          </div>
        </div>
      </StaticHeader>

      <DrawerContent height={headerHeight}>
        {data && <CommonViewContent modelId={modelId} data={data} />}
      </DrawerContent>
    </>
  );
}
