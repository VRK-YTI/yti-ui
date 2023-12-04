import {
  resetHovered,
  selectDisplayLang,
  selectHighlighted,
  selectModelTools,
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
  useEdges,
  useNodes,
  useStore,
} from 'reactflow';
import getEdgeParams from '../utils/get-edge-params';
import { EdgeContent, HoveredPath } from './edge.styles';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { EdgeDataType } from '@app/common/interfaces/graph.interface';
import GetStartNode from '../utils/get-start-node';

export default function DefaultEdge({
  id,
  data,
  source,
  target,
  markerEnd,
  style,
}: EdgeProps<EdgeDataType>) {
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const displayLang = useSelector(selectDisplayLang());
  const highlighted = useSelector(selectHighlighted());
  const nodes = useNodes();
  const edges = useEdges();
  const { showAssociations, showAssociationRestrictions, showById } =
    useSelector(selectModelTools());
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );
  const startNodeIsAttribute = useCallback(() => {
    if (!sourceNode) {
      return false;
    }

    return (
      sourceNode?.type === 'attributeNode' ||
      GetStartNode(sourceNode, nodes, edges)?.type === 'attributeNode'
    );
  }, [sourceNode, nodes, edges]);

  const { sx, sy, tx, ty } = getEdgeParams(
    sourceNode,
    targetNode,
    data?.offsetSource
  );

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const handleHover = (value?: boolean) => {
    if (value && data?.identifier) {
      dispatch(setHovered(data.identifier, 'associations'));
      return;
    }

    dispatch(resetHovered());
  };

  if (
    (!showAssociations || !showAssociationRestrictions) &&
    !startNodeIsAttribute()
  ) {
    return <></>;
  }

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

      {getLabel(data?.label) && (
        <EdgeLabelRenderer key={`edge-label-${source}-${target}`}>
          <EdgeContent
            className="nopan"
            $applicationProfile={data ? data.applicationProfile : false}
            $labelX={labelX}
            $labelY={labelY}
            $highlight={
              globalSelected.type === 'associations' &&
              data &&
              globalSelected.id === data.identifier
                ? true
                : false
            }
          >
            <div>{getLabel(data?.label)}</div>
          </EdgeContent>
        </EdgeLabelRenderer>
      )}
    </>
  );

  function getLabel(label?: { [key: string]: string } | string) {
    if (typeof label === 'string') {
      return label;
    }

    if (!label || Object.keys(label).length < 1) {
      return undefined;
    }

    if (showById) {
      return `${data?.modelId}:${data?.identifier}`;
    }
    return getLanguageVersion({
      data: label,
      lang: displayLang !== i18n.language ? displayLang : i18n.language,
      appendLocale: true,
    });
  }
}
