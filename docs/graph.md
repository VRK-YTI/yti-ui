# Graph

Graph uses `reactflow` as a base library and different logic can be found in utils folder.

More documentation of `reactflow` can be found at https://reactflow.dev/.

## Setup

Instance of React Flow is wrapped inside React Flow Provider to get access to different utilities and information about specific nodes and edges. 

Nodes and edges are generated from data received from backend and use `useNodesState()` and `useEdgesState()` accordingly to manage their state. They both provide access to `onNodesChange()` and `onEdgesChange()` functions that are used in React Flow component to update state of both nodes and edges.

## Rendering 

### Nodes

Since we are mainly using custom nodes we have to provide `nodeTypes` prop to React Flow component. This way we can use `type` to specify which type of node should be used. Nodes are pretty much just JSX elements with with some additional Node specific props.

Node props can be found at https://reactflow.dev/docs/api/nodes/node-options/.

Extra properties needed in nodes is passed inside `data` props which is defined just as an object.

### Edges

Like nodes we're mainly using custom edges and we have to provide `edgeTypes` prop to React Flow component. **Note! Custom edges require `<path />` to be defined**. 

Edge props can be found at https://reactflow.dev/docs/api/edges/edge-options/.

Extra properties needed in edges is passed inside `data` props which is defined just as an object.

### Marker end

Custom marker ends for edges can be defined as `<sv />` elements that need to be imported inside React Flow Provider. `marker-ends.tsx` contains an example of this and it's important to have the style props defined as well so that the marker end is invisible unless called by an edge.

## Functionalities

Functionalities such as node and edge rendering and moving these are handled entirely by React Flow. We have some custom functionalities that are which are described below.

### splitEdge

`splitEdge()` uses selected edge's source and target nodes id to create logically a new corner node that is placed between source and target nodes. Two new edges are created as well that sets source and targets node for them correctly. The corner node is set to x and y coordinates of the mouse click event.

### deleteEdgeById

`deleteEdgeById()` removes an edge between two nodes and a corner node if necessary. It also changes the source id to the previous node in the edge chain.

### getEdgeParams

`getEdgeParams()` handles the edge drawing between two nodes. The edges are calculated so that the start and end points are as close to each other as possible limited by the source and target nodes area. 

In the case where the two nodes areas are not overlapping in neither of the axis the edge start and end points are in the nodes closest corners.

When there's somekind of overlapping in either of the axis the edge is mainly drawn to be a straight line between nodes.
