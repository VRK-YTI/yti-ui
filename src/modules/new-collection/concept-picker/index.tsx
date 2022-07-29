import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button, Chip } from 'suomifi-ui-components';
import { SelectedConceptBlock } from './concept-picker.styles';
import PickerModal from './picker-modal';

interface ConceptPickerProps {
  terminologyId: string;
  setFormConcepts: (value: Concepts[]) => void;
}

export default function ConceptPicker({
  terminologyId,
  setFormConcepts,
}: ConceptPickerProps) {
  const { t, i18n } = useTranslation('collection');
  const [visible, setVisible] = useState(false);
  const [concepts, setConcepts] = useState<Concepts[]>([]);

  const handleClick = () => {
    setVisible(true);
  };

  useEffect(() => {
    setFormConcepts(concepts);
  }, [concepts, setFormConcepts]);

  return (
    <>
      <BasicBlock
        title={t('concepts-in-collection')}
        extra={
          <BasicBlockExtraWrapper>
            <Button variant="secondary" onClick={() => handleClick()}>
              {t('add-concept-to-collection')}
            </Button>
            {visible && (
              <PickerModal
                setVisible={setVisible}
                terminologyId={terminologyId}
                orgConcepts={concepts}
                setConcepts={setConcepts}
              />
            )}
          </BasicBlockExtraWrapper>
        }
      >
        {t('add-concept-hint-text')}
      </BasicBlock>

      {concepts.length > 0 && (
        <BasicBlock
          title={t('collections-selected-concepts')}
          extra={
            <BasicBlockExtraWrapper>
              <SelectedConceptBlock>
                {concepts.map((concept) => (
                  <Chip
                    key={`concept-${concept.id}`}
                    onClick={() =>
                      setConcepts(concepts.filter((c) => c.id !== concept.id))
                    }
                    removable
                  >
                    {concept.label[i18n.language] ??
                      concept.label.fi ??
                      concept.label[Object.keys(concept.label)[0]] ??
                      ''}
                  </Chip>
                ))}
              </SelectedConceptBlock>
            </BasicBlockExtraWrapper>
          }
        >
          <></>
        </BasicBlock>
      )}
    </>
  );
}
