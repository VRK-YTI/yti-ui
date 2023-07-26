import styled from 'styled-components';
import {
  selectDisplayLang,
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { IconMenu, IconSwapVertical } from 'suomifi-icons';
import { useStoreDispatch } from '@app/store';

const ResourceWrapper = styled.div<{ $highlight?: boolean }>`
  background: #f7f7f8;
  border: 1px solid #c8cdd0;
  border-radius: 2px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
  width: 348px;
  padding: 0 0 0 ${(props) => props.theme.suomifi.spacing.xs};

  &:hover {
    background: ${(props) => props.theme.suomifi.colors.depthLight2};
  }

  ${(props) =>
    props.$highlight &&
    `
  border: 4px solid #FAAF00;
  margin: -3px;
  `}

  .fi-icon {
    width: 16px;
    height: 16px;
  }
`;

interface ResourceNodeProps {
  id: string;
  data: {
    identifier: string;
    label: { [key: string]: string };
    type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE;
    applicationProfile?: boolean;
  };
}

export default function ResourceNode({ id, data }: ResourceNodeProps) {
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const displayLang = useSelector(selectDisplayLang());
  const globalSelected = useSelector(selectSelected());

  return (
    <ResourceWrapper
      $highlight={
        globalSelected.type ===
          (data.type === ResourceType.ASSOCIATION
            ? 'associations'
            : 'attributes') && globalSelected.id === id
      }
      onClick={() =>
        dispatch(
          setSelected(
            id,
            data.type === ResourceType.ASSOCIATION
              ? 'associations'
              : 'attributes'
          )
        )
      }
    >
      {data.applicationProfile &&
        (data.type === ResourceType.ASSOCIATION ? (
          <IconSwapVertical />
        ) : (
          <IconMenu />
        ))}
      {getLanguageVersion({
        data: data.label,
        lang: displayLang !== i18n.language ? displayLang : i18n.language,
        appendLocale: true,
      })}
    </ResourceWrapper>
  );
}
