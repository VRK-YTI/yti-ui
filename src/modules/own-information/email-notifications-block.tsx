import { useTranslation } from 'next-i18next';
import { BasicBlock } from '../../common/components/block';
import InlineAlert from '../../common/components/inline-alert';
import { ToggleButton } from 'suomifi-ui-components';
import { BasicBlockExtraWrapper } from '../../common/components/block/block.styles';

export default function EmailNotificationsBlock() {
  const { t } = useTranslation('own-information');

  return (
    <BasicBlock
      title={<h2>{t('field-email-notifications')}</h2>}
      extra={
        <>
          <BasicBlockExtraWrapper>
            <ToggleButton>{t('field-email-notifications')}</ToggleButton>
          </BasicBlockExtraWrapper>
          <BasicBlockExtraWrapper>
            <InlineAlert noIcon>Sähköposti-ilmoitukset päällä</InlineAlert>
          </BasicBlockExtraWrapper>
        </>
      }
      largeGap
    >
      {t('field-email-notifications-description')}
    </BasicBlock>
  );
}
