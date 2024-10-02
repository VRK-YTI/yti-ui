import { useTranslation } from 'next-i18next';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import ResourceList, { ResultType } from '@app/common/components/resource-list';
import {
  useGetClassQuery,
  useGetExternalClassQuery,
} from '@app/common/components/class/class.slice';
import WideModal from '@app/common/components/wide-modal';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import {
  convertExternalResourceToResultType,
  convertSimpleResourceToResultType,
} from './util';

interface ResourcePickerProps {
  visible: boolean;
  selectedNodeShape: {
    modelId: string;
    classId: string;
    version?: string;
    isAppProfile: boolean;
    externalId?: string;
  };
  handleFollowUp: (value?: {
    associations: SimpleResource[];
    attributes: SimpleResource[];
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
      version: selectedNodeShape.version,
    },
    {
      skip:
        selectedNodeShape.modelId == '' ||
        selectedNodeShape.classId === '' ||
        !!selectedNodeShape.externalId,
    }
  );

  const { data: extData, isSuccess: isSuccessExt } = useGetExternalClassQuery(
    {
      uri: selectedNodeShape.externalId ?? '',
    },
    {
      skip: !selectedNodeShape.externalId,
    }
  );

  const formattedData = useMemo<{
    associations: ResultType[];
    attributes: ResultType[];
  }>(() => {
    if (isSuccess && classData) {
      return {
        associations: convertSimpleResourceToResultType(
          classData.association ?? [],
          i18n.language
        ),
        attributes: convertSimpleResourceToResultType(
          classData.attribute ?? [],
          i18n.language
        ),
      };
    } else if (isSuccessExt && extData) {
      return {
        attributes: convertExternalResourceToResultType(
          extData.attributes ?? [],
          i18n.language
        ),
        associations: convertExternalResourceToResultType(
          extData.associations ?? [],
          i18n.language
        ),
      };
    }

    return {
      associations: [],
      attributes: [],
    };
  }, [isSuccess, isSuccessExt, classData, extData, i18n.language]);

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
    if (!classData && !extData) {
      handleFollowUp({
        associations: [],
        attributes: [],
      });
      return;
    }

    if (classData) {
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
    }

    if (extData) {
      handleFollowUp({
        attributes:
          extData.attributes
            ?.filter((a) => selected.attributes.includes(a.uri))
            .map((a) => {
              return {
                identifier: a.uri,
                label: a.label,
                uri: a.uri,
              } as SimpleResource;
            }) ?? [],
        associations:
          extData.associations
            ?.filter((a) => selected.associations.includes(a.uri))
            .map((a) => {
              return {
                identifier: a.uri,
                label: a.label,
                uri: a.uri,
              } as SimpleResource;
            }) ?? [],
      });
    }
  };

  useEffect(() => {
    if (
      !visible &&
      selected.associations.length > 0 &&
      selected.attributes.length > 0
    ) {
      setSelected({
        associations: [],
        attributes: [],
      });
    }
  }, [visible, selected]);

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
              <td colSpan={3}>
                {t('attribute-count-title', {
                  ns: 'common',
                  count:
                    classData?.attribute?.length ??
                    extData?.attributes?.length ??
                    0,
                })}
              </td>
            </tr>
          }
          id="attribute-list"
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
                  count:
                    classData?.association?.length ??
                    extData?.associations?.length ??
                    0,
                })}
              </td>
            </tr>
          }
          id="association-list"
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
