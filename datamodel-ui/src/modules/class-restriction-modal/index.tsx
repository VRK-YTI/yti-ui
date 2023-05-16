import ResourceList from '@app/common/components/resource-list';
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
import { useState } from 'react';

interface ClassRestrictionModalProps {
  visible: boolean;
  hide: () => void;
}

export default function ClassRestrictionModal({
  visible,
  hide,
}: ClassRestrictionModalProps) {
  const { t } = useTranslation('admin');
  const [keyword, setKeyword] = useState('');

  const handleClose = () => {
    setKeyword('');
    hide();
  };

  return (
    <WideModal
      appElementId="__next"
      visible={visible}
      onEscKeyDown={() => handleClose()}
    >
      <ModalContent>
        <ModalTitle>Lisää luokka</ModalTitle>

        <Paragraph>
          <Text>
            Valitulle ydintietomallin luokalle on tehty jo X rajoiteluokkaa.
            Haluatko ottaa niistä jonkun pohjaksi vai haluatko tehdä uuden
            rajoiteluokan?
          </Text>
        </Paragraph>

        <ModalContentWrapper>
          <div>
            <Text className="block-label">Valittu ydintietomallin luokka</Text>
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
              primaryColumnName="Luokan nimi"
            />
          </div>

          <div>
            <Text className="block-label">
              Ydintietomallin luokkaan kohdistuvat luokkarajoitteet
            </Text>
          </div>

          <div>
            <TextInput
              labelMode="hidden"
              labelText=""
              visualPlaceholder="Hae luokan nimellä"
              onChange={(e) => setKeyword(e?.toString() ?? '')}
              defaultValue={keyword}
              debounce={300}
            />
          </div>

          <div>
            <ResourceList
              handleClick={() => null}
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
                    identifier: 'id-1',
                    label: 'targetLabel',
                    link: 'link',
                    linkLabel: 'linkLabel',
                    note: 'tekninen kuvaus',
                    status: 'VALID',
                    isValid: true,
                  },
                },
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
                    identifier: 'id-2',
                    label: 'targetLabel',
                    link: 'link',
                    linkLabel: 'linkLabel',
                    note: 'tekninen kuvaus',
                    status: 'VALID',
                    isValid: true,
                  },
                },
                {
                  subClass: {
                    label: 'subClassLabel',
                    link: 'link',
                    partOf: 'partOf',
                  },
                  partOf: {
                    domains: ['domain-2'],
                    label: 'partOfLabel',
                    type: 'tyyppi',
                  },
                  target: {
                    identifier: 'id-3',
                    label: 'targetLabel',
                    link: 'link',
                    linkLabel: 'linkLabel',
                    note: 'tekninen kuvaus',
                    status: 'VALID',
                    isValid: true,
                  },
                },
              ]}
              primaryColumnName="Luokan nimi"
            />
          </div>
        </ModalContentWrapper>
      </ModalContent>

      <ModalFooter>
        <Button>Valitse luokkarajoite</Button>
        <Button variant="secondary">Luo uusi luokkarajoite</Button>
        <Button variant="secondaryNoBorder" onClick={() => handleClose()}>
          {t('cancel-variant')}
        </Button>
      </ModalFooter>
    </WideModal>
  );
}
