import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Chip } from 'suomifi-ui-components';
import { EditCollectionFormDataType } from '../edit-collection.types';
import { SelectedConceptBlock } from './concept-picker.styles';
import PickerModal from './picker-modal';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

interface ConceptPickerProps {
  concepts: EditCollectionFormDataType['concepts'];
  terminologyId: string;
  onChange: (value: EditCollectionFormDataType['concepts']) => void;
}

export default function ConceptPicker({
  concepts,
  terminologyId,
  onChange,
}: ConceptPickerProps) {
  const { t, i18n } = useTranslation('collection');
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };

  return (
    <>
      <BasicBlock
        title={t('concepts-in-collection')}
        extra={
          <BasicBlockExtraWrapper>
            <Button
              variant="secondary"
              onClick={() => handleClick()}
              id="add-concepts-button"
            >
              {t('add-concept-to-collection')}
            </Button>
            {visible && (
              <PickerModal
                setVisible={setVisible}
                terminologyId={terminologyId}
                orgConcepts={concepts}
                setConcepts={onChange}
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
                    key={`concept-${concept.identifier}`}
                    onClick={() =>
                      onChange(concepts.filter((c) => c.uri !== concept.uri))
                    }
                    removable
                  >
                    {getLanguageVersion({
                      data: concept.label,
                      lang: i18n.language,
                    })}
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
