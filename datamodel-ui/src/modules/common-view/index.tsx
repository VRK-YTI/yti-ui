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
import { StatusChip } from '@app/common/components/multi-column-search/multi-column-search.styles';
import { TooltipWrapper } from '../model/model.styles';
import DeleteModal from '../delete-modal';
import CommonViewContent from './common-view-content';

interface CommonViewProps {
  data?: Resource;
  modelId: string;
  handleReturn: () => void;
  handleEdit: () => void;
}

export default function CommonView({
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
                  <Button
                    variant="secondaryNoBorder"
                    onClick={() => handleEdit()}
                  >
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
