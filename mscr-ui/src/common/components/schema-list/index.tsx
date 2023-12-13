import { useTranslation } from 'next-i18next';
import { ExternalLink, Button, Text, Label } from 'suomifi-ui-components';
import { List, ListItem } from './schema-list.styles';
import { Schema } from '@app/common/interfaces/schema.interface';
import {
  Grid,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import router from 'next/router';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export interface SchemaListProps {
  items: Partial<Schema>[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
  deleteDisabled: string[] | boolean;
}

export default function SchemaList({ items }: SchemaListProps) {
  const { t } = useTranslation('admin');
  const lang = router.locale ?? '';

  if (items && items.length < 1) {
    items = []; // initialize empty array
    return <div>{'There is no Schemas to show'}</div>;
  }

  function handleClick(pid: string): void {
    // will go the schema detail page
    if (pid) {
      router.push(`/schema/${pid}`);
    }
  }

  return (
    //Creating Header row

    <div>
      <Typography marginTop={5}>
        {'Schemas'}
      </Typography>
      <TableContainer>
        <Table aria-label={'Schemas'}>
          <TableHead>
            <TableRow>
              <TableCell> {'Name'}</TableCell>
              <TableCell>{'Namespace'}</TableCell>
              <TableCell>{'Status'}</TableCell>
              <TableCell>{'Revision'}</TableCell>
              <TableCell>{'PID'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/*TODO: Use the below template to create lines for files*/}
            {items &&
              items.map((item) => (
                <TableRow
                  key={item.pid}
                  hover={true}
                  onClick={() => handleClick(item.pid)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    {' '}
                    {getLanguageVersion({ data: item.label, lang })}
                  </TableCell>
                  <TableCell>{item.namespace}</TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell>{item.versionLabel}</TableCell>
                  <TableCell>{item.pid}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
