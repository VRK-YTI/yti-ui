import { useGetServiceCategoriesQuery } from '@app/common/components/service-categories/service-categories.slice';
import { useTranslation } from 'next-i18next';
import router from 'next/router';
import { Button } from 'suomifi-ui-components';

export default function CreateCrosswalk() {
  const { t, i18n } = useTranslation('admin');
  const { data: serviceCategoriesData } = useGetServiceCategoriesQuery(
    i18n.language
  );

  const handleOpen = () => {
    // Router Push to create crosswalk page
    router.push({
      pathname:'/crosswalk-edit/'});
  };

  return (
    <Button
      icon="plus"
      style={{ height: 'min-content' }}
      onClick={() => handleOpen()}
    >
      {'Create Crosswalk'}
    </Button>
  );
}
