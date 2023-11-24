import { useTranslation } from 'next-i18next';
import { ExternalLink, Button, Text, Label } from 'suomifi-ui-components';
import { List, ListItem } from './schema-list.styles';
import { Schema } from '@app/common/interfaces/schema.interface';
import { Grid, InputLabel } from '@mui/material';
import router from 'next/router';

export interface SchemaListProps {
  items: Partial<Schema>[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
  deleteDisabled: string[] | boolean;
}

export default function SchemaList({
  items,
  handleRemoval,

  labelRow,
  deleteDisabled,
}: SchemaListProps) {
  const { t } = useTranslation('admin');

  if (items && items.length < 1) {
    items = []; // initialize empty array
    return <div>{'There is no Schemas or Crosswalks to show'}</div>;
  }

  function handleClick(pid: string): void {
    console.log(pid);
    // will go the schema detail page
    router.push(`/schema/${pid}`);
  }

  return (
    //Creating Header row

    <div>
      <List className="header-list">
        <ListItem>
          <Grid container spacing={2} style={{ fontWeight: 'bold' }}>
            <Grid item xs={2}>
              {'Name'}
            </Grid>
            <Grid item xs={2}>
              {'Namespace'}
            </Grid>
            <Grid item xs={2}>
              {'Status'}
            </Grid>
            <Grid item xs={2}>
              {'Revision'}
            </Grid>
            <Grid item xs={2}>
              {'PID'}
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </ListItem>
      </List>
      <List className="inline-list">
        {items &&
          items.map((item) => (
            <ListItem
              key={item.pid}
              onClick={() => handleClick(item.pid)}
              onMouseEnter={() => item.onMouseEnter && item.onMouseEnter()}
              onMouseLeave={() => item.onMouseLeave && item.onMouseLeave()}
              onKeyDown={(e) => e.key === 'Enter' && item.onClick()}
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  {item.label}
                </Grid>
                <Grid item xs={2}>
                  {item.prefix}
                </Grid>
                <Grid item xs={2}>
                  {item.status}
                </Grid>
                <Grid item xs={2}>
                  {item.revision}
                </Grid>
                <Grid item xs={2}>
                  {item.pid}
                </Grid>
                <Grid item xs={2}>
                  {Array.isArray(deleteDisabled) &&
                  deleteDisabled.includes(item.pid) ? (
                    <></>
                  ) : (
                    <Button
                      variant="secondaryNoBorder"
                      icon="remove"
                      onClick={() => handleRemoval(item.pid)}
                    >
                      {t('remove')}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </ListItem>
          ))}
      </List>
    </div>
  );
}
