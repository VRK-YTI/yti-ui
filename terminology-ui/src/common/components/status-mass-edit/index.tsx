import { StatusCountsObjects } from '@app/common/interfaces/status-counts.interface';
import useUrlState from '@app/common/utils/hooks/use-url-state';
import { translateStatus } from '@app/common/utils/translation-helpers';
import { DownloadIndicator } from '@app/modules/new-terminology/new-terminology.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  InlineAlert,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  SingleSelect,
  SingleSelectData,
  Text,
} from 'suomifi-ui-components';
import { useGetStatusCountsQuery } from '../counts/counts.slice';
import { useModifyStatusesMutation } from '../modify-statuses/modify-statuses.slice';
import { useGetConceptResultQuery } from '../vocabulary/vocabulary.slice';
import {
  ModalContentProcessing,
  ModalContentWrapper,
  SuccessIcon,
} from './status-mass-edit.styles';

interface TargetType {
  concept: boolean;
  term: boolean;
}

const chosenTargetTypeInitial = {
  concept: false,
  term: false,
};

export interface StatusMassEditProps {
  terminologyId: string;
}

export default function StatusMassEdit({ terminologyId }: StatusMassEditProps) {
  const { urlState } = useUrlState();
  const { t, i18n } = useTranslation('admin');
  const [modifyStatuses, result] = useModifyStatusesMutation();
  const [visible, setVisible] = useState(false);
  const [chosenStartState, setChosenStartState] = useState<string | null>(null);
  const [chosenEndState, setChosenEndState] = useState<SingleSelectData | null>(
    null
  );
  const [chosenTargetType, setChosenTargetType] = useState<TargetType>(
    chosenTargetTypeInitial
  );
  const [userPosted, setUserPosted] = useState(false);
  const { data: statusCounts, refetch: refetchCounts } =
    useGetStatusCountsQuery(terminologyId);
  const { refetch } = useGetConceptResultQuery({
    id: terminologyId,
    // Setting type to concept to correctly fetch updated concept
    // if page is set display collection
    urlState: { ...urlState, type: 'concept' },
    language: i18n.language,
  });

  const handleClose = () => {
    refetch();
    refetchCounts();
    setVisible(false);
    setChosenStartState(null);
    setChosenEndState(null);
    setChosenTargetType(chosenTargetTypeInitial);
    setUserPosted(false);
  };

  const handleSetStartState = (value: string | null) => {
    setChosenStartState(value);
    setChosenTargetType(chosenTargetTypeInitial);
    setChosenEndState(null);
  };

  const handleSetChoseTargetType = (key: keyof TargetType, value: boolean) => {
    setChosenTargetType({ ...chosenTargetType, [key]: value });
    setChosenEndState(null);
  };

  const handleSubmit = () => {
    if (
      !chosenStartState ||
      !chosenEndState ||
      chosenTargetType === chosenTargetTypeInitial
    ) {
      return;
    }

    modifyStatuses({
      graphId: terminologyId,
      oldStatus: chosenStartState,
      newStatus: chosenEndState.uniqueItemId,
      types: Object.keys(chosenTargetType)
        .filter((key) => chosenTargetType[key as keyof TargetType])
        .map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
    });

    setUserPosted(true);
  };

  return (
    <>
      <Button variant="secondary" icon="edit" onClick={() => setVisible(true)}>
        {t('change-concepts-status')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
      >
        {!userPosted ? renderSetup() : renderProcess()}
      </Modal>
    </>
  );

  function renderSetup() {
    return (
      <>
        <ModalContent>
          <ModalTitle>{t('change-statuses')}</ModalTitle>

          <ModalContentWrapper>
            <Paragraph>
              <Text>{t('change-statuses-description')}</Text>
            </Paragraph>

            <SingleSelect
              labelText={t('start-state-targets')}
              ariaOptionsAvailableText={t('start-states')}
              clearButtonLabel={t('clear-selected-start-states')}
              noItemsText={t('start-states-not-available')}
              items={[
                {
                  labelText: t('draft', {
                    count: statusCounts
                      ? statusCounts.counts.concepts.DRAFT +
                        statusCounts.counts.terms.DRAFT
                      : 0,
                  }),
                  uniqueItemId: 'DRAFT',
                },
                {
                  labelText: t('valid', {
                    count: statusCounts
                      ? statusCounts.counts.concepts.VALID +
                        statusCounts.counts.terms.VALID
                      : 0,
                  }),
                  uniqueItemId: 'VALID',
                },
                {
                  labelText: t('superseded', {
                    count: statusCounts
                      ? statusCounts.counts.concepts.SUPERSEDED +
                        statusCounts.counts.terms.SUPERSEDED
                      : 0,
                  }),
                  uniqueItemId: 'SUPERSEDED',
                },
                {
                  labelText: t('retired', {
                    count: statusCounts
                      ? statusCounts.counts.concepts.RETIRED +
                        statusCounts.counts.terms.RETIRED
                      : 0,
                  }),
                  uniqueItemId: 'RETIRED',
                },
              ]}
              onItemSelect={(e) => handleSetStartState(e)}
            />

            {typeof chosenStartState === 'string' && (
              <CheckboxGroup labelText={t('select-targets-to-be-changed')}>
                <Checkbox
                  onClick={({ checkboxState }) =>
                    handleSetChoseTargetType('concept', checkboxState)
                  }
                >
                  {t('concepts', {
                    count: statusCounts
                      ? statusCounts.counts.concepts[
                          chosenStartState as keyof StatusCountsObjects
                        ]
                      : 0,
                  })}
                </Checkbox>
                <Checkbox
                  onClick={({ checkboxState }) =>
                    handleSetChoseTargetType('term', checkboxState)
                  }
                >
                  {t('terms', {
                    count: statusCounts
                      ? statusCounts.counts.terms[
                          chosenStartState as keyof StatusCountsObjects
                        ]
                      : 0,
                  })}
                </Checkbox>
              </CheckboxGroup>
            )}

            {typeof chosenStartState === 'string' &&
              (chosenTargetType.concept || chosenTargetType.term) && (
                <SingleSelect
                  labelText={t('targets-end-state')}
                  ariaOptionsAvailableText={t('end-states')}
                  clearButtonLabel={t('clear-selected-end-state')}
                  noItemsText={t('end-states-not-unavailable')}
                  items={[
                    {
                      labelText: translateStatus('DRAFT', t),
                      uniqueItemId: 'DRAFT',
                    },
                    {
                      labelText: translateStatus('VALID', t),
                      uniqueItemId: 'VALID',
                    },
                    {
                      labelText: translateStatus('SUPERSEDED', t),
                      uniqueItemId: 'SUPERSEDED',
                    },
                    {
                      labelText: translateStatus('RETIRED', t),
                      uniqueItemId: 'RETIRED',
                    },
                  ]}
                  onItemSelectionChange={(item) => setChosenEndState(item)}
                  selectedItem={chosenEndState}
                />
              )}
          </ModalContentWrapper>
        </ModalContent>

        <ModalFooter>
          <Button
            disabled={chosenEndState === null}
            onClick={() => handleSubmit()}
          >
            {t('save')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </>
    );
  }

  function renderProcess() {
    return (
      <ModalContentProcessing>
        <ModalTitle>{t('changing-statuses')}</ModalTitle>

        {!result.isError && (
          <div id="loading-block">
            {result.isLoading && (
              <>
                <DownloadIndicator />
                <Text variant="bold">{t('processing')}</Text>
              </>
            )}
            {result.isSuccess && (
              <>
                <SuccessIcon icon="checkCircleFilled" />
                <Text variant="bold">{t('done')}</Text>
              </>
            )}
          </div>
        )}

        {result.isError && (
          <div id="error-block">
            <InlineAlert status="error">
              {t('status-change-failed')}
            </InlineAlert>
          </div>
        )}

        <div>
          {result.isError && (
            <Button onClick={() => handleSubmit()}>{t('try-again')}</Button>
          )}
          <Button
            variant={!result.isError ? 'default' : 'secondary'}
            disabled={result.isLoading}
            onClick={() => handleClose()}
          >
            {t('close')}
          </Button>
        </div>
      </ModalContentProcessing>
    );
  }
}
