import SchemaInfo from '@app/common/components/schema-info';
import { useTranslation } from 'next-i18next';

export default function SchemaVisualization({pid}: {pid: string}) {
  const { t } = useTranslation('common');
  const filterLabel = t('schema-tree.filter-schema');
  return (
    <SchemaInfo caption={filterLabel} schemaUrn={pid} />
  );
}
