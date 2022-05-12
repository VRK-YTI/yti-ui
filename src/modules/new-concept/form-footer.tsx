import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import { FooterBlock } from './new-concept.styles';

export default function FormFooter() {
  const { t } = useTranslation('admin');

  return (
    <FooterBlock>
      <Separator isLarge />
      <div>
        <Button>{t('save')}</Button>
        <Button variant="secondary">{t('cancel-variant')}</Button>
      </div>
    </FooterBlock>
  );
}
