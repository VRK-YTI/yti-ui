import { useTranslation } from 'react-i18next';
import { AppThunk, useStoreDispatch } from '../../../store';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { VocabularyState } from '../vocabulary/vocabulary-slice';
import {
  CountPill,
  CountPillIcon,
  CountPillWrapper,
  CountText,
  CountWrapper
} from './search-count-tags.styles';

interface SearchCountTagsProps {
  count: number;
  filter: VocabularyState['filter'] | SearchState['filter'];
  setFilter: (x: any) => AppThunk;
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

  if ('infoDomains' in filter && 'infoDomains' in filter) {
    filter.infoDomains.map(infoDomain => {
      activeStatuses.push(infoDomain.value);
    });
  }

  if (filter.keyword) {
    activeStatuses.push(filter.keyword);
  }

  if ('showByOrg' in filter && filter.showByOrg) {
    activeStatuses.push(filter.showByOrg);
  }

  const handleTagClose = (s: string) => {
    let temp = filter;

    if (Object.keys(filter.status).includes(s)) {
      temp = { ...temp, status: { ...temp.status, [s]: false } };
    } else if ('infoDomains' in temp && temp.infoDomains) {
      temp = { ...temp, infoDomains: temp.infoDomains.filter(id => id.value !== s) };
    } else if ('showByOrg' in filter && filter.showByOrg && filter.showByOrg !== '') {
      temp = { ...temp, showByOrg: '' };
    } else {
      temp = { ...temp, keyword: '' };
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
