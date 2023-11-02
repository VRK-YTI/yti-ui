import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Resource } from './node.styles';
import { IconRows } from 'suomifi-icons';

interface AttributeNodeProps {
  id: string;
  data: {
    label: {
      [key: string]: string;
    };
    applicationProfile?: boolean;
  };
}

export default function AttributeNode({ id, data }: AttributeNodeProps) {
  const { i18n } = useTranslation('common');
  const [hover, setHover] = useState(false);

  return (
    <Resource
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      $highlight={hover}
    >
      <IconRows />
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Bottom} id={id} />
      <div>
        {getLanguageVersion({
          data: data.label,
          lang: i18n.language,
        })}
      </div>
    </Resource>
  );
}
