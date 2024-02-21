import {
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import * as React from 'react';

// Usage: items can be an array of typed items e.g. FilesRow[]. Heading names are taken from the interface property names. Headings can be over-ridden with using headings array.

export default function GenericTable(props: {
  items: any;
  headings: [];
  caption: string;
}) {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({}));

  const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: '#fff',
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#fff',
    td: { border: 0 },
    a: {
      color: '#3D6DB6',
      textDecoration: 'none',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#EAF2FA',
    },
    '&:first-of-type th, &:first-of-type thead': {
      fontWeight: 700,
      borderBottom: '3px solid #3D6DB6',
      backgroundColor: '#fff',
    },
    '&.MuiTableRow-hover:hover': {
      opacity: '1',
    },
  }));

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
        <StyledTableHead>
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
          <StyledTableRow>{cells}</StyledTableRow>
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
        <TableContainer>
          <Table aria-label={props.caption}>
            {createColumnHeadings(props.items)}
            {createColumns(props.items)}
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
