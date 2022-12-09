import { ReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import 'reactflow/dist/base.css';
import SidePanel from '../side-panel';

export default function Profile() {
  const nodes = [
    {
      id: '1',
      position: { x: 50, y: 50 },
      data: { label: 'Test 1' },
    },
    {
      id: '2',
      position: { x: 10, y: 100 },
      data: { label: 'Test 2' },
    },
  ];

  const edges = [
    {
      id: '1-2',
      source: '1',
      target: '2',
    },
  ];

  return (
    <div
      style={{
        height: '100vw',
        width: '100hw',
      }}
    >
      <ReactFlow nodes={nodes} edges={edges}>
        <SidePanel />
      </ReactFlow>
    </div>
  );
}
