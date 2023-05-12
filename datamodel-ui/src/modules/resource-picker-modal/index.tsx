import { useTranslation } from 'next-i18next';
import {
  Button,
  Checkbox,
  ExternalLink,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import {
  ListWrapper,
  StyledTable,
  WideModal,
} from './resource-picker-modal.styles';
import { useState } from 'react';
import { useBreakpoints } from 'yti-common-ui/media-query';

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
    id: string,
    type: 'associations' | 'attributes'
  ) => {
    setSelected({
      ...selected,
      [type]: selected[type].includes(id)
        ? selected[type].filter((s) => s !== id)
        : [...selected[type], id],
    });
  };

  const handleGroupClick = (type: 'associations' | 'attributes') => {
    if (
      type === 'associations' &&
      selected[type].length < associations.length
    ) {
      setSelected({
        ...selected,
        [type]: associations.map((a) => a.uri),
      });
      return;
    }

    if (type === 'attributes' && selected[type].length < attributes.length) {
      setSelected({
        ...selected,
        [type]: attributes.map((a) => a.uri),
      });
      return;
    }

    setSelected({
      ...selected,
      [type]: [],
    });
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

        <ListWrapper $spaceBottom={true}>
          <div className="title-row">3 Attribuuttia</div>

          <StyledTable>
            <thead>
              <tr>
                <td>
                  <Checkbox
                    onClick={() => handleGroupClick('attributes')}
                    checked={selected.attributes.length === attributes.length}
                  />
                </td>
                <td>Attribuutin nimi</td>
                <td>Käsite</td>
                <td>Tekninen kuvaus</td>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={`attribute-${attr.uri}`}>
                  <td>
                    <div>
                      <Checkbox
                        onClick={() =>
                          handleCheckboxClick(attr.uri, 'attributes')
                        }
                        checked={selected.attributes.includes(attr.uri)}
                      />
                    </div>
                  </td>
                  <td>
                    <div>
                      {attr.label}
                      <ExternalLink labelNewWindow="" href={attr.url}>
                        {attr.uri}
                      </ExternalLink>
                    </div>
                  </td>
                  <td>
                    <div>
                      <ExternalLink labelNewWindow="" href="#">
                        {attr.label}
                      </ExternalLink>
                      {attr.terminologyName}
                    </div>
                  </td>
                  <td>
                    <div>{attr.description}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </ListWrapper>

        <ListWrapper>
          <div className="title-row">1 Assosaatio</div>

          <StyledTable>
            <thead>
              <tr>
                <td>
                  <Checkbox
                    onClick={() => handleGroupClick('associations')}
                    checked={
                      selected.associations.length === associations.length
                    }
                  />
                </td>
                <td>Assosiaation nimi</td>
                <td>Käsite</td>
                <td>Tekninen kuvaus</td>
              </tr>
            </thead>
            <tbody>
              {associations.map((assoc) => (
                <tr key={`association-${assoc.uri}`}>
                  <td>
                    <div>
                      <Checkbox
                        onClick={() =>
                          handleCheckboxClick(assoc.uri, 'associations')
                        }
                        checked={selected.associations.includes(assoc.uri)}
                      />
                    </div>
                  </td>
                  <td>
                    <div>
                      {assoc.label}
                      <ExternalLink labelNewWindow="" href={assoc.url}>
                        {assoc.uri}
                      </ExternalLink>
                    </div>
                  </td>
                  <td>
                    <div>
                      <ExternalLink labelNewWindow="" href="#">
                        {assoc.label}
                      </ExternalLink>
                      {assoc.terminologyName}
                    </div>
                  </td>
                  <td>
                    <div>{assoc.description}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </ListWrapper>
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
