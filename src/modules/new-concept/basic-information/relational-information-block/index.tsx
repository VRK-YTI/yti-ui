import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components';
import {
  ChipBlock,
  ModalFooterFitted,
} from './relation-information-block.styles';
import RenderChosen from './render-chosen';
import RenderConcepts from './render-concepts';
import Search from './search';

export default function RelationalInformationBlock({
  title,
  buttonTitle,
  description,
  chipDescription,
  fromOther,
}: any) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [selectedConcepts, setSelectedConcepts] = useState<any[]>([]);

  return (
    <BasicBlock
      title={title}
      extra={
        <BasicBlockExtraWrapper>
          <ManageRelationalInfoModal
            buttonTitle={buttonTitle}
            selectedConcepts={selectedConcepts}
            setSelectedConcepts={setSelectedConcepts}
            terminologyId={router.query.terminologyId}
            fromOther={fromOther}
          />

          {selectedConcepts.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Paragraph>
                <Text variant="bold" smallScreen>
                  {chipDescription}
                </Text>
              </Paragraph>

              <ChipBlock>
                {selectedConcepts.map((concept) => {
                  return (
                    <Chip
                      key={concept}
                      removable
                      onClick={() =>
                        setSelectedConcepts(
                          selectedConcepts.filter((c) => c !== concept)
                        )
                      }
                    >
                      {concept.label[i18n.language]}
                    </Chip>
                  );
                })}
              </ChipBlock>
            </div>
          )}
        </BasicBlockExtraWrapper>
      }
    >
      {description}
    </BasicBlock>
  );
}

function ManageRelationalInfoModal({
  buttonTitle,
  selectedConcepts,
  setSelectedConcepts,
  terminologyId,
  fromOther,
}: any) {
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState<any>(selectedConcepts);
  const [showChosen, setShowChosen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setChosen(selectedConcepts);
  }, [selectedConcepts]);

  const handleClose = () => {
    setVisible(false);
    setShowChosen(false);
    setSelectedConcepts(selectedConcepts);
  };

  const handleChange = () => {
    handleClose();
    setSelectedConcepts(chosen);
  };

  return (
    <>
      <Button onClick={() => setVisible(true)} variant="secondary">
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
            {RenderConcepts(
              searchResults,
              chosen,
              setChosen,
              terminologyId,
              fromOther ? true : false
            )}
          </div>

          <div hidden={!showChosen}>
            <ModalTitle>{renderToggleView()}</ModalTitle>

            {RenderChosen(chosen, setChosen, setShowChosen)}
          </div>
        </ModalContent>

        <ModalFooterFitted>
          {renderToggleView()}

          <Button onClick={() => handleChange()}>Lisää käsitteet</Button>
          <Button onClick={() => handleClose()} variant="secondary">
            Peruuta
          </Button>
        </ModalFooterFitted>
      </Modal>
    </>
  );

  function renderToggleView() {
    if (chosen.length < 1) {
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
            ? 'Valitse lisää käsitteitä'
            : `Näytä valinnat (${chosen.length})`}
        </Button>
      </div>
    );
  }
}
