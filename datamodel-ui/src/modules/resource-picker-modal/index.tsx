import { useTranslation } from 'next-i18next';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useMemo, useState } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import ResourceList, { ResultType } from '@app/common/components/resource-list';
import { useGetClassQuery } from '@app/common/components/class/class.slice';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import WideModal from '@app/common/components/wide-modal';

interface ResourcePickerProps {
  visible: boolean;
  selectedNodeShape: {
    modelId: string;
    classId: string;
    isAppProfile: boolean;
  };
  handleFollowUp: (value?: {
    associations: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[];
    attributes: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[];
  }) => void;
}

export default function ResourcePicker({
  visible,
  selectedNodeShape,
  handleFollowUp,
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
    {
      modelId: selectedNodeShape.modelId,
      classId: selectedNodeShape.classId,
      applicationProfile: selectedNodeShape.isAppProfile,
    },
    {
      skip: selectedNodeShape.modelId == '' || selectedNodeShape.classId === '',
    }
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
    handleFollowUp();
    setSelected({
      associations: [],
      attributes: [],
    });
  };

  const handleSubmit = () => {
    if (!classData) {
      handleFollowUp({
        associations: [],
        attributes: [],
      });
      return;
    }

    handleFollowUp({
      associations:
        classData.association?.filter((a) =>
          selected.associations.includes(a.identifier)
        ) ?? [],
      attributes:
        classData.attribute?.filter((a) =>
          selected.attributes.includes(a.identifier)
        ) ?? [],
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
        <ModalTitle>{t('resource-picker-title')}</ModalTitle>

        <ResourceList
          primaryColumnName={t('attribute-name')}
          handleClick={(id: string | string[]) =>
            handleCheckboxClick(id, 'attributes')
          }
          items={formattedData.attributes}
          type="multiple"
          selected={selected.attributes}
          extraHeader={
            <tr>
              <td colSpan={4}>
                {t('attribute-count-title', {
                  ns: 'common',
                  count: classData?.attribute?.length ?? 0,
                })}
              </td>
            </tr>
          }
        />

        <div style={{ height: '50px' }} />

        <ResourceList
          primaryColumnName={t('association-name')}
          handleClick={(id: string | string[]) =>
            handleCheckboxClick(id, 'associations')
          }
          items={formattedData.associations}
          type="multiple"
          selected={selected.associations}
          extraHeader={
            <tr>
              <td colSpan={4}>
                {t('association-count-title', {
                  ns: 'common',
                  count: classData?.association?.length ?? 0,
                })}
              </td>
            </tr>
          }
        />
      </ModalContent>

      <ModalFooter>
        <Button
          disabled={
            (formattedData.attributes.length > 0 ||
              formattedData.associations.length > 0) &&
            Object.values(selected).flatMap((s) => s).length < 1
          }
          onClick={() => handleSubmit()}
          id="submit-button"
        >
          {formattedData.attributes.length > 0 ||
          formattedData.associations.length > 0
            ? t('add-selected')
            : t('continue')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleClose()}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </WideModal>
  );
}
