import { Button, IconPlus } from 'suomifi-ui-components';

export function ModalVisibilityButton({
  setVisible,
  label,
}: {
  setVisible: (value: boolean) => void;
  label: string;
}) {
  return (
    <Button
      variant="secondary"
      icon={<IconPlus />}
      style={{ height: 'min-content' }}
      onClick={() => setVisible(true)}
    >
      {label}
    </Button>
  );
}
