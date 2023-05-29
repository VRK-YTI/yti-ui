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
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateResourceType } from '@app/common/utils/translation-helpers';

interface ClassRestrictionModalProps {
  visible: boolean;
  selectedNodeShape: InternalClass;
  hide: () => void;
  handleFollowUp: (createNew?: boolean) => void;
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
      subClass: {
        label: 'subClassLabel',
        link: 'link',
        partOf: 'partOf',
      },
      partOf: {
        domains: ['domain-1'],
        label: 'partOfLabel',
        type: translateResourceType(d.resourceType, t),
      },
      target: {
        identifier: d.id,
        label: getLanguageVersion({
          data: d.label,
          lang: i18n.language,
        }),
        link: d.id,
        linkLabel: 'linkLabel',
        note: getLanguageVersion({
          data: d.note,
          lang: i18n.language,
        }),
        status: d.status,
        isValid: d.status === 'VALID',
      },
    }));
  }, [data, t, i18n.language]);

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
  }, [isSuccess, handleFollowUp, data]);

  return (
    <WideModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
    >
      <ModalContent>
        <ModalTitle>{t('add-class')}</ModalTitle>

        <Paragraph>
          <Text>{t('class-restriction-description', { count: 0 })}</Text>
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
                  subClass: {
                    label: 'subClassLabel',
                    link: 'link',
                    partOf: 'partOf',
                  },
                  partOf: {
                    domains: ['domain-1'],
                    label: 'partOfLabel',
                    type: 'tyyppi',
                  },
                  target: {
                    identifier: 'id-11',
                    label: 'targetLabel',
                    link: 'link',
                    linkLabel: 'linkLabel',
                    note: 'tekninen kuvaus',
                    status: 'VALID',
                    isValid: true,
                  },
                },
              ]}
              primaryColumnName={t('class-name')}
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
            />
          </div>

          <div>
            <ResourceList
              handleClick={(value: string | string[]) => handleClick(value)}
              items={nodeShapes}
              primaryColumnName={t('class-name')}
              selected={selected}
            />
          </div>
        </ModalContentWrapper>
      </ModalContent>

      <ModalFooter>
        <Button
          disabled={!selected || selected === ''}
          onClick={() => handleFollowUp()}
        >
          {t('select-class-restriction')}
        </Button>
        <Button variant="secondary" onClick={() => handleFollowUp(true)}>
          {t('create-new-class-restriction')}
        </Button>
        <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </WideModal>
  );
}
