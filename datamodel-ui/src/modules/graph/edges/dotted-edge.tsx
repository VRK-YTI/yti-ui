import {
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useStore,
} from 'reactflow';
import { useSelector } from 'react-redux';
import {
  selectDisplayLang,
  selectSelected,
} from '@app/common/components/model/model.slice';
import { useCallback } from 'react';
import { EdgeContent } from './edge.styles';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { getEdgeParams } from '../utils/get-edge-params';

export default function DottedEdge({
  id,
  data,
  source,
  target,
  style,
  markerEnd,
}: EdgeProps) {
  const { i18n } = useTranslation('common');
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

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={style}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <EdgeContent
          className="nopan"
          $borderless={true}
          $labelX={labelX}
          $labelY={labelY}
          $highlight={
            globalSelected.type === 'associations' &&
            globalSelected.id === data.identifier
          }
        >
          {getLanguageVersion({
            data: data.label,
            lang: displayLang !== i18n.language ? displayLang : i18n.language,
            appendLocale: true,
          })}
        </EdgeContent>
      </EdgeLabelRenderer>
    </>
  );
}
