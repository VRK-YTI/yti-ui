import { useTranslation } from 'react-i18next';
import { useStoreDispatch } from '../../../store';
import {
  CountPill,
  CountPillIcon,
  CountPillWrapper,
  CountText,
  CountWrapper
} from './search-count-tags.styles';

interface SearchCountTagsProps {
  count: any;
  filter: any;
  setFilter: any;
}

export default function SearchCountTags({ count, filter, setFilter }: SearchCountTagsProps) {
  const { t } = useTranslation('common');

  const dispatch = useStoreDispatch();
  let activeStatuses: string[] = [];;

  Object.keys(filter.status).map(key => {
    if (filter.status[key] === true) {
      activeStatuses.push(key);
    }
  });

  if (filter.infoDomains) {
    Object.keys(filter.infoDomains).map(organization => {
      if (filter.infoDomains[organization] === true) {
        activeStatuses.push(organization);
      }
    });
  }

  if (filter.keyword) {
    activeStatuses.push(filter.keyword);
  }

  if (filter.showByOrg) {
    activeStatuses.push(filter.showByOrg);
  }

  const handleTagClose = (s: any) => {
    let temp = filter;

    if (Object.keys(filter.status).includes(s)) {
      temp = { ...temp, status: { ...temp.status, [s]: false } };
    } else if (filter.infoDomains && Object.keys(filter.infoDomains).includes(s)) {
      temp = { ...temp, infoDomains: { ...temp.infoDomains, [s]: false } };
    } else if (filter.showByOrg && filter.showByOrg !== '') {
      temp = { ...temp, showByOrg: '' };
    } else {
      temp = { ...temp, keyword: '', tKeyword: '' };
    }

    dispatch(setFilter(temp));
  };

  return (
    <CountWrapper>
      <CountText>
        {t('vocabulary-results-concepts')} {count} {t('vocabulary-results-with-following-filters')}
      </CountText>
      <CountPillWrapper>
        {activeStatuses.map((status: string, idx: number) => {
          return (
            <CountPill key={idx}>
              {t(status)} <CountPillIcon icon='close' onClick={() => handleTagClose(status)} />
            </CountPill>
          );
        })}
      </CountPillWrapper>
    </CountWrapper>
  );
}
