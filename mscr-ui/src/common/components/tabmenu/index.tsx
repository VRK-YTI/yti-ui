import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import {
  selectSelectedTab,
  setSelectedTab,
} from '@app/common/components/content-view/content-view.slice';
import { useTranslation } from 'next-i18next';
import { Type } from '@app/common/interfaces/search.interface';
import { TabIndex, TabText, MscrTabs } from '@app/common/interfaces/tabmenu';
import { ReactNode } from 'react';
import {
  StyledTab,
  StyledTabs,
} from '@app/common/components/tabmenu/tabmenu.styles';
import { setQuery } from '@app/common/components/data-type-registry-search/data-type-registry-search.slice';

interface TabPanel {
  tabIndex: TabIndex;
  tabText: TabText;
  content: ReactNode;
}

interface TabMenuProps {
  contentType: Type;
  isRemoved?: boolean;
  tabPanels: TabPanel[];
}

export default function Tabmenu({
  contentType,
  isRemoved,
  tabPanels,
}: TabMenuProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const selectedTab = useSelector(selectSelectedTab());
  const translations = {
    'SCHEMA.metadata-and-files-tab': t('tabs.metadata-and-files'),
    'CROSSWALK.metadata-and-files-tab': t('tabs.metadata-and-files'),
    'SCHEMA.content-and-editor-tab': t('tabs.schema.content-and-editor-tab'),
    'CROSSWALK.content-and-editor-tab': t(
      'tabs.crosswalk.content-and-editor-tab'
    ),
    'SCHEMA.history-tab': t('tabs.history-tab'),
    'CROSSWALK.history-tab': t('tabs.history-tab'),
    'stub': t('tabs.stub-metadata'), // If the content is removed, there's only one tab with only metadata.
  };

  function customTabProps(tab: TabText) {
    const index = MscrTabs[tab];
    return {
      id: `simple-tab-tab-${index}`,
      className: tab,
      'aria-controls': `simple-tab-tabpanel-${index}`,
      label: isRemoved
        ? translations['stub']
        : translations[`${contentType}.${tab}`],
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: TabIndex) => {
    dispatch(setSelectedTab(newValue));
    dispatch(setQuery(''));
  };

  return (
    <>
      <StyledTabs
        value={selectedTab}
        onChange={handleChange}
        aria-label={t('tabs.label')}
      >
        <StyledTab {...customTabProps('metadata-and-files-tab')} />
        {!isRemoved && (
          <StyledTab {...customTabProps('content-and-editor-tab')} />
        )}
        {!isRemoved && <StyledTab {...customTabProps('history-tab')} />}
      </StyledTabs>
      {tabPanels.map((tab) => {
        return (
          <div
            key={tab.tabIndex}
            role="tabpanel"
            hidden={selectedTab !== tab.tabIndex}
            id={`simple-tab-tabpanel-${tab.tabIndex}`}
            aria-labelledby={`simple-tab-tab-${tab.tabIndex}`}
          >
            {selectedTab === tab.tabIndex && tab.content}
          </div>
        );
      })}
    </>
  );
}
