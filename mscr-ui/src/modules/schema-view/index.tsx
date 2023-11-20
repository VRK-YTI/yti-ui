import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useState } from 'react';
import MetadataAndFiles from '@app/modules/schema-view/metadata-and-files';
import VersionHistory from '@app/modules/schema-view/version-history';

export default function SchemaView({ schemaId }: { schemaId: string }) {
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

  return (
    <>
      <Box className='mb-3' sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={selectedTab} onChange={changeTab} aria-label="Category selection">
          <Tab label="Metadata & files" {...a11yProps(0)} />
          <Tab label="Version history" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {selectedTab === 0 &&
        <MetadataAndFiles />
      }
      {selectedTab === 1 &&
        <VersionHistory />
      }
    </>
  );
}
