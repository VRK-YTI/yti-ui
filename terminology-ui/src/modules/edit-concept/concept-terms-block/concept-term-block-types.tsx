export interface ConceptTermType {
  changeNote: string; // Muutoshistoria
  editorialNote: ItemType[];
  historyNote: string;
  id: string;
  language: string;
  prefLabel: string;
  scope: string; // Käyttöala
  source: ItemType[];
  status: string;
  termConjugation: string; // Termin luku
  termEquivalency: string; // Termin vastaavuus
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
  key: string;
  value: string | ItemType[];
}
