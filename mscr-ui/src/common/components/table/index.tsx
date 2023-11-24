import * as React from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import Separator from 'yti-common-ui/separator';
import SchemaList from '../schema-list';
import CrosswalkList from '../crosswalk-list';
import { useGetPersonalContentQuery } from '@app/common/components/personal/personal.slice';
import { Revision, Schema } from '@app/common/interfaces/schema.interface';

export default function BasicTable() {
  const { breakpoint } = useBreakpoints();
  const { data: schemaData, isLoading } = useGetPersonalContentQuery('SCHEMA');
  if (isLoading) return <div> Is Loading</div>;

  function getVersionLabel(id: string, revisions: Revision[]): string {
    return revisions.find((r) => r.pid == id)?.versionLabel ?? '';
  }

  const schemas = schemaData?.hits.hits.map((result) => {
    const info = result._source;
    const schema: Schema = {
      description: info.comment,
      label: info.label,
      // TODO: change when namespace in API
      namespace: info.prefix,
      organizations: info.organizations,
      pid: info.id,
      state: info.state,
      // TODO: change when API changed
      versionLabel: getVersionLabel(info.id, info.revisions)
    };
    return schema;
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
        items={[]}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></CrosswalkList>
    </div>
  );
}
