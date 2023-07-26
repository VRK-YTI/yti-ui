import {
  selectHovered,
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const ClassWrapper = styled.div<{ $hover: boolean; $highlight: boolean }>`
  width: 100%;
  height: 100%;

  ${(props) =>
    props.$hover &&
    `
    background: ${props.theme.suomifi.colors.accentTertiaryDark1};
  `}

  ${(props) =>
    props.$highlight &&
    `
    background: ${props.theme.suomifi.colors.warningBase};
  `}
`;

export default function ClassWrapperNode({
  id,
  data,
}: {
  id: string;
  data: {
    classId: string;
  };
}) {
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const globalHover = useSelector(selectHovered());
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    if (globalSelected.id !== data.classId) {
      dispatch(setSelected(data.classId, 'classes'));
    }
  };

  return (
    <ClassWrapper
      $hover={hover || globalHover.id === data.classId}
      $highlight={
        globalSelected.type === 'classes' &&
        globalSelected.id !== '' &&
        globalSelected.id === data.classId
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => handleClick()}
    />
  );
}
