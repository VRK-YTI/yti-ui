import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useState } from 'react';
import VersionHistory from '@app/modules/schema-view/version-history';
import { useTranslation } from 'next-i18next';
import { useGetSchemaWithRevisionsQuery } from '@app/common/components/schema/schema.slice';
import MetadataAndFiles from './metadata-and-files';

export default function SchemaView({ schemaId }: { schemaId: string }) {
  const { t } = useTranslation('common');

  const {
    data: schemaDetails,
    isLoading,
    isSuccess,
    // Add these in when adding error handling
    // isError,
    // error,
  } = useGetSchemaWithRevisionsQuery(schemaId);
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
          <MetadataAndFiles schemaDetails={schemaDetails} />
        )}
        {selectedTab === 1 && (
          <VersionHistory schemaDetails={schemaDetails} />
        )}
      </>
    );
  }

  // TODO: What to return if data fetching returns error?
  return <></>;
}
