import { StyledPanel } from '@app/common/components/action-panel/action-panel.styles';
import SchemaAndCrosswalkActionMenu from '@app/common/components/schema-and-crosswalk-actionmenu';

export default function ActionPanel({ isActionMenu }: { isActionMenu?: boolean }) {
  return (
    <StyledPanel>
      {isActionMenu && <SchemaAndCrosswalkActionMenu />}
    </StyledPanel>
  );
}
