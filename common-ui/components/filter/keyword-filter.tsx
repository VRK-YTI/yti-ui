import { useEffect, useState } from 'react';
import { TextInput } from 'suomifi-ui-components';
import useUrlState, { initialUrlState } from '../../utils/hooks/use-url-state';
import { SEARCH_FIELD_PATTERN, TEXT_INPUT_MAX } from '../../utils/constants';
import { useTranslation } from 'next-i18next';

interface KeywordFilterProps {
  title: string;
  visualPlaceholder: string;
}

export default function KeywordFilter({
  title,
  visualPlaceholder,
}: KeywordFilterProps) {
  const { urlState, patchUrlState } = useUrlState();
  const q = urlState.q;
  const [inputValue, setInputValue] = useState(q);
  const [error, setError] = useState(false);
  const { t } = useTranslation('common');
  useEffect(() => setInputValue(q), [q, setInputValue]);

  const update = (q: string) => {
    if (!error) {
      patchUrlState({
        q,
        page: initialUrlState.page,
      });
    }
  };

  const handleChange = (val: string) => {
    setInputValue(val ?? '');
    if (val.match(SEARCH_FIELD_PATTERN)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <TextInput
        status={error ? 'error' : 'default'}
        statusText={error ? t('filter-character-not-allowed') : ''}
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
