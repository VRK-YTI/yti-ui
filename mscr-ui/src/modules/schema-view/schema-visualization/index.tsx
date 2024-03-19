import SchemaInfo from '@app/common/components/schema-info';
import { useTranslation } from 'next-i18next';
import {
  Format,
  formatsAvailableForCrosswalkCreation,
} from '@app/common/interfaces/format.interface';
import { SchemaVisualizationContainer } from '@app/modules/schema-view/schema-visualization/schema-visualization.styles';

export default function SchemaVisualization({
  pid,
  format,
}: {
  pid: string;
  format: Format;
}) {
  const { t } = useTranslation('common');
  const filterLabel = t('schema-tree.filter-schema');
  const visualizationAvailable =
    formatsAvailableForCrosswalkCreation.includes(format);
  if (visualizationAvailable) {
    return (
      <SchemaVisualizationContainer>
        <SchemaInfo caption={filterLabel} schemaUrn={pid} />
      </SchemaVisualizationContainer>
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
