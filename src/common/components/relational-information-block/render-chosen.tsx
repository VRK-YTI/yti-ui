import { Concepts } from '@app/common/interfaces/concepts.interface';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('admin');
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
        {chosen.map((chose, idx) => {
          return (
            <Chip
              removable
              onClick={() => handleChipRemove(chose)}
              key={`${chose.id}-${idx}`}
            >
              {chose.label
                ? chose.label.fi
                : t('concept-label-undefined', { ns: 'common' })}
            </Chip>
          );
        })}
      </ChipBlock>
    </>
  );
}
