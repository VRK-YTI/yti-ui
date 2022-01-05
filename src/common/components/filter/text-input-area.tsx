import { useEffect, useState } from 'react';
import { TextInput } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';
import { SearchState } from '../terminology-search/terminology-search-slice';
import { VocabularyState } from '../vocabulary/vocabulary-slice';

interface TextInputAreaProps {
  filter: VocabularyState['filter'] | SearchState['filter'];
  setFilter: (x: any) => AppThunk;
  title: string;
  visualPlaceholder: string;
  isModal: boolean;
}

export function TextInputArea({ filter, setFilter, title, visualPlaceholder, isModal }: TextInputAreaProps) {
  const dispatch = useStoreDispatch();
  const [inputValue, setInputValue] = useState(filter.keyword);

  useEffect(() => {
    setInputValue(filter.keyword);
  }, [filter.keyword]);

  const handleInput = (str: string) => {
    dispatch(setFilter({ ...filter, keyword: str }));
  };

  return (
    <div>
      <TextInput
        icon='close'
        iconProps={
          !inputValue
            ?
            { fill: 'white' }
            :
            {
              fill: 'hsl(212, 63%, 45%)',
              onClick: () => { setInputValue(''), handleInput(''); }
            }
        }
        labelText={title}
        onBlur={() => handleInput(inputValue)}
        onChange={val => val ? setInputValue(val.toString()) : setInputValue('')}
        onKeyDown={e => e.key === 'Enter' && handleInput(inputValue)}
        value={inputValue}
        visualPlaceholder={visualPlaceholder}
        fullWidth={isModal}
      />
    </div>
  );
}
