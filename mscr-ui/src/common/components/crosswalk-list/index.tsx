import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import { List, ListItem } from './crosswalk-list.styles';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import router from 'next/router';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export interface CrosswalkListProps {
  items: Partial<Crosswalk>[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
  deleteDisabled: string[] | boolean;
}

export default function CrosswalkList({
  items
}: CrosswalkListProps) {
  const { t } = useTranslation('admin');

  if (items && items.length < 1) {
    items = [];
    return <div>{'There is no Crosswalks to show'}</div>;
  }

  function handleClick(pid: string) {
    // will go the crosswalk detail page
    router.push(`/crosswalk/${pid}`);
  }

  return (
    //Creating Header row
    <div>
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
                    {item.label?.en}
                    {/*getLanguageVersion({ data: item.label, lang })*/}
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
