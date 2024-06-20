import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetSchemaWithRevisionsQuery } from '@app/common/components/schema/schema.slice';
import MetadataAndFiles from './metadata-and-files';
import { createTheme, Grid, ThemeProvider } from '@mui/material';
import VersionHistory from 'src/common/components/version-history';
import SchemaVisualization from '@app/modules/schema-view/schema-visualization';
import { State } from '@app/common/interfaces/state.interface';
import MetadataStub from '@app/modules/form/metadata-form/metadata-stub';
import { ActionMenuTypes, Type } from '@app/common/interfaces/search.interface';
import { Text } from 'suomifi-ui-components';
import SchemaAndCrosswalkActionMenu from '@app/common/components/schema-and-crosswalk-actionmenu';
import {
  SchemaVisualizationWrapper,
  VersionsHeading,
} from '@app/modules/schema-view/schema-view-styles';
import HasPermission from '@app/common/utils/has-permission';
import { formatsAvailableForMscrCopy } from '@app/common/interfaces/format.interface';

export default function SchemaView({ schemaId }: { schemaId: string }) {
  const { t } = useTranslation('common');

  const {
    data: schemaDetails,
    isLoading,
    isSuccess,
    refetch,
    isError,
    error,
  } = useGetSchemaWithRevisionsQuery(schemaId);

  const hasEditPermission = HasPermission({
    action: 'EDIT_CONTENT',
    owner: schemaDetails?.owner,
  });
  const hasCopyPermission = HasPermission({ action: 'MAKE_MSCR_COPY' });
  const isMscrCopyAvailable =
    hasCopyPermission &&
    schemaDetails &&
    formatsAvailableForMscrCopy.includes(schemaDetails.format);

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Source Sans Pro',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(','),
    },
  });

  const [selectedTab, setSelectedTab] = useState(0);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const changeTab = (event: SyntheticEvent | undefined, newValue: number) => {
    setSelectedTab(newValue);
  };
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isError) {
    if ('status' in error && error.status === 404) {
      return <Text>{t('error.not-found')}</Text>;
    }
  } else if (isSuccess) {
    return (
      <ThemeProvider theme={theme}>
        {schemaDetails.state === State.Removed ? ( // Stub view if state is REMOVED
          <>
            <Box
              className="mb-3"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tabs value={0} aria-label={t('tabs.label')}>
                <Tab label={t('tabs.metadata-stub')} {...a11yProps(0)} />
              </Tabs>
            </Box>

            {schemaDetails && (
              <MetadataStub metadata={schemaDetails} type={Type.Schema} />
            )}
          </>
        ) : (
          <>
            <Box
              className="mb-3"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tabs
                value={selectedTab}
                onChange={changeTab}
                aria-label="Category selection"
              >
                <Tab label={t('tabs.metadata-and-files')} {...a11yProps(0)} />
                <Tab label={t('tabs.schema')} {...a11yProps(1)} />
                <Tab label={t('tabs.version-history')} {...a11yProps(2)} />
              </Tabs>
            </Box>

            {selectedTab === 0 && schemaDetails && (
              <MetadataAndFiles
                schemaDetails={schemaDetails}
                refetch={refetch}
                hasEditPermission={hasEditPermission}
                isMscrCopyAvailable={isMscrCopyAvailable}
              />
            )}
            {selectedTab === 1 && (
              <>
                <SchemaVisualizationWrapper>
                  <SchemaVisualization
                    pid={schemaId}
                    format={schemaDetails.format}
                    refetchMetadata={refetch}
                    metadata={schemaDetails}
                    hasEditPermission={hasEditPermission}
                    isMscrCopyAvailable={isMscrCopyAvailable}
                  />
                </SchemaVisualizationWrapper>
              </>
            )}
            {selectedTab === 2 && (
              <Grid container>
                <Grid item xs={6}>
                  <VersionsHeading variant="h2">
                    {t('metadata.versions')}
                  </VersionsHeading>
                </Grid>
                <Grid item xs={6} className="d-flex justify-content-end">
                  <div className="mt-3 me-2">
                    {hasEditPermission && (
                      <SchemaAndCrosswalkActionMenu
                        metadata={schemaDetails}
                        isMappingsEditModeActive={false}
                        refetchMetadata={refetch}
                        type={ActionMenuTypes.Schema}
                      />
                    )}
                    {!hasEditPermission && isMscrCopyAvailable && (
                      <SchemaAndCrosswalkActionMenu
                        metadata={schemaDetails}
                        isMappingsEditModeActive={false}
                        refetchMetadata={refetch}
                        type={ActionMenuTypes.NoEditPermission}
                      />
                    )}
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <VersionHistory
                    revisions={schemaDetails.revisions}
                    contentType={Type.Schema}
                    currentRevision={schemaId}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )}
      </ThemeProvider>
    );
  }

  // TODO: What to return if data fetching returns error?
  return <></>;
}
