import { useState } from 'react';
import { Panel } from 'reactflow';
import { OpenPanelButton, SidePanelBlock } from './side-panel.styles';

export default function SidePanel() {
  const [open, setOpen] = useState(false);

  return (
    <Panel
      position="top-left"
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      <SidePanelBlock $open={open}></SidePanelBlock>
      <OpenPanelButton
        icon={open ? 'chevronLeft' : 'chevronRight'}
        variant="secondaryNoBorder"
        onClick={() => setOpen(!open)}
      />
    </Panel>
  );
}
