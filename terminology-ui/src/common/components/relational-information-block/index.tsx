import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import { RelationInfoType } from '@app/modules/edit-concept/new-concept.types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Button,
  Chip,
  IconArrowLeft,
  IconArrowRight,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { ChipBlock } from './relation-information-block.styles';
import RelationModalContent from './relational-modal-content';
import RenderChosen from './render-chosen';
import { ConceptResponseObject } from '@app/common/interfaces/interfaces-v2';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

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
  const [chosen, setChosen] = useState<
    ConceptResponseObject[] | RelationInfoType[]
  >(data[infoKey] ?? []);
  const { t, i18n } = useTranslation('admin');
  const router = useRouter();
  const terminologyId = Array.isArray(router.query.terminologyId)
    ? router.query.terminologyId[0]
    : router.query.terminologyId;
  const [selectedConcepts, setSelectedConcepts] = useState<RelationInfoType[]>(
    data[infoKey] ?? []
  );

  const handleUpdate = (
    concepts: ConceptResponseObject[] | RelationInfoType[]
  ) => {
    const newValue =
      concepts.map((concept) => {
        if ('terminology' in concept) {
          return {
            id: concept.id,
            label: concept.label,
            terminologyId: concept.terminology.prefix,
            terminologyLabel: concept.terminology.label,
          };
        } else {
          return {
            id: concept.id,
            label: concept.label,
            terminologyId: concept.terminologyId,
            terminologyLabel: concept.terminologyLabel,
          };
        }
      }) ?? [];

    setSelectedConcepts(newValue);
    updateData(infoKey, newValue);
  };

  const handleChipClick = (concepts: RelationInfoType[]) => {
    setSelectedConcepts(concepts);
    updateData(infoKey, concepts);

    if (concepts.length < 1) {
      return setChosen([]);
    } else {
      const newIds: string[] = concepts.map((concept) => concept.id);
      setChosen(
        'terminology' in concepts[0]
          ? (chosen as ConceptResponseObject[]).filter(
              (c: ConceptResponseObject) => newIds.includes(c.id)
            )
          : (chosen as RelationInfoType[]).filter((c: RelationInfoType) =>
              newIds.includes(c.id)
            )
      );
    }
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
            chosen={chosen}
            setChosen={setChosen}
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
                      {getLanguageVersion({
                        data: concept.label,
                        lang: i18n?.language,
                      })}
                      {fromOther && ' - '}
                      {fromOther &&
                        getLanguageVersion({
                          data: concept.terminologyLabel ?? {
                            fi: 'TODO: terminology label',
                          },
                          lang: i18n.language,
                        })}
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
  setSelectedConcepts: (
    value: ConceptResponseObject[] | RelationInfoType[]
  ) => void;
  terminologyId: string;
  chipLabel: string;
  chosen: ConceptResponseObject[] | RelationInfoType[];
  setChosen: (value: ConceptResponseObject[] | RelationInfoType[]) => void;
  fromOther?: boolean;
}

function ManageRelationalInfoModal({
  buttonTitle,
  selectedConceptIds,
  setSelectedConcepts,
  terminologyId,
  chipLabel,
  fromOther,
  chosen,
  setChosen,
}: ManageRelationalInfoModalProps) {
  const { t } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [showChosen, setShowChosen] = useState(false);
  const [searchResults, setSearchResults] = useState<ConceptResponseObject[]>(
    []
  );

  const handleClose = () => {
    setVisible(false);
    setShowChosen(false);
    setSearchResults([]);
  };

  const handleChange = () => {
    const choseWithoutHtml = chosen.map((concept) => ({
      id: concept.id,
      label: Object.fromEntries(
        Object.entries(concept.label).map(([lang, label]) => [
          lang,
          label.replaceAll(/<\/*[^>]>/g, ''),
        ])
      ),
      terminologyId:
        'terminology' in concept
          ? concept.terminology.prefix
          : concept.terminologyId,
      terminologyLabel:
        'terminology' in concept
          ? concept.terminology.label
          : concept.terminologyLabel,
      targetId:
        'targetId' in concept
          ? (concept as RelationInfoType).targetId
          : concept.id,
    }));
    setSelectedConcepts(choseWithoutHtml);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
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
          icon={showChosen ? <IconArrowLeft /> : undefined}
          iconRight={!showChosen ? <IconArrowRight /> : undefined}
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
