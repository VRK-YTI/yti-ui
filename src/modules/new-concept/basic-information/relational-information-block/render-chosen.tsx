import { Chip, Label } from 'suomifi-ui-components';
import { ChipBlock } from './relation-information-block.styles';

export default function RenderChosen(chosen, setChosen, setShowChosen) {
  const handleChipRemove = (chose) => {
    const updatedChosen = chosen.filter((c) => c.id !== chose.id);
    setChosen(updatedChosen);

    if (updatedChosen.length < 1) {
      setShowChosen(false);
    }
  };

  return (
    <>
      <Label>Valitut hierarkkiset alakäsitteet</Label>
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
