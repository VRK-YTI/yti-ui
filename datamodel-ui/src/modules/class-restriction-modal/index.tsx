import ResourceList, { ResultType } from '@app/common/components/resource-list';
import WideModal from '@app/common/components/wide-modal';
import { useTranslation } from 'next-i18next';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { ModalContentWrapper } from './class-restriction-modal.styles';
import { useEffect, useMemo, useState } from 'react';
import { useGetNodeShapesQuery } from '@app/common/components/class/class.slice';
import {
  InternalClass,
  InternalClassInfo,
} from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

interface ClassRestrictionModalProps {
  visible: boolean;
  selectedNodeShape: InternalClassInfo;
  hide: () => void;
  handleFollowUp: (
    createNew?: boolean,
    classRestriction?: InternalClass
  ) => void;
}

export default function ClassRestrictionModal({
  visible,
  selectedNodeShape,
  hide,
  handleFollowUp,
}: ClassRestrictionModalProps) {
  const { t, i18n } = useTranslation('admin');
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState('');
  const { data, isSuccess } = useGetNodeShapesQuery(selectedNodeShape.id);
  const nodeShapes: ResultType[] = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((d) => ({
      ...(d.conceptInfo && {
        concept: {
          label: getLanguageVersion({
            data: d.conceptInfo.conceptLabel,
            lang: i18n.language,
          }),
          link: d.conceptInfo.conceptURI,
          partOf: getLanguageVersion({
            data: d.conceptInfo?.terminologyLabel,
            lang: i18n.language,
            appendLocale: true,
          }),
        },
      }),
      partOf: {
        domains: d.dataModelInfo.groups,
        label: getLanguageVersion({
          data: d.dataModelInfo.label,
          lang: i18n.language,
          appendLocale: true,
        }),
        type: d.dataModelInfo.modelType,
        uri: d.dataModelInfo.uri,
      },
      target: {
        identifier: d.id,
        label: getLanguageVersion({
          data: d.label,
          lang: i18n.language,
        }),
        link: d.id,
        linkLabel: d.curie,
        note: getLanguageVersion({
          data: d.note,
          lang: i18n.language,
        }),
        status: d.status,
        isValid: d.status === 'VALID',
      },
    }));
  }, [data, i18n.language]);

  const handleClose = () => {
    setKeyword('');
    hide();
  };

  const handleClick = (id: string | string[]) => {
    if (selected !== id) {
      setSelected(Array.isArray(id) ? id[0] : id);
      return;
    }
    setSelected('');
  };

  useEffect(() => {
    if (isSuccess && data.length < 1) {
      handleFollowUp(true);
    }
  }, [isSuccess, handleFollowUp, data, selected]);

  return (
    <WideModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
    >
      <ModalContent>
        <ModalTitle>{t('add-class')}</ModalTitle>

        <Paragraph>
          <Text>
            {t('class-restriction-description', { count: data?.length ?? 0 })}
          </Text>
        </Paragraph>

        <ModalContentWrapper>
          <div>
            <Text className="block-label">
              {t('selected-data-model-class')}
            </Text>
          </div>

          <div>
            <ResourceList
              handleClick={() => null}
              type="display"
              items={[
                {
                  ...(selectedNodeShape.conceptInfo && {
                    concept: {
                      label: getLanguageVersion({
                        data: selectedNodeShape.conceptInfo.conceptLabel,
                        lang: i18n.language,
                      }),
                      link: selectedNodeShape.conceptInfo.conceptURI,
                      partOf: getLanguageVersion({
                        data: selectedNodeShape.conceptInfo?.terminologyLabel,
                        lang: i18n.language,
                        appendLocale: true,
                      }),
                    },
                  }),
                  partOf: {
                    domains: selectedNodeShape.dataModelInfo.groups,
                    label: getLanguageVersion({
                      data: selectedNodeShape.dataModelInfo.label,
                      lang: i18n.language,
                    }),
                    type: selectedNodeShape.dataModelInfo.modelType,
                    uri: selectedNodeShape.namespace,
                  },
                  target: {
                    identifier: selectedNodeShape.identifier,
                    label: getLanguageVersion({
                      data: selectedNodeShape.label,
                      lang: i18n.language,
                    }),
                    link: selectedNodeShape.id,
                    linkLabel: selectedNodeShape.curie,
                    note: getLanguageVersion({
                      data: selectedNodeShape.note,
                      lang: i18n.language,
                    }),
                    status: selectedNodeShape.status,
                    isValid: selectedNodeShape.status === 'VALID',
                  },
                },
              ]}
              primaryColumnName={t('class-name')}
              id="selected-class-restriction"
            />
          </div>

          <div>
            <Text className="block-label">
              {t('class-restrictions-targeted-at-data-model-class')}
            </Text>
          </div>

          <div>
            <TextInput
              labelMode="hidden"
              labelText=""
              visualPlaceholder={t('search-by-class-name')}
              onChange={(e) => setKeyword(e?.toString() ?? '')}
              defaultValue={keyword}
              debounce={300}
              id="search-text-input"
            />
          </div>

          <div>
            <ResourceList
              handleClick={(value: string | string[]) => handleClick(value)}
              items={
                keyword === ''
                  ? nodeShapes
                  : nodeShapes.filter((n) =>
                      n.target.label
                        .toLowerCase()
                        .includes(keyword.toLowerCase())
                    )
              }
              primaryColumnName={t('class-name')}
              selected={selected}
              id="available-class-restrictions"
            />
          </div>
        </ModalContentWrapper>
      </ModalContent>

      <ModalFooter>
        <Button
          disabled={!selected || selected === ''}
          onClick={() =>
            handleFollowUp(
              false,
              data?.find((d) => d.id === selected)
            )
          }
          id="select-class-restriction-button"
        >
          {t('select-class-restriction')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleFollowUp(true)}
          id="create-new-class-restriction-button"
        >
          {t('create-new-class-restriction')}
        </Button>
        <Button
          variant="secondaryNoBorder"
          onClick={() => handleClose()}
          id="cancel-button"
        >
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </WideModal>
  );
}
