import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from 'suomifi-ui-components';
import { FooterBlock } from './new-concept.styles';
import validateForm from './validate-form';

interface FormFooterProps {
  handlePost: () => void;
  onCancel?: () => void;
  isEdit: boolean;
  errors: ReturnType<typeof validateForm>;
}

export default function FormFooter({
  handlePost,
  onCancel,
  isEdit,
  errors,
}: FormFooterProps) {
  const { t } = useTranslation('admin');
  const router = useRouter();

  const handleCancel = () => {
    onCancel?.();
    router.replace(
      isEdit
        ? `/terminology/${router.query.terminologyId}/concept/${router.query.conceptId}`
        : `/terminology/${router.query.terminologyId}`
    );
  };

  return (
    <FooterBlock>
      <Separator isLarge />
      <div>
        <Button onClick={() => handlePost()} id="submit-button">
          {t('save')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleCancel()}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
      </div>
    </FooterBlock>
  );
}
