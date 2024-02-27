import { getLanguageVersion } from '@app/common/utils/get-language-version';
import {
  NarrowModal,
  SimpleModalContent,
  ButtonFooter,
} from '@app/modules/as-file-modal/as-file-modal.styles';
import { useTranslation } from 'next-i18next';
import { ModalTitle, Button, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';

export const ConfirmationModal = ({
  visible,
  handleClick,
  label,
}: {
  visible: boolean;
  handleClick: (confirmed: boolean) => void;
  label?: { [key: string]: string };
}) => {
  const { isSmall } = useBreakpoints();
  const { i18n, t } = useTranslation('admin');

  return (
    <NarrowModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClick(false)}
      variant={isSmall ? 'smallScreen' : 'default'}
    >
      <SimpleModalContent>
        <ModalTitle>{t('delete-codelist')}</ModalTitle>
        <Text>
          {t('codelist-delete-warning', {
            name: getLanguageVersion({ data: label, lang: i18n.language }),
          })}
        </Text>
        <ButtonFooter>
          <Button onClick={() => handleClick(true)}>{t('remove')}</Button>
          <Button variant="secondary" onClick={() => handleClick(false)}>
            {t('cancel-variant')}
          </Button>
        </ButtonFooter>
      </SimpleModalContent>
    </NarrowModal>
  );
};
