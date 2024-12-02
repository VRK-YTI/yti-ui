import { RelationInfoType } from '@app/modules/edit-concept/new-concept.types';
import { i18n } from 'next-i18next';
import { Chip, Label } from 'suomifi-ui-components';
import { ChipBlock } from './relation-information-block.styles';
import { ConceptResponseObject } from '@app/common/interfaces/interfaces-v2';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

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
              {getLanguageVersion({
                data: chose.label,
                lang: i18n?.language,
              })}
            </Chip>
          );
        })}
      </ChipBlock>
    </>
  );
}
