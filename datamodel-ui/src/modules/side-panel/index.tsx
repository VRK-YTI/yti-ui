import { useState } from 'react';
import { Panel } from 'reactflow';
import { OpenPanelButton } from './side-panel.styles';

export default function SidePanel() {
  const [open, setOpen] = useState(false);

  return (
    <Panel position="top-left" style={{ backgroundColor: 'white' }}>
      {open && (
        <div
          style={{ width: '200px', height: '400px', backgroundColor: 'white' }}
        ></div>
      )}
      <OpenPanelButton
        icon={open ? 'chevronLeft' : 'chevronRight'}
        variant="secondaryNoBorder"
        onClick={() => setOpen(!open)}
      />
    </Panel>
  );
}
