import * as React from 'react';
import Separator from 'yti-common-ui/separator';
import SchemaList from '../schema-list';
import CrosswalkList from '../crosswalk-list';
import { useGetPersonalContentQuery } from '@app/common/components/personal/personal.slice';
import { Schema } from '@app/common/interfaces/schema.interface';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';

export default function BasicTable() {
  const { data: schemaData, isLoading: schemaIsLoading } =
    useGetPersonalContentQuery('SCHEMA');
  const { data: crosswalkData, isLoading: crosswalkIsLoading } =
    useGetPersonalContentQuery('CROSSWALK');
  if (schemaIsLoading || crosswalkIsLoading) return <div> Is Loading</div>;

  const schemas = schemaData?.hits.hits.map((result) => {
    const info = result._source;
    const schema: Partial<Schema> = {
      label: info.label,
      namespace: info.namespace,
      pid: info.id,
      state: info.state,
      versionLabel: info.versionLabel,
    };
    return schema;
  });

  const crosswalks = crosswalkData?.hits.hits.map((result) => {
    const info = result._source;
    const crosswalk: Partial<Crosswalk> = {
      label: info.label,
      namespace: info.namespace,
      pid: info.id,
      state: info.state,
      versionLabel: info.versionLabel,
    };
    return crosswalk;
  });

  // console.log('schemaData: ', schemaData);
  // console.log('schemas: ', schemas);

  return (
    <div>
      {'Schemas'}
      <SchemaList
        items={schemas ?? []}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></SchemaList>

      {'Crosswalks'}

      <CrosswalkList
        items={crosswalks ?? []}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></CrosswalkList>
    </div>
  );
}
