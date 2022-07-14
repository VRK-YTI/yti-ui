import ConceptInfoBlock from '../basic-information/concept-info-block';

interface NotesBlockProps {
  update: (key: string, value?: string | string[] | null) => void;
}

export default function NotesBlock({ update }: NotesBlockProps) {
  const handleUpdate = (e: { key: string; value: string[] }) => {
    update('editorialNote', e.value);
  };

  return (
    <ConceptInfoBlock
      infoKey="notes"
      update={handleUpdate}
      noLangOption={true}
    />
  );
}
