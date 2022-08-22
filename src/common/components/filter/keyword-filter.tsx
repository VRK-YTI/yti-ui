import { useEffect, useState } from 'react';
import { TextInput } from 'suomifi-ui-components';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/useUrlState';
import { SEARCH_FIELD_PATTERN, TEXT_INPUT_MAX } from '@app/common/utils/constants';

interface KeywordFilterProps {
  title: string;
  visualPlaceholder: string;
}

export function KeywordFilter({
  title,
  visualPlaceholder,
}: KeywordFilterProps) {
  const { urlState, patchUrlState } = useUrlState();
  const q = urlState.q;
  const [inputValue, setInputValue] = useState(q);
  useEffect(() => setInputValue(q), [q, setInputValue]);

  const update = (q: string) =>
    patchUrlState({
      q,
      page: initialUrlState.page,
    });

    const handleChange = (val: string) => {
      if(val.match(SEARCH_FIELD_PATTERN)){
        setInputValue(val ?? '');
      }
    };

  return (
    <div>
      <TextInput
        icon={inputValue ? 'close' : undefined}
        iconProps={{
          fill: 'hsl(212, 63%, 45%)',
          onClick: () => update(''),
        }}
        labelText={title}
        onBlur={() => update(inputValue)}
        onChange={(val) => handleChange(val?.toString() ?? '')}
        onKeyDown={(e) => e.key === 'Enter' && update(inputValue)}
        value={inputValue}
        visualPlaceholder={visualPlaceholder}
        fullWidth
        maxLength={TEXT_INPUT_MAX}
        id="filter-keyword-input"
      />
    </div>
  );
}
