import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Dropdown, DropdownItem } from 'suomifi-ui-components';
import { NoteBlock, NoteTextarea } from './notes.styles';

export function Notes() {
  const { t } = useTranslation('admin');
  const [notes, setNotes] = useState<number[]>([]);
  const [id, setId] = useState<number>(0);

  return (
    <BasicBlock
      largeWidth
      title={t('note')}
      extra={
        <BasicBlockExtraWrapper>
          {notes.map(id => {
            return Note(id);
          })}

          <Button
            variant='secondary'
            onClick={() => {
              setNotes([...notes, id]);
              setId(id + 1);
            }}
          >
            {t('add-new-note')}
          </Button>
        </BasicBlockExtraWrapper>
      }
    >
      {t('new-note-description')}
    </BasicBlock>
  );

  function Note(id: number) {
    const handleClick = () => {
      setNotes(notes.filter(note => note !== id));
    };

    return (
      <NoteBlock>
        <div className='top-row'>
          <Dropdown labelText='Kieli' defaultValue='fi'>
            <DropdownItem value='fi'>
              suomi
            </DropdownItem>
            <DropdownItem value='sv'>
              ruotsi
            </DropdownItem>
            <DropdownItem value='en'>
              englanti
            </DropdownItem>
          </Dropdown>

          <Button
            variant='secondaryNoBorder'
            icon='remove'
            onClick={() => handleClick()}
          >
            Poista
          </Button>
        </div>

        <NoteTextarea
          labelText='Käsitteeseen liittyvä huomautus'
          visualPlaceholder='Kirjoita huomautus'
        />
      </NoteBlock>
    );
  }

}
