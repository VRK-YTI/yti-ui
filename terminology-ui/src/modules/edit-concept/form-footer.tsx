import FormFooterAlert from '@app/common/components/form-footer-alert';
import SaveSpinner from '@app/common/components/save-spinner';
import Separator from '@common/components/separator';
import { translateEditConceptError } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from 'suomifi-ui-components';
import { ButtonBlock, FooterBlock } from './new-concept.styles';
import { FormError } from './validate-form';

interface FormFooterProps {
  handlePost: () => void;
  onCancel?: () => void;
  isEdit: boolean;
  isCreating: boolean;
  errors: FormError;
}

export default function FormFooter({
  handlePost,
  onCancel,
  isEdit,
  isCreating,
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
      {errors.total && (
        <div style={{ marginBottom: '15px' }}>
          <FormFooterAlert
            alerts={Object.keys(errors)
              .filter((k) => k !== 'total' && errors[k as keyof FormError])
              .map((k) => translateEditConceptError(k as keyof FormError, t))}
          />
        </div>
      )}
      <ButtonBlock>
        <Button
          disabled={isCreating}
          onClick={() => handlePost()}
          id="submit-button"
        >
          {t('save')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleCancel()}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
        {isCreating && <SaveSpinner text={t('saving-concept')} />}
      </ButtonBlock>
    </FooterBlock>
  );
}
