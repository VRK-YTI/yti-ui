/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  selectDisplayLang,
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { MouseEvent, useCallback } from 'react';
import {
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useStore,
} from 'reactflow';
import { DeleteEdgeButton, EdgeContent } from './edge.styles';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { getEdgeParams } from './utils/get-edge-params';

export default function LabeledEdge({
  id,
  data,
  source,
  target,
  markerEnd,
  selected,
  style,
}: EdgeProps) {
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const displayLang = useSelector(selectDisplayLang());
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    data.handleDelete(id);
    if (globalSelected.id === id) {
      dispatch(setSelected('', 'associations'));
    }
  };

  const onSplitClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    data.splitEdge(source, target, e.clientX, e.clientY);
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        <EdgeContent
          className="nopan"
          $labelX={labelX}
          $labelY={labelY}
          $highlight={
            globalSelected.type === 'associations' &&
            globalSelected.id === data.identifier
          }
        >
          <div>
            {getLanguageVersion({
              data: data.label,
              lang: displayLang !== i18n.language ? displayLang : i18n.language,
              appendLocale: true,
            })}
          </div>
          {selected && (
            <DeleteEdgeButton onClick={(e) => onDeleteClick(e)}>
              ×
            </DeleteEdgeButton>
          )}
          <div>
            <button onClick={(e) => onSplitClick(e)}>split</button>
          </div>
        </EdgeContent>
      </EdgeLabelRenderer>
    </>
  );
}
