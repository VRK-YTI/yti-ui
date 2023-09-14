import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dropdown,
  DropdownItem,
  IconMessage,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock, BasicBlockExtraWrapper } from '../../components/block';
import { NarrowModal } from './own-information.styles';
import { Organization } from '../../interfaces/organization.interface';
import { useTranslation } from 'next-i18next';

interface PermissionModalProps {
  organizations?: Organization[];
  getLanguageVersion: (value: {
    data: { [key: string]: string };
    lang: string;
    appendLocale?: boolean;
  }) => string;
}

export default function PermissionModal({
  organizations,
  getLanguageVersion,
}: PermissionModalProps) {
  const { i18n } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const orgs = useMemo(() => {
    if (!organizations) {
      return [];
    }

    return organizations.map((org) => ({
      labelText: getLanguageVersion({
        data: org.label,
        lang: i18n.language,
        appendLocale: true,
      }),
      uniqueItemId: org.id,
    }));
  }, [organizations, i18n.language]);

  const handleClose = () => {
    setVisible(false);
    setSelectedOrg('');
    setSelectedServices([]);
  };

  const handleSubmit = () => {
    const newErrors: string[] = [];
    if (!selectedOrg || selectedOrg === '') {
      newErrors.concat('Organization not selected');
    }

    if (!selectedServices || selectedServices.length < 1) {
      newErrors.concat('Services not selected');
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      return;
    }
  };

  return (
    <>
      <BasicBlock
        title="Käyttöoikeuspyyntö"
        extra={
          <BasicBlockExtraWrapper>
            <Button
              variant="secondary"
              icon={<IconMessage />}
              onClick={() => setVisible(true)}
            >
              Tee käyttöoikeuspyyntö
            </Button>
          </BasicBlockExtraWrapper>
        }
      >
        Jos haluat muokkausoikeudet sisältöihin, tee käyttöoikeuspyyntö. Pyynnön
        käsittelee organisaation pääkäyttäjä.
      </BasicBlock>

      <NarrowModal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        <ModalContent>
          <ModalTitle>Tee käyttöoikeuspyyntö</ModalTitle>

          <Paragraph>
            <Text>
              Valitse organisaatio, jonka aineistoihin haluat tehdä
              käyttöoikeuspyynnön. Saat ilmoituksen sähköpostilla kun
              käyttöoikeuspyyntö on käsitelty.
            </Text>
          </Paragraph>

          <Dropdown
            labelText="Organisaatio"
            visualPlaceholder="Valitse organisaatio"
            onChange={(value) => setSelectedOrg(value)}
          >
            {orgs.map((org) => (
              <DropdownItem key={org.uniqueItemId} value={org.uniqueItemId}>
                {org.labelText}
              </DropdownItem>
            ))}
          </Dropdown>

          <CheckboxGroup labelText="Palvelut">
            <Checkbox
              checked={selectedServices.includes('terminologies')}
              onClick={({ checkboxState }) =>
                checkboxState
                  ? setSelectedServices(
                      selectedServices.concat('terminologies')
                    )
                  : setSelectedServices(
                      selectedServices.filter((s) => s !== 'terminologies')
                    )
              }
            >
              Sanastot
            </Checkbox>
            <Checkbox
              checked={selectedServices.includes('codelists')}
              onClick={({ checkboxState }) =>
                checkboxState
                  ? setSelectedServices(selectedServices.concat('codelists'))
                  : setSelectedServices(
                      selectedServices.filter((s) => s !== 'codelists')
                    )
              }
            >
              Koodistot
            </Checkbox>
            <Checkbox
              checked={selectedServices.includes('datamodels')}
              onClick={({ checkboxState }) =>
                checkboxState
                  ? setSelectedServices(selectedServices.concat('datamodels'))
                  : setSelectedServices(
                      selectedServices.filter((s) => s !== 'datamodels')
                    )
              }
            >
              Tietomallit
            </Checkbox>
          </CheckboxGroup>
        </ModalContent>

        <ModalFooter>
          <Button>Lähetä pyyntö</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            Peruuta
          </Button>
        </ModalFooter>
      </NarrowModal>
    </>
  );
}
