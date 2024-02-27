import { Node, XYPosition } from 'reactflow';

export default function getEdgeParams(
  source?: Node,
  target?: Node,
  offsetSource?: number,
  offsetTarget?: number
) {
  if (!source || !target) {
    return {
      sx: 0,
      sy: 0,
      tx: 0,
      ty: 0,
    };
  }

  const points = getPoints(source, target, offsetSource, offsetTarget);

  return {
    sx: points.source.x,
    sy: points.source.y,
    tx: points.target.x,
    ty: points.target.y,
  };
}

function getPoints(
  source: Node,
  target: Node,
  offsetSource?: number,
  offsetTarget?: number
): {
  source: XYPosition;
  target: XYPosition;
} {
  // If we are connecting an edge between two cornerNodes, we can
  // just add 20 to the x position of the source and target
  if (source.type === 'cornerNode' && target.type === 'cornerNode') {
    return {
      source: {
        x: source.position.x + 20,
        y: source.position.y,
      },
      target: {
        x: target.position.x + 20,
        y: target.position.y,
      },
    };
  }

  let [sourceX, sourceY, targetX, targetY] = [0, 0, 0, 0];

  const {
    x: sx,
    y: sy,
    w: sw,
    h: sh,
  } = getPositionAndSize(source, offsetSource);
  const {
    x: tx,
    y: ty,
    w: tw,
    h: th,
  } = getPositionAndSize(target, offsetTarget);

  // X-VALUE SETUP

  // If sx is greater (further right), then sourceX is the left
  // side of source node and targetX is the right side of target node
  if (sx > tx + tw) {
    sourceX = sx;
    targetX = tx + tw;

    // If sx is smaller (further left), then sourceX is the right
    // side node of source and targetX is the left side of target node
  } else if (sx + sw < tx) {
    sourceX = sx + sw;
    targetX = tx;
  } else {
    // Handling the cases if the nodes are overlapping on the x-axis.
    //
    // If one of the nodes is a corner node, we prefer to use the x value
    // of that node for both of the sourceX and targetX.
    // In other cases, we use middle point of the overlapping area of the
    // two nodes. And if one of the nodes is smaller in width, we use
    // the middle point of the smaller node when it is inside the larger
    // node.
    if (source.type === 'cornerNode' || target.type === 'cornerNode') {
      const sourceIsCorner = source.type === 'cornerNode';
      const x = sourceIsCorner ? sx + sw : tx + tw;
      sourceX = sourceIsCorner ? x : getValueInsideRange(x, sx, sx + sw);
      targetX = sourceIsCorner ? getValueInsideRange(x, tx, tx + tw) : x;
    } else {
      const value = getMidpointBySmaller(sx, sw, tx, tw);
      sourceX = value[0];
      targetX = value[1];
    }
  }

  // Y-VALUE SETUP

  // If sy is greater (further down), then sourceX is the top
  // side of source node and targetY is the bottom side of target node
  if (sy > ty + th) {
    sourceY = sy;
    targetY = ty + th;

    // If sy is smaller (further up), then sourceY is the bottom
    // side node of source and targetY is the top side of target node
  } else if (sy + sh < ty) {
    sourceY = sy + sh;
    targetY = ty;
  } else {
    // Handling the cases if the nodes are overlapping on the y-axis.
    //
    // If one of the nodes is a corner node, we prefer to use the x value
    // of that node for both of the sourceX and targetX.
    // In other cases, we use middle point of the overlapping area of the
    // two nodes. And if one of the nodes is smaller in height, we use
    // the middle point of the smaller node when it is inside the larger
    // node.
    if (source.type === 'cornerNode' || target.type === 'cornerNode') {
      const sourceIsCorner = source.type === 'cornerNode';
      const y = sourceIsCorner ? sy : ty;
      sourceY = sourceIsCorner ? y : getValueInsideRange(y, sy, sy + sh);
      targetY = sourceIsCorner ? getValueInsideRange(y, ty, ty + th) : y;
    } else {
      const value = getMidpointBySmaller(sy, sh, ty, th);
      sourceY = value[0];
      targetY = value[1];
    }
  }

  return {
    source:
      source.type === 'cornerNode'
        ? {
            x: source.position.x + 20,
            y: source.position.y,
          }
        : {
            x: sourceX,
            y: sourceY,
          },
    target:
      target.type === 'cornerNode'
        ? {
            x: target.position.x + 20,
            y: target.position.y,
          }
        : {
            x: targetX,
            y: targetY,
          },
  };
}

function getMidpointBySmaller(
  sourcePoint: number,
  sourceSize: number,
  targetPoint: number,
  targetSize: number
): [number, number] {
  const sourceSmaller = sourceSize < targetSize;
  const smallPoint = sourceSmaller ? sourcePoint : targetPoint;
  const smallSize = sourceSmaller ? sourceSize : targetSize;
  const largePoint = sourceSmaller ? targetPoint : sourcePoint;
  const largeSize = sourceSmaller ? targetSize : sourceSize;

  if (
    smallPoint >= largePoint &&
    smallPoint + smallSize <= largePoint + largeSize
  ) {
    const point = smallPoint + smallSize / 2;
    return [point, point];
  } else if (
    smallPoint < largePoint &&
    smallPoint + smallSize < largePoint + largeSize
  ) {
    const point = largePoint + (smallPoint + smallSize - largePoint) / 2;
    return [point, point];
  } else {
    const point = smallPoint + (largePoint + largeSize - smallPoint) / 2;
    return [point, point];
  }
}

function getValueInsideRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPositionAndSize(node: Node, offset?: number) {
  if (node.type === 'cornerNode' || node.type === 'externalNode') {
    return {
      x: node.position.x,
      y: node.position.y,
      w: node.width ?? 0,
      h: node.height ?? 0,
    };
  }

  // If an offset is provided, we need take the class node
  // title height into account. The offset is the index of
  // resource inside the class node
  if (offset && offset > 0) {
    return {
      x: node.position.x + 5,
      // 60 here is the height of the classNode title
      y: node.position.y + 5 + 60 + (offset - 1) * 38,
      w: node.width ? node.width - 10 : 0,
      h: 30,
    };
  }

  // Padding must be discarded from classNode params
  return {
    x: node.position.x + 5,
    y: node.position.y + 5,
    w: node.width ? node.width - 10 : 0,
    h: node.height ? node.height - 10 : 0,
  };
}
