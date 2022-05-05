import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import {
  Checkbox,
  CheckboxGroup,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';
import RelationalInformationBlock from './relational-information-block';

export default function RelationalInformation() {
  const { t } = useTranslation('admin');

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('relational-information')}
      </ExpanderTitleButton>

      <ExpanderContentFitted>
        <RelationalInformationBlock
          title={t('broader-concept')}
          buttonTitle={t('broader-concept-add')}
          description={t('broader-concept-description')}
          chipLabel={t('broader-concept-chip-label')}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={t('narrower-concept')}
          buttonTitle={t('narrower-concept-add')}
          description={t('narrower-concept-description')}
          chipLabel={t('narrower-concept-chip-label')}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={t('related-concept')}
          buttonTitle={t('related-concept-add')}
          description={t('related-concept-description')}
          chipLabel={t('related-concept-chip-label')}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={t('is-part-of-concept')}
          buttonTitle={t('is-part-of-concept-add')}
          description={t('is-part-of-concept-description')}
          chipLabel={t('is-part-of-concept-chip-label')}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={t('has-part-concept')}
          buttonTitle={t('has-part-concept-add')}
          description={t('has-part-concept-decription')}
          chipLabel={t('has-part-concept-chip-label')}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={t('related-concept-in-other')}
          buttonTitle={t('related-concept-in-other-add')}
          description={t('related-concept-in-other-description')}
          chipLabel={t('related-concept-in-other-chip-label')}
          fromOther
        />

        <Separator isLarge />

        <RelationalInformationBlock
          title={t('match-in-other')}
          buttonTitle={t('match-in-other-add')}
          description={t('match-in-other-description')}
          chipLabel={t('match-in-other-chip-label')}
          fromOther
        />

        <Separator isLarge />

        <CheckboxGroup
          labelText="Valitse homonyymit muista sanastoista"
          groupHintText="Muissa sanastoissa on käsitteitä, jotka vastaavat tätä käsitettä. Valitse ne, jotka haluat näytettävän käsitteesi yhteydessä."
        >
          <Checkbox hintText="Patentti- ja rekisterihallituksen sanasto">
            hakemus
          </Checkbox>
          <Checkbox hintText="Opetus- ja koulutussanasto, 2. laitos">
            hakemus
          </Checkbox>
          <Checkbox hintText="Julkisen hallinnon yhteinen sanasto">
            hakemus
          </Checkbox>
        </CheckboxGroup>
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
