import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import useUrlState, { isInitial } from '../../utils/hooks/useUrlState';
import Separator from '../separator';

export default function ResetAllFiltersButton() {
  const { t } = useTranslation();
  const { urlState, resetUrlState } = useUrlState();

  if (isInitialUrlState()) {
    return null;
  }

  return (
    <>
      <div>
        <Button
          icon="remove"
          onClick={() => resetUrlState()}
          variant="secondaryNoBorder"
        >
          {t('vocabulary-filter-remove-all')}
        </Button>
      </div>
      <Separator />
    </>
  );

  function isInitialUrlState(): boolean {
    return (
      isInitial(urlState, 'q') &&
      isInitial(urlState, 'domain') &&
      isInitial(urlState, 'organization') &&
      isInitial(urlState, 'status') &&
      isInitial(urlState, 'type')
    );
  }
}
