import { ClassFormType } from '@app/common/interfaces/class-form.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Expander,
  ExpanderTitleButton,
  ExternalLink,
  HintText,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  RadioButton,
  SearchInput,
  SingleSelect,
  StaticChip,
  Text,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import { useBreakpoints } from 'yti-common-ui/media-query';
import {
  SearchBlock,
  SearchResultWrapper,
  SelectedConceptsGroup,
} from './concept-block.styles';
import { useGetConceptsQuery } from '@app/common/components/concept-search/concept-search.slice';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';

interface ConceptBlockProps {
  concept?: ClassFormType['equivalentClass'][0];
  setConcept: (value: ClassFormType['equivalentClass'][0] | undefined) => void;
}

export default function ConceptBlock({
  concept,
  setConcept,
}: ConceptBlockProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<
    ClassFormType['equivalentClass'][0] | undefined
  >(concept);
  const [terminologyOptions] = useState([
    {
      labelText: t('terminologies-linked-to-data-model'),
      uniqueItemId: 'linked',
    },
    {
      labelText: 'Kaikki sanastot',
      uniqueItemId: 'all',
    },
  ]);

  const { data } = useGetConceptsQuery({
    keyword: keyword,
  });

  const handleOpen = () => {
    setVisible(true);
    if (concept) {
      setSelected(concept);
    }
  };

  const handleClose = () => {
    setSelected(undefined);
    setVisible(false);
  };

  const handleRadioButtonClick = (
    value: ClassFormType['equivalentClass'][0]
  ) => {
    setSelected(value);
  };

  const handleSubmit = () => {
    setConcept(selected);
    handleClose();
  };

  return (
    <>
      <BasicBlock title={t('concept')}>
        {!concept ? (
          <InlineAlert status="warning" style={{ marginBottom: '5px' }}>
            {t('concept-undefined')}
          </InlineAlert>
        ) : (
          <SelectedConceptsGroup
            closeAllText=""
            openAllText=""
            showToggleAllButton={false}
          >
            <Expander>
              <ExpanderTitleButton>
                {t('concept-definition')}
                <HintText>
                  {getLanguageVersion({
                    data: concept.label,
                    lang: i18n.language,
                  })}
                </HintText>
              </ExpanderTitleButton>
            </Expander>
          </SelectedConceptsGroup>
        )}
        <Button
          variant="secondary"
          style={{ width: 'min-content', whiteSpace: 'nowrap' }}
          onClick={() => handleOpen()}
        >
          {t('select-concept')}
        </Button>

        <Modal
          appElementId="__next"
          visible={visible}
          variant={isSmall ? 'smallScreen' : 'default'}
          onEscKeyDown={() => setVisible(false)}
        >
          <ModalContent>
            <ModalTitle>{t('select-concept')}</ModalTitle>
            <SearchBlock>
              <SearchInput
                labelText={t('search-concept')}
                clearButtonLabel={t('clear-selection')}
                searchButtonLabel={t('search-concept')}
                onChange={(e) => setKeyword(e?.toString() ?? '')}
                debounce={300}
              />
              <SingleSelect
                clearButtonLabel={t('clear-selection')}
                labelText={t('terminology')}
                noItemsText={t('no-terminologies-available')}
                ariaOptionsAvailableText={t('terminologies-available')}
                allowItemAddition={false}
                defaultSelectedItem={terminologyOptions.find(
                  (o) => o.uniqueItemId === 'linked'
                )}
                items={terminologyOptions}
              />
            </SearchBlock>

            {!data || data.totalHitCount < 1 ? (
              <Text>{t('search-concept-by-keyword')}</Text>
            ) : (
              <>
                <Text variant="bold">
                  {t('concept-counts', { count: data?.totalHitCount })}
                </Text>
                <SearchResultWrapper>
                  {data.concepts.map((concept, idx) => (
                    <div
                      key={`concept-result-${idx}`}
                      className={
                        selected?.identifier === concept.uri
                          ? 'item-wrapper selected'
                          : 'item-wrapper'
                      }
                    >
                      <RadioButton
                        value={concept.uri}
                        checked={selected?.identifier === concept.uri}
                        onChange={() =>
                          handleRadioButtonClick({
                            label: concept.label,
                            identifier: concept.uri,
                          })
                        }
                      />
                      <div>
                        <Text>
                          <SanitizedTextContent
                            text={getLanguageVersion({
                              data: concept.label,
                              lang: i18n.language,
                              appendLocale: true,
                            })}
                          />
                        </Text>
                        <div className="subtitle">
                          <Text>Sanaston nimi</Text>
                          <StaticChip
                            className={
                              concept.status === 'VALID' ? 'valid' : 'other'
                            }
                          >
                            {translateStatus(concept.status, t)}
                          </StaticChip>
                        </div>

                        <Text className="description">
                          <SanitizedTextContent
                            text={getLanguageVersion({
                              data: concept.definition,
                              lang: i18n.language,
                              appendLocale: true,
                            })}
                          />
                        </Text>
                        <br />
                        <ExternalLink href={concept.uri} labelNewWindow="">
                          {concept.uri}
                        </ExternalLink>
                      </div>
                    </div>
                  ))}
                </SearchResultWrapper>
              </>
            )}
          </ModalContent>

          <ModalFooter>
            <Button disabled={!selected} onClick={() => handleSubmit()}>
              {t('select-concept')}
            </Button>
            <Button variant="secondary" onClick={() => handleClose()}>
              {t('cancel-variant')}
            </Button>
          </ModalFooter>
        </Modal>
      </BasicBlock>
    </>
  );
}
