import SchemaInfo from '@app/common/components/schema-info';
import { useTranslation } from 'next-i18next';
import {
  Format,
  formatsAvailableForCrosswalkCreation,
} from '@app/common/interfaces/format.interface';
import { useSelector } from 'react-redux';
import { selectIsEditContentActive } from '@app/common/components/content-view/content-view.slice';

export default function SchemaVisualization({
  pid,
  format,
}: {
  pid: string;
  format: Format;
}) {
  const { t } = useTranslation('common');
  const isEditModeActive = useSelector(selectIsEditContentActive());
  const filterLabel = t('schema-tree.search-schema');
  const visualizationAvailable =
    formatsAvailableForCrosswalkCreation.includes(format);
  if (visualizationAvailable) {
    return (
      <SchemaInfo
        caption={filterLabel}
        schemaUrn={pid}
        isSingleTree={true}
        isEditable={isEditModeActive}
      />
    );
  } else {
    return (
      <>
        <h2>{t('schema-tree.error-heading')}</h2>
        <p>{t('schema-tree.error-info')}</p>
      </>
    );
  }
}
