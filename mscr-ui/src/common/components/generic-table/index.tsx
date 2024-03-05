import {
  Grid,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import * as React from 'react';
import {StyledTableCell, StyledTableRow, StyledTableHead} from '@app/common/components/generic-table/generic-table.styles';

// Usage: items can be an array of typed items e.g. FilesRow[]. Heading names are taken from the interface property names. Headings can be over-ridden with using headings array.

export default function GenericTable(props: {
  items: any;
  headings: string[];
  caption: string;
}) {

  function createColumnHeadings(items: any) {
    const head: JSX.Element[] = [];
    const cells: JSX.Element[] = [];
    if (props.headings && props.headings.length > 0) {
      // Take heading names from headings array
      props.headings.forEach((heading) => {
        cells.push(
          <StyledTableCell key={self.crypto.randomUUID()}>
            {heading}
          </StyledTableCell>,
        );
      });
      head.push(
        <StyledTableHead key={self.crypto.randomUUID()}>
          <StyledTableRow key={self.crypto.randomUUID()}>
            {cells}
          </StyledTableRow>
        </StyledTableHead>,
      );
    } else if (items.length > 0) {
      // Take heading names from interface property names
      for (const [key, value] of Object.entries(items[0])) {
        cells.push(
          <StyledTableCell key={self.crypto.randomUUID()}>
            {key[0].toUpperCase() + key.slice(1)}
          </StyledTableCell>,
        );
      }
      head.push(
        <StyledTableHead key={self.crypto.randomUUID()}>
          <StyledTableRow key={self.crypto.randomUUID()}>{cells}</StyledTableRow>
        </StyledTableHead>,
      );
    }
    return head;
  }

  function createColumns(items: any) {
    const rows: JSX.Element[] = [];
    items.forEach((col: { [s: string]: unknown }) => {
      const temp = [];
      for (const [key, value] of Object.entries(col)) {
        temp.push(
          <StyledTableCell key={self.crypto.randomUUID()}>
            {value}
          </StyledTableCell>,
        );
      }
      rows.push(
        <StyledTableRow key={self.crypto.randomUUID()}>{temp}</StyledTableRow>,
      );
    });
    return <TableBody>{rows}</TableBody>;
  }

  return (
    <>
      <Grid container direction="row">
        <Grid container>
          <h2>{props.caption}</h2>
        </Grid>
        <TableContainer >
          <Table aria-label={props.caption}>
            {createColumnHeadings(props.items)}
            {createColumns(props.items)}
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
