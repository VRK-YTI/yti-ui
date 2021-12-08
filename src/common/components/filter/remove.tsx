import { Text } from 'suomifi-ui-components';
import { useStoreDispatch } from '../../../store';
import { RemoveIcon, RemoveWrapper } from './filter.styles';

interface RemoveProps {
  resetFilter?: any;
  title: string;
}

export default function Remove({ resetFilter, title }: RemoveProps) {
  const dispatch = useStoreDispatch();

  return (
    <RemoveWrapper
      onClick={() => dispatch(resetFilter())}
    >
      <RemoveIcon icon='remove' />
      <Text
        style={{ fontSize: '14px' }}
        color='highlightBase'
        variant='bold'
      >
        {title}
      </Text>
    </RemoveWrapper>
  );
}
