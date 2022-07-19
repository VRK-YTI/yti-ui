export interface ConceptTermType {
  changeNote: string; // Muutoshistoria
  draftComment: string; // !! luultavasti turha !!
  editorialNote: ItemType[];
  historyNote: string;
  id: string;
  language: string;
  prefLabel: string;
  scope: string; // Käyttöala
  source: string;
  status: string;
  termConjugation: string; // Termin luku
  termEquivalency: string; // Termin vastaavuus
  termEquivalencyRelation: string; // Termi, johon vastaavuus liittyy
  termFamily: string;
  termHomographNumber: string;
  termInfo: string; // Termin lisätieto
  termStyle: string;
  termType: string;
  wordClass: string;
}

export interface ItemType {
  id: string;
  lang?: string;
  value: string;
}

export interface ConceptTermUpdateProps {
  termId: string;
  key: keyof ConceptTermType;
  value: string | ItemType[];
}
