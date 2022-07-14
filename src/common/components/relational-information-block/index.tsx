import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import PropertyValue from '@app/common/components/property-value';
import { Concepts } from '@app/common/interfaces/concepts.interface';
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
  data: { [key: string]: Concepts[] };
  updateData: (key: string, value: Concepts[]) => void;
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
  const [selectedConcepts, setSelectedConcepts] = useState<Concepts[]>(
    data[infoKey]
  );

  const handleUpdate = (value: Concepts[]) => {
    setSelectedConcepts(value);
    updateData(infoKey, value);
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
            selectedConcepts={selectedConcepts}
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
                        handleUpdate(
                          selectedConcepts.filter((c) => c !== concept)
                        )
                      }
                    >
                      <PropertyValue
                        property={Object.keys(concept.label).map((key) => {
                          const obj = {
                            lang: key,
                            value: concept.label[key],
                            regex: '',
                          };
                          return obj;
                        })}
                        fallbackLanguage={'fi'}
                      />
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
  selectedConcepts: Concepts[];
  setSelectedConcepts: (value: Concepts[]) => void;
  terminologyId: string;
  chipLabel: string;
  fromOther?: boolean;
}

function ManageRelationalInfoModal({
  buttonTitle,
  selectedConcepts,
  setSelectedConcepts,
  terminologyId,
  chipLabel,
  fromOther,
}: ManageRelationalInfoModalProps) {
  const { t } = useTranslation('admin');
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState<Concepts[]>(selectedConcepts);
  const [showChosen, setShowChosen] = useState(false);
  const [searchResults, setSearchResults] = useState<Concepts[]>();

  const handleClose = () => {
    setVisible(false);
    setShowChosen(false);
    setSelectedConcepts(selectedConcepts);
    setChosen([]);
  };

  const handleChange = () => {
    handleClose();
    setSelectedConcepts(chosen);
  };

  const handleSetVisible = () => {
    setChosen(selectedConcepts);
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
              setSearchResults={setSearchResults}
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
            : t('show-chosen', { amount: chosen.length })}
        </Button>
      </div>
    );
  }
}
