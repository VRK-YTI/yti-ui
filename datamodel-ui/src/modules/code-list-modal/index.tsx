import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  ExternalLink,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { FilterBlock, ResultBlock, StatusChip } from './code-list-modal.styles';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';

export default function CodeListModal() {
  const { t, i18n } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState({
    keyword: '',
    server: 'koodistot.suomi.fi',
    group: '',
    status: '',
  });
  const [selected, setSelected] = useState<string[]>([]);

  const [results] = useState([
    {
      label: {
        fi: 'Koodiston nimi',
        en: 'Code list name',
      } as { [key: string]: string },
      languages: ['fi', 'en'],
      description: 'Kuvaus',
      status: 'DRAFT',
      domain: 'Tietoalue',
      uri: 'http://uri.suomi.fi/1',
    },
    {
      label: {
        fi: 'Koodiston nimi',
      } as { [key: string]: string },
      languages: ['fi'],
      description: 'Kuvaus',
      status: 'VALID',
      domain: 'Tietoalue',
      uri: 'http://uri.suomi.fi/2',
    },
    {
      label: {
        fi: 'Koodiston nimi',
        en: 'Code list name',
      } as { [key: string]: string },
      languages: ['fi', 'en'],
      description: 'Kuvaus',
      status: 'DRAFT',
      domain: 'Tietoalue',
      uri: 'http://uri.suomi.fi/3',
    },
  ]);

  const handleClose = () => {
    setFilter({
      keyword: '',
      server: 'koodistot.suomi.fi',
      group: '',
      status: '',
    });
    setVisible(false);
  };

  return (
    <>
      <Button variant="secondary" icon="plus" onClick={() => setVisible(true)}>
        Lisää koodisto
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        <ModalContent>
          <ModalTitle>Lisää viittaus koodistoihin</ModalTitle>

          <FilterBlock>
            <div>
              <TextInput
                labelText="Hae koodistoa"
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    keyword: e?.toString() ?? '',
                  })
                }
              />

              <Dropdown
                labelText="Valitse palvelin"
                defaultValue="koodistot.suomi.fi"
              >
                <DropdownItem value="koodistot.suomi.fi">
                  koodistot.suomi.fi
                </DropdownItem>
              </Dropdown>
            </div>
            <div>
              <Dropdown
                labelText="Näytä ryhmät (rekisteri)"
                defaultValue="all-groups"
              >
                <DropdownItem value="all-groups">Kaikki ryhmät</DropdownItem>
              </Dropdown>

              <Dropdown labelText="Näytä tilat" defaultValue="all-statuses">
                <DropdownItem value="all-statuses">Kaikki tilat</DropdownItem>
              </Dropdown>
            </div>
          </FilterBlock>

          <ResultBlock>
            <Paragraph className="total-results">
              <Text variant="bold">{results.length} koodistoa</Text>
            </Paragraph>

            {results.length > 0 && (
              <div className="results">
                {results.map((result, idx) => (
                  <div key={`code-list-result-${idx}`} className="result">
                    <Checkbox
                      onClick={() =>
                        setSelected((selected) =>
                          selected.includes(result.uri)
                            ? selected.filter((s) => s !== result.uri)
                            : [...selected, result.uri]
                        )
                      }
                    >
                      {getLanguageVersion({
                        data: result.label,
                        lang: i18n.language,
                        appendLocale: true,
                      })}
                    </Checkbox>

                    <div className="subtitle">
                      <div>{result.languages.join(', ')}</div>
                      &middot;
                      <div>{result.domain}</div>
                      &middot;
                      <StatusChip $isValid={result.status === 'VALID'}>
                        {translateStatus(result.status, t)}
                      </StatusChip>
                    </div>

                    <div className="description">{result.description}</div>

                    <div className="link">
                      <ExternalLink href={result.uri} labelNewWindow="">
                        {result.uri}
                      </ExternalLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ResultBlock>
        </ModalContent>

        <ModalFooter>
          <Button disabled={selected.length < 1}>Lisää valitut</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
