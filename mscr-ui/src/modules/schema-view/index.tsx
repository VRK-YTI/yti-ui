import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useGetSchemaWithRevisionsQuery } from '@app/common/components/schema/schema.slice';
import MetadataAndFiles from './metadata-and-files';
import { createTheme, ThemeProvider } from '@mui/material';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';
import VersionHistory from 'src/common/components/version-history';
import SchemaVisualization from '@app/modules/schema-view/schema-visualization';

export default function SchemaView({
  schemaId,
  user,
}: {
  schemaId: string;
  user: MscrUser;
}) {
  const { t } = useTranslation('common');

  const {
    data: schemaDetails,
    isLoading,
    isSuccess,
    refetch,
    // Add these in when adding error handling
    // isError,
    // error,
  } = useGetSchemaWithRevisionsQuery(schemaId);

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
  } else if (isSuccess) {
    return (
      <ThemeProvider theme={theme}>
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
            <MetadataAndFiles schemaDetails={schemaDetails} refetch={refetch} />
          )}
          {selectedTab === 1 && (
            <SchemaVisualization pid={schemaId} format={schemaDetails.format} />
          )}
          {selectedTab === 2 && (
            <VersionHistory revisions={schemaDetails.revisions} />
          )}
        </>
      </ThemeProvider>
    );
  }

  // TODO: What to return if data fetching returns error?
  return <></>;
}
