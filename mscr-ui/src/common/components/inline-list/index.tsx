import { useTranslation } from 'next-i18next';
import { ExternalLink, Button, Text, Label } from 'suomifi-ui-components';
import { List, ListItem } from './inline-list.styles';
import { Schema } from '@app/common/interfaces/schema.interface';
import { Grid, InputLabel } from '@mui/material';

export interface InlineListProps {
  items: Schema[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
  deleteDisabled: string[] | boolean;
}

export default function InlineList({
  items,
  handleRemoval,
  labelRow,
  deleteDisabled,
}: InlineListProps) {
  const { t } = useTranslation('admin');

  if (items.length < 1) {
    return <div>
      {"There is no Schemas or Crosswalks to show"}
    </div>;
  }

  return (
    //Creating Header row

    <div>
      <List className="header-list">
     
        <ListItem>
          <Grid container spacing={2} style={{"fontWeight":"bold"}}>
            <Grid item xs={2}  >
              {"Name"}</Grid> 
              <Grid item xs={2}>
              {"Namespace"}</Grid> 
              <Grid item xs={2}>
              {"Status"}</Grid> 
              <Grid item xs={2}>
              {"Revision"}</Grid> 
              <Grid item xs={2}>
              {"PID"}</Grid> 
            <Grid item xs={2}>
           
              </Grid> 
          </Grid>
        </ListItem>
    </List>
    <List className="inline-list">
      {items.map((item) => (
        <ListItem key={item.pid}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              {item.label}</Grid> 
              <Grid item xs={2}>
              {item.prefix}</Grid> 
              <Grid item xs={2}>
              {item.status}</Grid> 
              <Grid item xs={2}>
              {item.revision}</Grid> 
              <Grid item xs={2}>
              {item.pid}</Grid> 
            <Grid item xs={2}>
            {Array.isArray(deleteDisabled) && deleteDisabled.includes(item.pid) ? (
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
