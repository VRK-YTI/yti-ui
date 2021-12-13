import React from 'react';
import { useGetCollectionQuery } from '../../common/components/collection/collection-slice';

interface CollectionProps {
  terminologyId: string;
  collectionId: string;
}

export default function Collection({ terminologyId, collectionId }: CollectionProps) {
  const { data: info } = useGetCollectionQuery({ terminologyId, collectionId });

  return (
    <>
      {JSON.stringify(info)}
    </>
  );
};
