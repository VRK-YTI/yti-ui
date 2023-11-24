import * as React from 'react';
import Separator from 'yti-common-ui/separator';
import SchemaList from '../schema-list';
import CrosswalkList from '../crosswalk-list';
import { useGetPersonalContentQuery } from '@app/common/components/personal/personal.slice';
import { Revision, Schema } from '@app/common/interfaces/schema.interface';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';

export default function BasicTable() {
  const { data: schemaData, isLoading: schemaIsLoading } = useGetPersonalContentQuery('SCHEMA');
  const { data: crosswalkData, isLoading: crosswalkIsLoading } = useGetPersonalContentQuery('CROSSWALK');
  if (schemaIsLoading || crosswalkIsLoading) return <div> Is Loading</div>;

  function getVersionLabel(id: string, revisions: Revision[]): string {
    return revisions.find((r) => r.pid == id)?.versionLabel ?? '';
  }

  const schemas = schemaData?.hits.hits.map((result) => {
    const info = result._source;
    const schema: Partial<Schema> = {
      label: info.label,
      // TODO: change when namespace in API
      namespace: info.prefix,
      pid: info.id,
      state: info.state,
      // TODO: change when API changed
      versionLabel: getVersionLabel(info.id, info.revisions)
    };
    return schema;
  });

  const crosswalks = crosswalkData?.hits.hits.map((result) => {
    const info = result._source;
    const crosswalk: Partial<Crosswalk> = {
      label: info.label,
      // TODO: change when namespace in API
      namespace: info.prefix,
      pid: info.id,
      state: info.state,
      // TODO: change when API changed
      versionLabel: getVersionLabel(info.id, info.revisions)
    };
    return crosswalk;
  });

  console.log('schemaData: ', schemaData);
  console.log('schemas: ', schemas);

  return (
    <div>
      {'Schemas'}
      <Separator isLarge />
      <SchemaList
        items={schemas ?? []}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></SchemaList>
      <Separator isLarge />
      {'Crosswalks'}
      <Separator isLarge />

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
