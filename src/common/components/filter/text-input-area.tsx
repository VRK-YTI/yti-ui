import { useEffect, useState } from 'react';
import { TextInput } from 'suomifi-ui-components';
import useQueryParam from '../../utils/hooks/useQueryParam';

/**
 * Error handling:
 * - if title or visualPlaceholder values
 *   are empty strings should the value
 *   be different?
 */

interface TextInputAreaProps {
  title: string;
  visualPlaceholder: string;
  isModal: boolean;
}

export function TextInputArea({ title, visualPlaceholder, isModal }: TextInputAreaProps) {
  const [keyword, updateKeyword] = useQueryParam('q');
  const [inputValue, setInputValue] = useState<string>(keyword ?? '');

  useEffect(() => {
    setInputValue(keyword ?? '');
  }, [keyword, setInputValue]);

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
              onClick: () => { setInputValue(''), updateKeyword(); }
            }
        }
        labelText={title}
        onBlur={() => updateKeyword(inputValue)}
        onChange={val => val ? setInputValue(val.toString()) : setInputValue('')}
        onKeyDown={e => e.key === 'Enter' && updateKeyword(inputValue)}
        value={inputValue}
        visualPlaceholder={visualPlaceholder}
        fullWidth={isModal}
      />
    </div>
  );
}
