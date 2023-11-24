import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Revision } from '@app/common/interfaces/schema.interface';

export default function HistoryTable({ headers, revisions, ariaLabel }: { headers: Array<string>; revisions: Revision[]; ariaLabel: string }) {
  return (
    <TableContainer>
      <Table aria-label={ariaLabel}>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {revisions.map((revision) => (
            <TableRow key={revision.versionLabel}>
              <TableCell>{revision.versionLabel}</TableCell>
              <TableCell>{revision.pid}</TableCell>
              <TableCell>{revision.created}</TableCell>
              <TableCell>{revision.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
