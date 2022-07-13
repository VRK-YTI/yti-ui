import { useState } from 'react';
import ConceptInfoBlock from '../basic-information/concept-info-block';

export default function NotesBlock() {
  const [notes, setNotes] = useState<string[]>([]);

  return (
    <ConceptInfoBlock
      infoKey="notes"
      update={() => setNotes}
      key="id"
      noLangOption={true}
    />
  );
}
