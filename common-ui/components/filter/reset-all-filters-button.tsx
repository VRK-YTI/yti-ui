import { useTranslation } from 'next-i18next';
import { Button, IconRemove } from 'suomifi-ui-components';
import useUrlState, { isInitial } from '../../utils/hooks/use-url-state';
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
          icon={<IconRemove />}
          onClick={() => resetUrlState()}
          variant="secondaryNoBorder"
          id="filter-reset-button"
        >
          {t('filter-remove-all')}
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
      isInitial(urlState, 'lang')
    );
  }
}
