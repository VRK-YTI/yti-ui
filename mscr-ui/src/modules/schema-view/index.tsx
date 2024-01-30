import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useState } from 'react';
import VersionHistory from '@app/modules/schema-view/version-history';
import { useTranslation } from 'next-i18next';
import { useGetSchemaWithRevisionsQuery } from '@app/common/components/schema/schema.slice';
import MetadataAndFiles from './metadata-and-files';
import SideNavigationPanel from '@app/common/components/side-navigation';
import {createTheme, ThemeProvider, Grid} from '@mui/material';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

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
    // Add these in when adding error handling
    // isError,
    // error,
  } = useGetSchemaWithRevisionsQuery(schemaId);
  // TODO: I can't make sense of the format this returns, and how it would be offered for download

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Source Sans Pro',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ].join(','),
    },});

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
        <Box className="mb-3" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={changeTab}
            aria-label="Category selection"
          >
            <Tab label={t('schema.metadata-and-files')} {...a11yProps(0)} />
            <Tab label={t('schema.version-history')} {...a11yProps(1)} />
          </Tabs>
        </Box>

        {selectedTab === 0 && (
          <MetadataAndFiles
            schemaDetails={schemaDetails}
            schemaFiles={schemaDetails?.fileMetadata}
          />
        )}
        {selectedTab === 1 && <VersionHistory schemaDetails={schemaDetails} />}
      </>
      </ThemeProvider>
    );
  }

  // TODO: What to return if data fetching returns error?
  return <></>;
}
