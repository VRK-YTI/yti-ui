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

  if (sx > tx + tw) {
    sourceX = sx;
    targetX = tx + tw;
  } else if (sx + sw < tx) {
    sourceX = sx + sw;
    targetX = tx;
  } else {
    if (source.type === 'cornerNode' || target.type === 'cornerNode') {
      const sourceIsCorner = source.type === 'cornerNode';
      const x = sourceIsCorner ? sx + 20 : tx + 20;

      if (!sourceIsCorner && offsetSource) {
        sourceX = tx > sx + sw / 2 ? sx + sw : sx;
      } else {
        sourceX = sourceIsCorner ? x : getValueInsideRange(x, sx, sx + sw);
      }

      if (sourceIsCorner && offsetTarget) {
        targetX = sx > tx + tw / 2 ? tx + tw : tx;
      } else {
        targetX = sourceIsCorner ? getValueInsideRange(x, tx, tx + tw) : x;
      }
    } else {
      if (sx >= tx) {
        const x = sx + (tx + tw - sx) / 2;
        sourceX = offsetSource ? sx : x;
        targetX = offsetTarget ? tx + tw : x;
      } else {
        const x = tx + (sx + sw - tx) / 2;
        sourceX = offsetSource ? sx + sw : x;
        targetX = offsetTarget ? tx : x;
      }
    }
  }

  if (sy > ty + th) {
    sourceY = sy;
    targetY = ty + th;
  } else if (sy + sh < ty) {
    sourceY = sy + sh;
    targetY = ty;
  } else {
    if (source.type === 'cornerNode' || target.type === 'cornerNode') {
      const sourceIsCorner = source.type === 'cornerNode';
      const y = sourceIsCorner ? sy : ty;
      sourceY = sourceIsCorner ? y : getValueInsideRange(y, sy, sy + sh);
      targetY = sourceIsCorner ? getValueInsideRange(y, ty, ty + th) : y;
    } else {
      if (sh === th) {
        sourceY = sy + sh / 2;
        targetY = ty + th / 2;
      } else {
        const sourceSmaller = sh < th;
        const smy = sourceSmaller ? sy : ty;
        const smh = sourceSmaller ? sh : th;
        const ly = sourceSmaller ? ty : sy;
        const lh = sourceSmaller ? th : sh;

        const sMid = smy + smh / 2;
        const sourceInside = smy > ly && smy + smh < ly + lh + 1;
        const sourceUpper = smy < ly + lh / 2;

        if (sourceUpper) {
          const yNew = smy + smh - (smy + smh - ly) / 2;

          switch (sourceSmaller) {
            case true:
              sourceY = yNew < sMid ? sMid : yNew;
              break;
            default:
              targetY = yNew < sMid ? sMid : yNew;
          }
        } else {
          const yNew = ly + lh - (ly + lh - smy) / 2;

          switch (sourceSmaller) {
            case true:
              sourceY = yNew > sMid ? sMid : yNew;
              break;
            default:
              targetY = yNew < sMid ? sMid : yNew;
          }
        }

        switch (sourceSmaller) {
          case true:
            targetY = sourceUpper ? ly : ly + lh;
            targetY = sourceInside ? sourceY : targetY;
            break;
          default:
            sourceY = sourceUpper ? ly : ly + lh;
            sourceY = sourceInside ? targetY : sourceY;
        }
      }
    }
  }

  return {
    source:
      source.type === 'cornerNode'
        ? {
            x: source.position.x + (source.width ?? 0),
            y: source.position.y,
          }
        : {
            x: sourceX,
            y: sourceY,
          },
    target:
      target.type === 'cornerNode'
        ? {
            x: target.position.x + (target.width ?? 0),
            y: target.position.y,
          }
        : {
            x: targetX,
            y: targetY,
          },
  };
}

function getValueInsideRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPositionAndSize(node: Node, offset?: number) {
  if (node.type === 'cornerNode') {
    return {
      x: node.position.x,
      y: node.position.y,
      w: node.width ?? 0,
      h: node.height ?? 0,
    };
  }

  if (offset && offset > 0) {
    return {
      x: node.position.x + 5,
      y: node.position.y + 5 + 45 + (offset - 1) * 39,
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
