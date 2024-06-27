import { useReactFlow } from 'reactflow';
import { selectSelected, setZoomToClass } from '../model/model.slice';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';

export default function useCenterNode() {
  const { setCenter, getNode } = useReactFlow();
  const globalSelected = useSelector(selectSelected());
  const dispatch = useStoreDispatch();

  const centerNode = (nodeId?: string) => {
    const node = getNode(nodeId ?? globalSelected.id);

    if (!node) {
      return;
    }

    const x = node.positionAbsolute ? node.positionAbsolute.x : node.position.x;
    const y = node.positionAbsolute ? node.positionAbsolute.y : node.position.y;
    const yAdjustment = Math.min(
      (node.height ?? 1) / 2,
      window.innerHeight / 2
    );

    setCenter(x + (node.width ?? 1) / 2, y + yAdjustment, {
      duration: 500,
      zoom: 0.75,
    });

    // reset zoomToClass set after new class has been created
    dispatch(setZoomToClass(undefined));
  };

  return { centerNode };
}
