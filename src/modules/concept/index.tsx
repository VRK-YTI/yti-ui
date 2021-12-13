import React from 'react';
import { useGetConceptQuery } from '../../common/components/concept/concept-slice';

interface ConceptProps {
  terminologyId: string;
  conceptId: string;
}

export default function Concept({ terminologyId, conceptId }: ConceptProps) {
  const { data: info } = useGetConceptQuery({ terminologyId, conceptId });

  return (
    <>
      {JSON.stringify(info)}
    </>
  );
};
