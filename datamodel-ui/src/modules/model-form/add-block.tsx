import { ModelFormType } from '@app/common/interfaces/model-form.interface';
import { useTranslation } from 'next-i18next';
import { Button, ExternalLink, Label } from 'suomifi-ui-components';
import { LanguageBlock } from 'yti-common-ui/form/language-selector.styles';
import TerminologyModal from '../terminology-modal';
import { AddBlockWrapper } from './model-form.styles';

export default function AddBlock({
  data,
  locale,
  setTerminologies,
}: {
  data: ModelFormType;
  locale: string;
  setTerminologies: (t: string) => void;
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
            <span>
              {locale} {terminology.label[locale]}
            </span>
            <br />

            <ExternalLink href={terminology.uri} labelNewWindow="">
              {terminology.uri}
            </ExternalLink>
            <Button
              variant="secondaryNoBorder"
              icon="remove"
              onClick={() => setTerminologies(terminology.uri)}
            >
              Poista
            </Button>
          </>
        </LanguageBlock>
      ))}
      <TerminologyModal />

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
