import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { ModelTerminology } from '@app/common/interfaces/model.interface';
import { useTranslation } from 'next-i18next';
import { Button, ExternalLink, Label } from 'suomifi-ui-components';
import { LanguageBlock } from 'yti-common-ui/form/language-selector.styles';
import TerminologyModal from '../terminology-modal';
import { AddBlockWrapper } from './model-form.styles';

export default function AddBlock({
  data,
  locale,
  removeTerminology,
  setTerminologies,
}: {
  data: ModelFormType;
  locale: string;
  removeTerminology: (t: string) => void;
  setTerminologies: (t: ModelTerminology[]) => void;
}) {
  const { t } = useTranslation('admin');

  return (
    <AddBlockWrapper>
      <Label htmlFor="terminologies" optionalText={t('optional')}>
        {t('terminologies-in-use')}
      </Label>

      {data.terminologies.map((terminology) => (
        <LanguageBlock key={terminology.uri} padding="m">
          <>
            <span>{terminology.label[locale]}</span>
            <br />

            <ExternalLink href={terminology.uri} labelNewWindow="">
              {terminology.uri}
            </ExternalLink>
            <Button
              variant="secondaryNoBorder"
              icon="remove"
              onClick={() => removeTerminology(terminology.uri)}
            >
              {t('remove')}
            </Button>
          </>
        </LanguageBlock>
      ))}
      <TerminologyModal
        setFormData={setTerminologies}
        addedTerminologies={data.terminologies}
      />

      <Label htmlFor="codes" optionalText={t('optional')}>
        {t('reference-data-in-use')}
      </Label>
      <Button variant="secondary" icon="plus" id="codes" disabled>
        {t('add-reference-data')}
      </Button>

      <Label htmlFor="data-models" optionalText={t('optional')}>
        {t('data-models-in-use')}
      </Label>
      <Button variant="secondary" icon="plus" id="data-models" disabled>
        {t('add-data-model')}
      </Button>

      <Label htmlFor="links" optionalText={t('optional')}>
        {t('links')}
      </Label>
      <Button variant="secondary" icon="plus" id="links" disabled>
        {t('add-new-link')}
      </Button>
    </AddBlockWrapper>
  );
}
