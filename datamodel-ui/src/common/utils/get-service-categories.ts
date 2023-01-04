import { ServiceCategories } from '@app/common/interfaces/service-categories.interface';
import { getPropertyLanguageVersion } from './get-language-version';

export default function getServiceCategories(
  serviceCategoriesData?: ServiceCategories,
  lang?: string
) {
  if (!serviceCategoriesData) {
    return [];
  }

  return serviceCategoriesData['@graph'].map((category) => ({
    id: category.identifier,
    label: getPropertyLanguageVersion({
      data: category.label,
      lang: lang ?? 'fi',
    }),
  }));
}
