import {useTranslation} from 'next-i18next';
import {useMemo} from 'react';
import {Schema} from '@app/common/interfaces/schema.interface';
import router from 'next/router';
import {
  DescriptionList,
  DescriptionListTitle
} from '@app/modules/schema-view/metadata-and-files/metadata-and-files.styles';
import {Grid} from '@mui/material';
import {Heading} from 'suomifi-ui-components';

export default function MetadataAndFiles({ schemaDetails }: { schemaDetails?: Schema }) {
  const { t } = useTranslation('common');
  const lang = router.locale;

  // TODO: Only edit with permission, we have util has-permission
  // TODO: Get organization names neatly
  // Locale: Object.entries(schemaDetails.label).find((t) => t[0] === lang)?.[1] ?? ''
  // Organization: see datamodel-ui/src/modules/model/model-info-view.tsx
  interface SchemaDisplay {
    [key:string]: string;
  }
  const schemaDisplay : SchemaDisplay = useMemo(() => {
    if (!schemaDetails) {
      return (
        {
          schemaPid: '',
          schemaLabel: '',
          schemaDescription: '',
          schemaCreated: '',
          schemaModified: '',
          schemaState: '',
          schemaOrganizations: '',
          schemaVisibility: '',
          schemaFormat: '',
          schemaVersionLabel: '',
          schemaNamespace: ''
        }
      );
    }

    return (
      {
        schemaPid: schemaDetails?.pid ?? '',
        schemaLabel: schemaDetails?.label ? Object.entries(schemaDetails.label).find((t) => t[0] === lang)?.[1] ?? '' : '',
        schemaDescription: schemaDetails?.description ? Object.entries(schemaDetails.description).find((t) => t[0] === lang)?.[1] ?? '' : '',
        schemaCreated: schemaDetails?.created ?? '',
        schemaModified: schemaDetails?.modified ?? '',
        schemaState: schemaDetails?.state ?? '',
        schemaOrganizations: schemaDetails?.organizations.toString() ?? '',
        schemaVisibility: schemaDetails?.visibility ?? '',
        schemaFormat: schemaDetails?.format ?? '',
        schemaVersionLabel: schemaDetails?.versionLabel ?? '',
        schemaNamespace: schemaDetails?.namespace ?? ''
      }
    );
  }, [schemaDetails, lang]);

  return (
    <>
      <Heading variant='h2'>{t('schema.metadata')}</Heading>
      <DescriptionList>
        <Grid container spacing={2}>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.name')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaLabel}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.description')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaDescription}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.pid')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaPid}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.version')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaVersionLabel}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.created')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaCreated}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.modified')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaModified}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.state')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaState}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.visibility')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaVisibility}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.format')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaFormat}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.namespace')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaNamespace}
            </dd>
          </Grid>

          <Grid item xs={1}>
            <DescriptionListTitle>
              {t('schema.organizations')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={11}>
            <dd>
              {schemaDisplay.schemaOrganizations}
            </dd>
          </Grid>

        </Grid>
      </DescriptionList>
      <div>TABLE HERE{/* TODO: Display schema files */}</div>
    </>
  );
}
