import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from 'suomifi-ui-components';
import { FooterBlock } from './new-concept.styles';

interface FormFooterProps {
  handlePost: () => void;
  onCancel?: () => void;
  isEdit: boolean;
}

export default function FormFooter({
  handlePost,
  onCancel,
  isEdit,
}: FormFooterProps) {
  const { t } = useTranslation('admin');
  const router = useRouter();

  const handleCancel = () => {
    onCancel?.();
    router.push(
      isEdit
        ? `/terminology/${router.query.terminologyId}/concept/${router.query.conceptId}`
        : `/terminology/${router.query.terminologyId}`
    );
  };

  return (
    <FooterBlock>
      <Separator isLarge />
      <div>
        <Button onClick={() => handlePost()}>{t('save')}</Button>
        <Button variant="secondary" onClick={() => handleCancel()}>
          {t('cancel-variant')}
        </Button>
      </div>
    </FooterBlock>
  );
}
