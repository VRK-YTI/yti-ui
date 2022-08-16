import Separator from '@app/common/components/separator';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import { BasicInfoUpdate } from './concept-basic-information-types';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';
import RelationalInformationBlock from '../../../common/components/relational-information-block';
import { BasicInfo, RelationInfoType } from '../new-concept.types';

interface RelationalInformationProps {
  infoKey: string;
  update: (object: BasicInfoUpdate) => void;
  initialValues: BasicInfo['relationalInfo'];
}

export default function RelationalInformation({
  infoKey,
  update,
  initialValues,
}: RelationalInformationProps) {
  const { t } = useTranslation('admin');
  const [expandersData, setExpandersData] =
    useState<BasicInfo['relationalInfo']>(initialValues);

  const updateData = (key: string, value: RelationInfoType[]) => {
    const updated = { ...expandersData, [key]: value };
    setExpandersData(updated);
    update({ key: infoKey, value: updated });
  };

  return (
    <ConceptExpander id="relational-information-expander">
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
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
