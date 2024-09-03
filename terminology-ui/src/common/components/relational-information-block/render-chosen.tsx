import { RelationInfoType } from '@app/modules/edit-concept/new-concept.types';
import { useTranslation } from 'next-i18next';
import { Chip, Label } from 'suomifi-ui-components';
import PropertyValue from '../property-value';
import { ChipBlock } from './relation-information-block.styles';
import { ConceptResponseObject } from '@app/common/interfaces/interfaces-v2';

interface RenderChosenProps {
  chosen: ConceptResponseObject[] | RelationInfoType[];
  setChosen: (value: ConceptResponseObject[] | RelationInfoType[]) => void;
  setShowChosen: (value: boolean) => void;
  chipLabel: string;
}

export default function RenderChosen({
  chosen,
  setChosen,
  setShowChosen,
  chipLabel,
}: RenderChosenProps) {
  const { t } = useTranslation('admin');
  const handleChipRemove = (
    chose: ConceptResponseObject | RelationInfoType
  ) => {
    const updatedChosen =
      'terminology' in chosen
        ? (chosen as ConceptResponseObject[]).filter((c) => c.id !== chose.id)
        : (chosen as RelationInfoType[]).filter((c) => c.id !== chose.id);
    setChosen(updatedChosen);

    if (updatedChosen.length < 1) {
      setShowChosen(false);
    }
  };

  return (
    <>
      <Label>{chipLabel}</Label>
      <ChipBlock id="chosen-concepts-block">
        {chosen.map((chose) => {
          return (
            <Chip
              removable
              onClick={() => handleChipRemove(chose)}
              key={chose.id}
            >
              <PropertyValue
                property={Object.keys(chose.label).map((lang) => ({
                  lang,
                  value: chose.label[lang],
                  regex: '',
                }))}
                stripHtml
                fallback={t('concept-label-undefined', { ns: 'common' })}
              />
            </Chip>
          );
        })}
      </ChipBlock>
    </>
  );
}
