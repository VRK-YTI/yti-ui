import { useState } from 'react';
import styled from 'styled-components';

const ExtNodeDiv = styled.div<{ $hover: boolean }>`
  background-color: ${(props) => (props.$hover ? '#c6b2cd' : '#dcc6e4')};
  border-radius: 2px;
  padding: 5px 15px;
`;

interface ExtNodeProps {
  id: string;
  data: {
    label: string;
  };
}

export default function ExtNode({ id, data }: ExtNodeProps) {
  const [hover, setHover] = useState(false);

  return (
    <ExtNodeDiv
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      $hover={hover}
    >
      {data.label}
    </ExtNodeDiv>
  );
}
