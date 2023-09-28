import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableWrapper } from './table.styles';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { useGetSchemasQuery } from '../schema/schema.slice';
import InlineList from '../inline-list';
import Separator from 'yti-common-ui/separator';

/*const rows = [
  createData('MARC to MODS', 'Not registered', 'draft', '1.1.1.1'),
  createData('DTC to EML', 'Registered', '1.1', '2.2.2.2'),
  createData('DataCite to Dublin Core', 'Registered', '1.1', '3.3.3.3'),
  createData('Type to Othertype', 'Registered', '1.1', '4.4.4.4'),
];*/

export default function BasicTable() {
  const { breakpoint } = useBreakpoints();
  const { data, isLoading } = useGetSchemasQuery('');
  if (isLoading) return <div> Is Loading</div>;

  return (
    <div>
      {'Schemas'}
      
      <Separator isLarge />
      <InlineList
        items={data}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></InlineList>
      <Separator isLarge />
      {'Crosswalks'}
      <Separator isLarge />
      <InlineList
        items={data}
        handleRemoval={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
        deleteDisabled={false}
      ></InlineList>
    </div>
  );
}
