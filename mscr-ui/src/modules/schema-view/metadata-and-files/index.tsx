import { useTranslation } from 'next-i18next';
import * as React from 'react';
import { useMemo } from 'react';
import {
  SchemaFileData,
  SchemaWithVersionInfo,
} from '@app/common/interfaces/schema.interface';
import { useRouter } from 'next/router';
import {
  DescriptionList,
  DescriptionListTitle,
} from '@app/modules/schema-view/metadata-and-files/metadata-and-files.styles';
import { Grid } from '@mui/material';
import { Heading } from 'suomifi-ui-components';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import getOrganizations from '@app/common/utils/get-organizations';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import MetadataFilesTable from '@app/common/components/metadata-files-table';

export default function MetadataAndFiles({
  schemaDetails,
  schemaFiles,
}: {
  schemaDetails?: SchemaWithVersionInfo;
  schemaFiles?: SchemaFileData[];
}) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? '';

  if (schemaDetails?.fileMetadata) {
    // console.log(schemaDetails.fileMetadata);
    schemaFiles = schemaDetails.fileMetadata;
  } else {
    schemaFiles = [];
  }

  // TODO: Editing -> Only edit with permission, we have util has-permission

  interface SchemaDisplay {
    [key: string]: string;
  }
  const schemaDisplay: SchemaDisplay = useMemo(() => {
    if (!schemaDetails) {
      return {
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
        schemaNamespace: '',
      };
    }
    const organizations = getOrganizations(schemaDetails.organizations, lang)
      .map((org) => org.label)
      .join(', ');
    return {
      schemaPid: schemaDetails?.pid ?? '',
      schemaLabel: schemaDetails?.label
        ? getLanguageVersion({
            data: schemaDetails.label,
            lang,
            appendLocale: true,
          })
        : '',
      schemaDescription: schemaDetails?.description
        ? getLanguageVersion({
            data: schemaDetails.description,
            lang,
            appendLocale: true,
          }) ?? ''
        : '',
      schemaCreated: schemaDetails?.created ?? '',
      schemaModified: schemaDetails?.modified ?? '',
      schemaState: schemaDetails?.state ?? '',
      schemaOrganizations: organizations,
      schemaVisibility: schemaDetails?.visibility ?? '',
      schemaFormat: schemaDetails?.format ?? '',
      schemaVersionLabel: schemaDetails?.versionLabel ?? '',
      schemaNamespace: schemaDetails?.namespace ?? '',
    };
  }, [schemaDetails, lang]);

  return (
    <>
      <Heading variant="h2">{t('metadata.metadata')}</Heading>
      <DescriptionList>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <DescriptionListTitle>{t('metadata.name')}</DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaLabel}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>
              {t('metadata.description')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaDescription}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>{t('metadata.pid')}</DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaPid}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>
              {t('metadata.version-label')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaVersionLabel}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>{t('metadata.created')}</DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaCreated}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>
              {t('metadata.modified')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaModified}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>{t('metadata.state')}</DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaState}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>
              {t('metadata.visibility')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaVisibility}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>{t('metadata.format')}</DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaFormat}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>
              {t('metadata.namespace')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaNamespace}</dd>
          </Grid>

          <Grid item xs={2}>
            <DescriptionListTitle>
              {t('metadata.organizations')}
            </DescriptionListTitle>
          </Grid>
          <Grid item xs={10}>
            <dd>{schemaDisplay.schemaOrganizations}</dd>
          </Grid>
        </Grid>
      </DescriptionList>
      <MetadataFilesTable
        filesRowInput={schemaFiles} pid={schemaDetails?.pid} canEdit={false}
      ></MetadataFilesTable>
    </>
  );
}
