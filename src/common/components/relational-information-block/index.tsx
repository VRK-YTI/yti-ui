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
import { useBreakpoints } from '../media-query/media-query-context';
import { ChipBlock } from './relation-information-block.styles';
import RelationModalContent from './relational-modal-content';
import RenderChosen from './render-chosen';

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
  const { t } = useTranslation('admin');
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

              <ChipBlock id="selected-concepts-chip-block">
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
                      {concept.label ? (
                        <PropertyValue
                          property={Object.keys(concept.label).map((lang) => ({
                            lang,
                            value: concept.label[lang],
                            regex: '',
                          }))}
                        />
                      ) : (
                        t('concept-label-undefined', { ns: 'common' })
                      )}
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
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [showChosen, setShowChosen] = useState(false);
  const [chosen, setChosen] = useState<Concepts[]>([]);
  const [searchResults, setSearchResults] = useState<Concepts[]>([]);

  const handleClose = () => {
    setVisible(false);
    setShowChosen(false);
    setChosen([]);
    setSearchResults([]);
  };

  const handleChange = () => {
    handleClose();
    const choseWithoutHtml = chosen.map((concept) => ({
      ...concept,
      label: Object.fromEntries(
        Object.entries(concept.label).map(([lang, label]) => [
          lang,
          label.replaceAll(/<\/*[^>]>/g, ''),
        ])
      ),
    }));
    setSelectedConcepts(choseWithoutHtml);
    setSearchResults([]);
  };

  const handleSetVisible = () => {
    setChosen(
      searchResults.filter((result) => selectedConceptIds.includes(result.id))
    );
    setVisible(true);
  };

  return (
    <>
      <Button
        onClick={() => handleSetVisible()}
        variant="secondary"
        className="relational-info-modal-button"
      >
        {buttonTitle}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <div hidden={showChosen}>
            <ModalTitle>{buttonTitle}</ModalTitle>
            <RelationModalContent
              fromOther={fromOther}
              chosen={chosen}
              setChosen={setChosen}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              terminologyId={terminologyId}
              initialChosenConcepts={selectedConceptIds}
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

          <Button onClick={() => handleChange()} id="submit-button">
            {t('add-concepts')}
          </Button>
          <Button
            onClick={() => handleClose()}
            variant="secondary"
            id="cancel-button"
          >
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
          id="switch-view-button"
        >
          {showChosen
            ? t('add-more-concepts')
            : t('show-chosen', { count: chosen.length })}
        </Button>
      </div>
    );
  }
}
