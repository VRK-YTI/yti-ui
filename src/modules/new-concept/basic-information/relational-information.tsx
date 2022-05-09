import Separator from '@app/common/components/separator';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { BasicInfoUpdate } from './concept-basic-information-interface';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';
import RelationalInformationBlock from './relational-information-block';

interface RelationalInformationProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
}

export default function RelationalInformation({
  infoKey,
  update,
}: RelationalInformationProps) {
  const { t } = useTranslation('admin');
  const [expandersData, setExpandersData] = useState<{
    [key: string]: Concepts[];
  }>({
    broaderConcept: [],
    narrowerConcept: [],
    relatedConcept: [],
    isPartOfConcept: [],
    hasPartConcept: [],
    relatedConceptInOther: [],
    matchInOther: [],
  });

  const updateData = (key: string, value: Concepts[]) => {
    const updated = { ...expandersData, [key]: value };
    setExpandersData(updated);
    update({ key: infoKey, value: updated });
  };

  return (
    <ConceptExpander>
      <ExpanderTitleButton asHeading="h3">
        {t('relational-information')}
      </ExpanderTitleButton>

      <ExpanderContentFitted>
        <RelationalInformationBlock
          infoKey={'broaderConcept'}
          title={t('broader-concept')}
          buttonTitle={t('broader-concept-add')}
          description={t('broader-concept-description')}
          chipLabel={t('broader-concept-chip-label')}
          data={expandersData}
          updateData={updateData}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          infoKey={'narrowerConcept'}
          title={t('narrower-concept')}
          buttonTitle={t('narrower-concept-add')}
          description={t('narrower-concept-description')}
          chipLabel={t('narrower-concept-chip-label')}
          data={expandersData}
          updateData={updateData}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          infoKey={'relatedConcept'}
          title={t('related-concept')}
          buttonTitle={t('related-concept-add')}
          description={t('related-concept-description')}
          chipLabel={t('related-concept-chip-label')}
          data={expandersData}
          updateData={updateData}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          infoKey={'isPartOfConcept'}
          title={t('is-part-of-concept')}
          buttonTitle={t('is-part-of-concept-add')}
          description={t('is-part-of-concept-description')}
          chipLabel={t('is-part-of-concept-chip-label')}
          data={expandersData}
          updateData={updateData}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          infoKey={'hasPartConcept'}
          title={t('has-part-concept')}
          buttonTitle={t('has-part-concept-add')}
          description={t('has-part-concept-decription')}
          chipLabel={t('has-part-concept-chip-label')}
          data={expandersData}
          updateData={updateData}
        />

        <Separator isLarge />

        <RelationalInformationBlock
          infoKey={'relatedConceptInOther'}
          title={t('related-concept-in-other')}
          buttonTitle={t('related-concept-in-other-add')}
          description={t('related-concept-in-other-description')}
          chipLabel={t('related-concept-in-other-chip-label')}
          updateData={updateData}
          data={expandersData}
          fromOther
        />

        <Separator isLarge />

        <RelationalInformationBlock
          infoKey={'matchInOther'}
          title={t('match-in-other')}
          buttonTitle={t('match-in-other-add')}
          description={t('match-in-other-description')}
          chipLabel={t('match-in-other-chip-label')}
          updateData={updateData}
          data={expandersData}
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
