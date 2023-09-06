import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';

const ExtNodeDiv = styled.div<{
  $hover: boolean;
  $applicationProfile?: boolean;
}>`
  background-color: ${(props) =>
    props.$applicationProfile
      ? props.theme.suomifi.colors.depthLight2
      : props.$hover
      ? '#c6b2cd'
      : '#dcc6e4'};
  border-radius: 2px;
  padding: 5px 15px;

  .react-flow__handle {
    visibility: hidden;
    display: none;
  }
`;

interface ExtNodeProps {
  id: string;
  data: {
    label: {
      [key: string]: string;
    };
    applicationProfile?: boolean;
  };
}

export default function ExternalNode({ id, data }: ExtNodeProps) {
  const { i18n } = useTranslation('common');
  const [hover, setHover] = useState(false);

  return (
    <ExtNodeDiv
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      $hover={hover}
      $applicationProfile={data.applicationProfile}
    >
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Bottom} id={id} />
      <div>
        {getLanguageVersion({
          data: data.label,
          lang: i18n.language,
        })}
      </div>
    </ExtNodeDiv>
  );
}
