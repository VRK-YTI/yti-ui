import { Panel } from 'reactflow';
import { NotificationInlineAlert } from './graph.styles';
import { useTranslation } from 'next-i18next';

export default function GraphNotification({
  hasChanges,
}: {
  hasChanges: boolean;
}) {
  const { t } = useTranslation('admin');

  if (!hasChanges) {
    return <></>;
  }

  return (
    <Panel
      position="top-right"
      style={{ marginTop: '6px', marginRight: '50px' }}
    >
      <NotificationInlineAlert>
        {t('graph-has-unsaved-changes')}
      </NotificationInlineAlert>
    </Panel>
  );
}
