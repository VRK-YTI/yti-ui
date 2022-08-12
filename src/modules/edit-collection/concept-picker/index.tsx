import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Button, Chip } from 'suomifi-ui-components';
import { EditCollectionFormDataType } from '../edit-collection.types';
import { SelectedConceptBlock } from './concept-picker.styles';
import PickerModal from './picker-modal';

interface ConceptPickerProps {
  formConcepts: EditCollectionFormDataType['concepts'];
  terminologyId: string;
  setFormConcepts: (value: EditCollectionFormDataType['concepts']) => void;
}

export default function ConceptPicker({
  formConcepts,
  terminologyId,
  setFormConcepts,
}: ConceptPickerProps) {
  const { t, i18n } = useTranslation('collection');
  const [visible, setVisible] = useState(false);
  const [concepts, setConcepts] =
    useState<EditCollectionFormDataType['concepts']>(formConcepts);

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
            <Button variant="secondary" onClick={() => handleClick()} id="add-concepts-button">
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
              <SelectedConceptBlock id="selected-concept-chips-block">
                {concepts.map((concept) => (
                  <Chip
                    key={`concept-${concept.id}`}
                    onClick={() =>
                      setConcepts(concepts.filter((c) => c.id !== concept.id))
                    }
                    removable
                  >
                    {concept.prefLabels[i18n.language] ??
                      concept.prefLabels['fi'] ??
                      concept.prefLabels[Object.keys(concept.prefLabels)[0]] ??
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
