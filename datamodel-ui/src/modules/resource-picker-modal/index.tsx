import { useTranslation } from 'next-i18next';
import {
  Button,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { WideModal } from './resource-picker-modal.styles';
import { useState } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';
import ResourceList from '@app/common/components/resource-list';

interface ResourcePickerProps {
  visible: boolean;
  hide: () => void;
}

export default function ResourcePicker({ visible, hide }: ResourcePickerProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [selected, setSelected] = useState<{
    attributes: string[];
    associations: string[];
  }>({
    attributes: [],
    associations: [],
  });

  const [attributes] = useState([
    {
      label: 'Sisäänkäynti',
      uri: 'jhs:sisaankaynti1',
      url: '#',
      terminologyName: 'Sanaston nimi',
      description: 'Tekninen kuvaus',
    },
    {
      label: 'Sisäänkäynti',
      uri: 'jhs:sisaankaynti2',
      url: '#',
      terminologyName: 'Sanaston nimi',
      description: 'Tekninen kuvaus',
    },
    {
      label: 'Sisäänkäynti',
      uri: 'jhs:sisaankaynti3',
      url: '#',
      terminologyName: 'Sanaston nimi',
      description: 'Tekninen kuvaus',
    },
  ]);

  const [associations] = useState([
    {
      label: 'Rakennuksen osa',
      uri: 'jhs:rakennuksenOsa',
      url: '#',
      terminologyName: 'Sanaston nimi',
      description: 'Tekninen kuvaus',
    },
  ]);

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

  return (
    <WideModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => hide()}
      variant={isSmall ? 'smallScreen' : 'default'}
    >
      <ModalContent>
        <ModalTitle>Lisää ominaisuudet valitusta luokasta</ModalTitle>

        <ResourceList
          primaryColumnName="Attribuutin nimi"
          handleClick={(id: string | string[]) =>
            handleCheckboxClick(id, 'attributes')
          }
          items={[
            {
              partOf: {
                label: 'partOfLabel',
                domains: ['domain1', 'domain2'],
                type: 'type',
              },
              subClass: {
                label: 'subClassLabel',
                link: 'link',
                partOf: 'subClassPartOf',
              },
              target: {
                identifier: 'targetIdentifier',
                label: 'targetLabel',
                link: 'targetLink',
                linkLabel: 'targetLinkLabel',
                note: 'targetNote',
                status: 'targetStatus',
                isValid: false,
              },
            },
            {
              partOf: {
                label: 'partOfLabel2',
                domains: ['domain1'],
                type: 'type',
              },
              subClass: {
                label: 'subClassLabel2',
                link: 'link',
                partOf: 'subClassPartOf',
              },
              target: {
                identifier: 'targetIdentifier2',
                label: 'targetLabel2',
                link: 'targetLink',
                linkLabel: 'targetLinkLabel',
                note: 'targetNote',
                status: 'targetStatus',
                isValid: true,
              },
            },
          ]}
          type="multiple"
          selected={selected.attributes}
          extraHeader={
            <tr>
              <td colSpan={4}>2 Attribuuttia</td>
            </tr>
          }
        />

        <div style={{ height: '50px' }} />

        <ResourceList
          primaryColumnName="Assosiaation nimi"
          handleClick={(id: string | string[]) =>
            handleCheckboxClick(id, 'associations')
          }
          items={[
            {
              partOf: {
                label: 'partOfLabel',
                domains: ['domain1', 'domain2'],
                type: 'type',
              },
              subClass: {
                label: 'subClassLabel',
                link: 'link',
                partOf: 'subClassPartOf',
              },
              target: {
                identifier: 'targetIdentifier',
                label: 'targetLabel',
                link: 'targetLink',
                linkLabel: 'targetLinkLabel',
                note: 'targetNote',
                status: 'targetStatus',
                isValid: false,
              },
            },
            {
              partOf: {
                label: 'partOfLabel2',
                domains: ['domain1'],
                type: 'type',
              },
              subClass: {
                label: 'subClassLabel2',
                link: 'link',
                partOf: 'subClassPartOf',
              },
              target: {
                identifier: 'targetIdentifier2',
                label: 'targetLabel2',
                link: 'targetLink',
                linkLabel: 'targetLinkLabel',
                note: 'targetNote',
                status: 'targetStatus',
                isValid: true,
              },
            },
          ]}
          type="multiple"
          selected={selected.associations}
          extraHeader={
            <tr>
              <td colSpan={4}>2 Assosiaatiota</td>
            </tr>
          }
        />
      </ModalContent>

      <ModalFooter>
        <Button disabled={Object.values(selected).flatMap((s) => s).length < 1}>
          {t('add-selected')}
        </Button>
        <Button variant="secondary" onClick={() => hide()}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </WideModal>
  );
}
