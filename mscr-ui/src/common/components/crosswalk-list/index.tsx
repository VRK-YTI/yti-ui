import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import { List, ListItem } from './crosswalk-list.styles';
import { Grid } from '@mui/material';
import router from 'next/router';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';

export interface CrosswalkListProps {
  items: Partial<Crosswalk>[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
  deleteDisabled: string[] | boolean;
}

export default function CrosswalkList({
  items,
  handleRemoval,
  deleteDisabled,
}: CrosswalkListProps) {
  const { t } = useTranslation('admin');

  if (items && items.length < 1) {
    return <div>{'There is no Crosswalks to show'}</div>;
  }

  function handleClick(pid: string) {
    // will go the crosswalk detail page
    router.push('/crosswalk');
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
                  {item.namespace}
                </Grid>
                <Grid item xs={2}>
                  {item.status}
                </Grid>
                <Grid item xs={2}>
                  {item.versionLabel}
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
