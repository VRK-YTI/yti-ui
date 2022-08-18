import { Concepts } from '@app/common/interfaces/concepts.interface';
import { Chip, Label } from 'suomifi-ui-components';
import PropertyValue from '../property-value';
import { ChipBlock } from './relation-information-block.styles';

interface RenderChosenProps {
  chosen: Concepts[];
  setChosen: (value: Concepts[]) => void;
  setShowChosen: (value: boolean) => void;
  chipLabel: string;
}

export default function RenderChosen({
  chosen,
  setChosen,
  setShowChosen,
  chipLabel,
}: RenderChosenProps) {
  const handleChipRemove = (chose: Concepts) => {
    const updatedChosen = chosen.filter((c) => c.id !== chose.id);
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
              />
            </Chip>
          );
        })}
      </ChipBlock>
    </>
  );
}
