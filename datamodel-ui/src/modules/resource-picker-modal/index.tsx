import { useTranslation } from 'next-i18next';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { WideModal } from './resource-picker-modal.styles';
import { useMemo, useState } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import ResourceList, { ResultType } from '@app/common/components/resource-list';
import { useGetClassQuery } from '@app/common/components/class/class.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

interface ResourcePickerProps {
  visible: boolean;
  modelId: string;
  hide: () => void;
}

export default function ResourcePicker({
  visible,
  modelId,
  hide,
}: ResourcePickerProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [selected, setSelected] = useState<{
    attributes: string[];
    associations: string[];
  }>({
    attributes: [],
    associations: [],
  });

  const { data: classData, isSuccess } = useGetClassQuery(
    { modelId: 'tietomalli', classId: 'luokka2' ?? '' }
    // { skip: typeof currentClassId === 'undefined' }
  );

  const formattedData = useMemo<{
    associations: ResultType[];
    attributes: ResultType[];
  }>(() => {
    if (isSuccess) {
      return {
        associations:
          classData.association?.map((assoc) => ({
            target: {
              identifier: assoc.identifier,
              label: getLanguageVersion({
                data: assoc.label,
                lang: i18n.language,
              }),
              linkLabel: 'linkLabel',
              link: 'link',
              note: 'note',
              status: 'VALID',
              isValid: true,
            },
            subClass: {
              label: 'subClass',
              link: 'link',
              partOf: 'partOf',
            },
          })) ?? [],
        attributes:
          classData.attribute?.map((attr) => ({
            target: {
              identifier: attr.identifier,
              label: getLanguageVersion({
                data: attr.label,
                lang: i18n.language,
              }),
              linkLabel: 'linkLabel',
              link: 'link',
              note: 'note',
              status: 'VALID',
              isValid: true,
            },
            subClass: {
              label: 'subClass',
              link: 'link',
              partOf: 'partOf',
            },
          })) ?? [],
      };
    }

    return {
      associations: [],
      attributes: [],
    };
  }, [isSuccess, classData, i18n.language]);

  const handleCheckboxClick = (
    id: string | string[],
    type: 'associations' | 'attributes'
  ) => {
    if (Array.isArray(id)) {
      setSelected({
        ...selected,
        [type]: id,
      });
    } else {
      setSelected({
        ...selected,
        [type]: selected[type].includes(id)
          ? selected[type].filter((s) => s !== id)
          : [...selected[type], id],
      });
    }
  };

  const handleClose = () => {
    hide();
    setSelected({
      associations: [],
      attributes: [],
    });
  };

  return (
    <WideModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
      variant={isSmall ? 'smallScreen' : 'default'}
    >
      <ModalContent>
        <ModalTitle>Lisää ominaisuudet valitusta luokasta</ModalTitle>

        <ResourceList
          primaryColumnName="Attribuutin nimi"
          handleClick={(id: string | string[]) =>
            handleCheckboxClick(id, 'attributes')
          }
          items={formattedData.attributes}
          type="multiple"
          selected={selected.attributes}
          extraHeader={
            <tr>
              <td colSpan={4}>
                {classData?.attribute?.length ?? 0} Attribuuttia
              </td>
            </tr>
          }
        />

        <div style={{ height: '50px' }} />

        <ResourceList
          primaryColumnName="Assosiaation nimi"
          handleClick={(id: string | string[]) =>
            handleCheckboxClick(id, 'associations')
          }
          items={formattedData.associations}
          type="multiple"
          selected={selected.associations}
          extraHeader={
            <tr>
              <td colSpan={4}>
                {classData?.association?.length ?? 0} Assosiaatiota
              </td>
            </tr>
          }
        />
      </ModalContent>

      <ModalFooter>
        <Button disabled={Object.values(selected).flatMap((s) => s).length < 1}>
          {t('add-selected')}
        </Button>
        <Button variant="secondary" onClick={() => handleClose()}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </WideModal>
  );
}
