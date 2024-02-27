import ResourceList, { ResultType } from '@app/common/components/resource-list';
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
import { mapInternalClassInfoToResultType } from './utils';
import LargeModal from '@app/common/components/large-modal';

interface ClassRestrictionModalProps {
  visible: boolean;
  selectedTargetClass: InternalClassInfo;
  hide: () => void;
  handleFollowUp: (
    createNew?: boolean,
    classRestriction?: InternalClass
  ) => void;
}

export default function ClassRestrictionModal({
  visible,
  selectedTargetClass,
  hide,
  handleFollowUp,
}: ClassRestrictionModalProps) {
  const { t, i18n } = useTranslation('admin');
  const [keyword, setKeyword] = useState('');
  const [selectedClassOrNodeShape, setTargetClassOrNodeShape] = useState(
    selectedTargetClass.id
  );
  const { data, isSuccess } = useGetNodeShapesQuery(selectedTargetClass.id);
  const nodeShapes: ResultType[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map((d) => mapInternalClassInfoToResultType(d, i18n.language));
  }, [data, i18n.language]);

  const handleClose = () => {
    setKeyword('');
    hide();
  };

  const handleClick = (id: string | string[]) => {
    if (selectedClassOrNodeShape !== id) {
      setTargetClassOrNodeShape(Array.isArray(id) ? id[0] : id);
      return;
    }
    setTargetClassOrNodeShape('');
  };

  useEffect(() => {
    if (isSuccess && data.length < 1) {
      handleFollowUp(true);
    }
  }, [isSuccess, handleFollowUp, data, selectedClassOrNodeShape]);

  return (
    <LargeModal
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
              handleClick={(value) => handleClick(value)}
              selected={selectedClassOrNodeShape}
              items={[
                mapInternalClassInfoToResultType(
                  selectedTargetClass,
                  i18n.language
                ),
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
              debounce={300}
              id="search-text-input"
            />
          </div>

          <div>
            <ResourceList
              handleClick={(value) => handleClick(value)}
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
              selected={selectedClassOrNodeShape}
              id="available-class-restrictions"
            />
          </div>
        </ModalContentWrapper>
      </ModalContent>

      <ModalFooter>
        <Button
          disabled={
            !selectedClassOrNodeShape ||
            selectedClassOrNodeShape === '' ||
            selectedClassOrNodeShape === selectedTargetClass.id
          }
          onClick={() =>
            handleFollowUp(
              false,
              data?.find((d) => d.id === selectedClassOrNodeShape)
            )
          }
          id="select-class-restriction-button"
        >
          {t('select-class-restriction')}
        </Button>
        <Button
          disabled={selectedClassOrNodeShape !== selectedTargetClass.id}
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
    </LargeModal>
  );
}
