import SchemaInfo from '@app/common/components/schema-info';
import { useTranslation } from 'next-i18next';
import {
  Format,
  formatsAvailableForCrosswalkCreation,
} from '@app/common/interfaces/format.interface';

export default function SchemaVisualization({
  pid,
  format,
  isNodeEditable
}: {
  pid: string;
  format: Format;
  isNodeEditable: boolean;
}) {
  const { t } = useTranslation('common');
  const filterLabel = t('schema-tree.search-schema');
  const visualizationAvailable =
    formatsAvailableForCrosswalkCreation.includes(format);
  if (visualizationAvailable) {
    return (
      <SchemaInfo
        caption={filterLabel}
        schemaUrn={pid}
        isSingleTree={true}
        isNodeEditable={isNodeEditable}
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
