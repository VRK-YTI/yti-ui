import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import { FooterBlock } from './new-concept.styles';

interface FormFooterProps {
  handlePost: () => void;
}

export default function FormFooter({ handlePost }: FormFooterProps) {
  const { t } = useTranslation('admin');

  return (
    <FooterBlock>
      <Separator isLarge />
      <div>
        <Button onClick={() => handlePost()}>{t('save')}</Button>
        <Button variant="secondary">{t('cancel-variant')}</Button>
      </div>
    </FooterBlock>
  );
}
