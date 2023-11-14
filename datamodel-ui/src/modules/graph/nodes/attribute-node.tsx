import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Resource } from './node.styles';
import { IconRows } from 'suomifi-icons';
import { useSelector } from 'react-redux';
import {
  selectModelTools,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import useSetView from '@app/common/utils/hooks/use-set-view';

interface AttributeNodeProps {
  id: string;
  data: {
    label: {
      [key: string]: string;
    };
    applicationProfile?: boolean;
    modelId: string;
    dataType: string;
  };
}

export default function AttributeNode({ id, data }: AttributeNodeProps) {
  const { i18n } = useTranslation('common');
  const [hover, setHover] = useState(false);
  const tools = useSelector(selectModelTools());
  const dispatch = useStoreDispatch();
  const { setView } = useSetView();

  const handleResourceClick = (id: string) => {
    setView('attributes', 'info', id);
    dispatch(setSelected(id, 'attributes', data.modelId));
  };

  const label = tools.showById
    ? `${data.modelId}:${id}`
    : getLanguageVersion({
        data: data.label,
        lang: i18n.language,
      });

  const dataType = data.dataType ? `(${data.dataType})` : '';

  return (
    <Resource
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      $highlight={hover}
      onClick={() => handleResourceClick(id)}
    >
      <IconRows />
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Bottom} id={id} />
      <div>
        {label} {dataType}
      </div>
    </Resource>
  );
}
