import { Chip } from "suomifi-ui-components";

export interface TagProps {
  children: React.ReactNode;
  onRemove: () => void;
}

export default function Tag({ children, onRemove }: TagProps) {
  return (
    <Chip actionLabel="Remove filter" onClick={onRemove} removable>
      {children}
    </Chip>
  );
}
