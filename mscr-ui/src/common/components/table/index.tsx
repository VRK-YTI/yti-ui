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

function createData(
  name: string,
  status: string,
  version: string,
  pid: string
) {
  return { name, status, version, pid };
}

const rows = [
  createData('MARC to MODS', 'Not registered', 'draft', '1.1.1.1'),
  createData('DTC to EML', 'Registered', '1.1', '2.2.2.2'),
  createData('DataCite to Dublin Core', 'Registered', '1.1', '3.3.3.3'),
  createData('Type to Othertype', 'Registered', '1.1', '4.4.4.4'),
];

export default function BasicTable() {
  const { breakpoint } = useBreakpoints();
  return (
    <TableWrapper $breakpoint={breakpoint} id="table-main">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name </TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Version</TableCell>
              <TableCell align="left">PID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.status}</TableCell>
                <TableCell align="left">{row.version}</TableCell>
                <TableCell align="left">{row.pid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </TableWrapper>
  );
}
