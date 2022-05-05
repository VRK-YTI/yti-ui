import { Concepts } from '@app/common/interfaces/concepts.interface';
import { Chip, Label } from 'suomifi-ui-components';
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
      <ChipBlock>
        {chosen.map((chose, idx) => {
          return (
            <Chip
              removable
              onClick={() => handleChipRemove(chose)}
              key={`${chose}-${idx}`}
            >
              {chose.label.fi}
            </Chip>
          );
        })}
      </ChipBlock>
    </>
  );
}
