import { useTranslation } from 'next-i18next';
import { Button } from 'suomifi-ui-components';
import useUrlState, { isInitial } from '@app/common/utils/hooks/use-url-state';
import Separator from '@app/common/components/separator';

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
          id="filter-reset-button"
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
