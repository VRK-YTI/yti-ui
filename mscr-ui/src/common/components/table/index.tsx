import * as React from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useGetSchemasQuery } from '../schema/schema.slice';
import Separator from 'yti-common-ui/separator';
import SchemaList from '../schema-list';
import CrosswalkList from '../crosswalk-list';

export default function BasicTable() {
  const { breakpoint } = useBreakpoints();
  const { data, isLoading } = useGetSchemasQuery('');
  if (isLoading) return <div> Is Loading</div>;

  return (
    <div>
      {'Schemas'}
      <Separator isLarge />
      <SchemaList
        items={data}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></SchemaList>
      <Separator isLarge />
      {'Crosswalks'}
      <Separator isLarge />

      <CrosswalkList
        items={data}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></CrosswalkList>
    </div>
  );
}
