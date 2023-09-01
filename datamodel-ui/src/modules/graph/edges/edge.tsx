import {
  resetHovered,
  selectDisplayLang,
  selectHighlighted,
  selectSelected,
  setHovered,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useStore,
} from 'reactflow';
import getEdgeParams from '../utils/get-edge-params';
import { EdgeContent, HoveredPath } from './edge.styles';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export default function DefaultEdge({
  id,
  data,
  source,
  target,
  markerEnd,
  style,
}: EdgeProps) {
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const displayLang = useSelector(selectDisplayLang());
  const highlighted = useSelector(selectHighlighted());
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

  const handleHover = (value?: boolean) => {
    if (value) {
      dispatch(setHovered(data.identifier, 'associations'));
      return;
    }

    dispatch(resetHovered());
  };

  return (
    <>
      <HoveredPath
        d={edgePath}
        onMouseOver={() => handleHover(true)}
        onMouseLeave={() => handleHover()}
        $highlight={highlighted.includes(id)}
      />

      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
        onMouseOver={() => handleHover(true)}
      />

      {getLabel(data.label) && (
        <EdgeLabelRenderer key={`edge-label-${source}-${target}`}>
          <EdgeContent
            className="nopan"
            $applicationProfile={data.applicationProfile}
            $labelX={labelX}
            $labelY={labelY}
            $highlight={
              globalSelected.type === 'associations' &&
              globalSelected.id === data.identifier
            }
          >
            <div>{getLabel(data.label)}</div>
          </EdgeContent>
        </EdgeLabelRenderer>
      )}
    </>
  );

  function getLabel(label: { [key: string]: string }) {
    if (!label || Object.keys(label).length < 1) {
      return undefined;
    }

    return getLanguageVersion({
      data: label,
      lang: displayLang !== i18n.language ? displayLang : i18n.language,
      appendLocale: true,
    });
  }
}
