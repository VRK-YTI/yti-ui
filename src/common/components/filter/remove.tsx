import { Button } from 'suomifi-ui-components';
import { AppThunk, useStoreDispatch } from '../../../store';

/**
 * Error handling:
 * - instead of getting title from parent
 *   should this use i18n translation instead?
 */

interface RemoveProps {
  resetFilter: () => AppThunk;
  title: string;
}

export default function Remove({ resetFilter, title }: RemoveProps) {
  const dispatch = useStoreDispatch();

  return (
    <div>
      <Button
        icon='remove'
        onClick={() => dispatch(resetFilter())}
        variant='secondaryNoBorder'
      >
        {title}
      </Button>
    </div>
  );
}
