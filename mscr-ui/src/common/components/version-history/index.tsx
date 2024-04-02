import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useTranslation } from 'next-i18next';
import { ContentRevision } from '@app/common/interfaces/content-revision.interface';
import FormattedDate from 'yti-common-ui/components/formatted-date';

export default function VersionHistory({
  revisions,
}: {
  revisions: ContentRevision[];
}) {
  const { t } = useTranslation('common');
  const headers = [
    t('metadata.version-label'),
    t('metadata.pid'),
    t('metadata.created'),
    t('metadata.state'),
  ];
  return (
    <TableContainer>
      <Table aria-label={t('metadata.versions')}>
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
              <TableCell>
                <FormattedDate date={revision.created} />
              </TableCell>
              <TableCell>{revision.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
