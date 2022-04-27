import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from 'suomifi-ui-components';
import ConceptInfoList from './concept-info-block-list';

interface NotesProps {
  update: (value: any) => void;
}

export function Notes({ update }: NotesProps) {
  const { t } = useTranslation('admin');
  const [notes, setNotes] = useState<number[]>([]);
  const [id, setId] = useState<number>(0);

  const handleArrayUpdate = (id: number) => {
    const updatedNotes = notes.filter((note) => note !== id);
    setNotes(updatedNotes);
    update({ key: 'note', value: updatedNotes});
  };

  const handleClick = () => {
    setNotes([...notes, id]);
    update({ key: 'note', value: [...notes, id] });
    setId(id + 1);
  };

  return (
    <BasicBlock
      largeWidth
      title={t('note')}
      extra={
        <BasicBlockExtraWrapper>
          <ConceptInfoList
            list={notes}
            parent={'note'}
            setList={handleArrayUpdate}
          />

          <Button
            variant="secondary"
            onClick={() => handleClick()}
          >
            {t('add-new-note')}
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      {t('new-note-description')}
    </BasicBlock>
  );
}
