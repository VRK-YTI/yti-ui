import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import PropertyValue from '@app/common/components/property-value';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { RelationInfoType } from '@app/modules/edit-concept/new-concept.types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { ChipBlock } from './relation-information-block.styles';
import RenderChosen from './render-chosen';
import RenderConcepts from './render-concepts';
import Search from './search';

interface RelationalInformationBlockProps {
  infoKey: string;
  title: string;
  buttonTitle: string;
  description: string;
  chipLabel: string;
  data: { [key: string]: RelationInfoType[] };
  updateData: (key: string, value: RelationInfoType[]) => void;
  fromOther?: boolean;
}

export default function RelationalInformationBlock({
  infoKey,
  title,
  buttonTitle,
  description,
  chipLabel,
  data,
  updateData,
  fromOther,
}: RelationalInformationBlockProps) {
  const router = useRouter();
  const terminologyId = Array.isArray(router.query.terminologyId)
    ? router.query.terminologyId[0]
    : router.query.terminologyId;
  const [selectedConcepts, setSelectedConcepts] = useState<RelationInfoType[]>(
    data[infoKey] ?? []
  );

  const handleUpdate = (concepts: Concepts[]) => {
    const newValue =
      concepts.map((concept) => ({
        id: concept.id,
        label: concept.label,
        terminologyId: concept.terminology.id,
        terminologyLabel: concept.terminology.label,
      })) ?? [];

    setSelectedConcepts(newValue);
    updateData(infoKey, newValue);
  };

  const handleChipClick = (concepts: RelationInfoType[]) => {
    setSelectedConcepts(concepts);
    updateData(infoKey, concepts);
  };

  if (!terminologyId) {
    return null;
  }

  return (
    <BasicBlock
      title={title}
      extra={
        <BasicBlockExtraWrapper>
          <ManageRelationalInfoModal
            buttonTitle={buttonTitle}
            selectedConceptIds={selectedConcepts.map((concept) => concept.id)}
            setSelectedConcepts={handleUpdate}
            terminologyId={terminologyId}
            chipLabel={chipLabel}
            fromOther={fromOther}
          />

          {selectedConcepts?.length > 0 ? (
            <div style={{ marginTop: '20px' }}>
              <Paragraph>
                <Text variant="bold" smallScreen>
                  {chipLabel}
                </Text>
              </Paragraph>

              <ChipBlock>
                {selectedConcepts.map((concept) => {
                  return (
                    <Chip
                      key={concept.id}
                      removable
                      onClick={() =>
                        handleChipClick(
                          selectedConcepts.filter((c) => c.id !== concept.id)
                        )
                      }
                    >
                      <PropertyValue
                        property={Object.keys(concept.label).map((lang) => ({
                          lang,
                          value: concept.label[lang],
                          regex: '',
                        }))}
                        fallbackLanguage="fi"
                      />

                      {fromOther && ' - '}
                      {fromOther && (
                        <PropertyValue
                          property={Object.keys(concept.terminologyLabel).map(
                            (lang) => ({
                              lang,
                              value: concept.terminologyLabel[lang],
                              regex: '',
                            })
                          )}
                          fallbackLanguage="fi"
                        />
                      )}
                    </Chip>
                  );
                })}
              </ChipBlock>
            </div>
          ) : null}
        </BasicBlockExtraWrapper>
      }
    >
      {description}
    </BasicBlock>
  );
}

interface ManageRelationalInfoModalProps {
  buttonTitle: string;
  selectedConceptIds: string[];
  setSelectedConcepts: (value: Concepts[]) => void;
  terminologyId: string;
  chipLabel: string;
  fromOther?: boolean;
}

function ManageRelationalInfoModal({
  buttonTitle,
  selectedConceptIds,
  setSelectedConcepts,
  terminologyId,
  chipLabel,
  fromOther,
}: ManageRelationalInfoModalProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [showChosen, setShowChosen] = useState(false);
  const [searchResults, setSearchResults] = useState<Concepts[]>([]);
  const [chosen, setChosen] = useState<Concepts[]>([]);

  const handleSetSearchResults = (value: Concepts[]) => {
    if (value !== searchResults) {
      setSearchResults(value);
      setChosen(
        value.filter((concept) => selectedConceptIds.includes(concept.id))
      );
    }
  };

  const handleClose = () => {
    setVisible(false);
    setShowChosen(false);
    setSelectedConcepts(
      searchResults.filter((result) => selectedConceptIds.includes(result.id))
    );
    setChosen([]);
  };

  const handleChange = () => {
    handleClose();
    setSelectedConcepts(chosen);
  };

  const handleSetVisible = () => {
    setChosen(
      searchResults.filter((result) => selectedConceptIds.includes(result.id))
    );
    setVisible(true);
  };

  return (
    <>
      <Button onClick={() => handleSetVisible()} variant="secondary">
        {buttonTitle}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        <ModalContent>
          <div hidden={showChosen}>
            <ModalTitle>{buttonTitle}</ModalTitle>

            <Search
              setSearchResults={handleSetSearchResults}
              terminologyId={terminologyId}
              fromOther={fromOther ? true : false}
            />
            <RenderConcepts
              concepts={searchResults}
              chosen={chosen}
              setChosen={setChosen}
              terminologyId={terminologyId}
              fromOther={fromOther ? true : false}
            />
          </div>

          <div hidden={!showChosen}>
            <ModalTitle>{renderToggleView()}</ModalTitle>

            <RenderChosen
              chosen={chosen}
              setChosen={setChosen}
              setShowChosen={setShowChosen}
              chipLabel={chipLabel}
            />
          </div>
        </ModalContent>

        <ModalFooter>
          {renderToggleView()}

          <Button onClick={() => handleChange()}>{t('add-concepts')}</Button>
          <Button onClick={() => handleClose()} variant="secondary">
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  function renderToggleView() {
    if (!chosen || chosen.length < 1) {
      return null;
    }

    return (
      <div>
        <Button
          variant="secondaryNoBorder"
          icon={showChosen ? 'arrowLeft' : undefined}
          iconRight={!showChosen ? 'arrowRight' : undefined}
          onClick={() => setShowChosen(!showChosen)}
        >
          {showChosen
            ? t('add-more-concepts')
            : t('show-chosen', { count: chosen.length })}
        </Button>
      </div>
    );
  }
}
