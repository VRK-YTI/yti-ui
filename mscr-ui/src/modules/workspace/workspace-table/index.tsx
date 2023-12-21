import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';

export interface TableContent {
  ariaLabel: string;
  headers: {
    headerKey: string;
    text: string;
  }[];
  rows?: {
    linkUrl: string;
    rowKey: string;
    rowContent: {
      cellKey: string;
      cellContent: string;
    }[];
  }[];
}

export default function WorkspaceTable({ content }: { content: TableContent }) {
  return (
    <TableContainer>
      <Table aria-label={content.ariaLabel}>
        <TableHead>
          <TableRow>
            {content.headers.map((header) => (
              <TableCell key={header.headerKey}>{header.text}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {content.rows?.map((row) => (
            <Link key={row.rowKey} href={row.linkUrl} passHref>
              <TableRow
                component={'a'}
                hover
                sx={{ cursor: 'pointer', textDecoration: 'none'}}
              >
                {row.rowContent.map((cell) => (
                  <TableCell key={cell.cellKey}>{cell.cellContent}</TableCell>
                ))}
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
