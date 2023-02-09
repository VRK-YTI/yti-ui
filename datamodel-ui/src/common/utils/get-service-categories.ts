import { ServiceCategory } from '@app/common/interfaces/service-categories.interface';
import { getLanguageVersion } from './get-language-version';

export default function getServiceCategories(
  serviceCategoriesData?: ServiceCategory[],
  lang?: string
) {
  if (!serviceCategoriesData) {
    return [];
  }

  return serviceCategoriesData.map((category) => ({
    id: category.identifier,
    label: getLanguageVersion({
      data: category.label,
      lang: lang ?? 'fi',
    }),
  }));
}
