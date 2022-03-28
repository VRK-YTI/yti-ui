import { useEffect, useState } from 'react';
import { TextInput } from 'suomifi-ui-components';
import useUrlState, {
  initialUrlState,
} from '@app/common/utils/hooks/useUrlState';

interface KeywordFilterProps {
  title: string;
  visualPlaceholder: string;
  isModal?: boolean;
}

export function KeywordFilter({
  title,
  visualPlaceholder,
  isModal,
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
        onChange={(val) => setInputValue(val?.toString() ?? '')}
        onKeyDown={(e) => e.key === 'Enter' && update(inputValue)}
        value={inputValue}
        visualPlaceholder={visualPlaceholder}
        fullWidth
      />
    </div>
  );
}
