import MultiColumnSearch from '@app/common/components/multi-column-search';
import { ResultType } from '@app/common/components/resource-list';
import {
  InternalResourcesSearchParams,
  initialSearchData,
  useGetInternalResourcesInfoMutation,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { UriData } from '@app/common/interfaces/uri.interface';
import {
  translateResourceAddition,
  translateResourceName,
} from '@app/common/utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  IconPlus,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { mapInternalClassInfoToResultType } from '../class-restriction-modal/utils';
import LargeModal from '@app/common/components/large-modal';

interface ResourceModalProps {
  modelId: string;
  type: ResourceType;
  handleFollowUp: (value: {
    uriData: UriData;
    mode: 'create' | 'select';
    type: ResourceType;
  }) => void;
  buttonIcon?: boolean;
  limitSearchTo?: 'LIBRARY' | 'PROFILE';
  limitToSelect?: boolean;
  applicationProfile?: boolean;
}

export default function ResourceModal({
  modelId,
  type,
  handleFollowUp,
  buttonIcon,
  limitSearchTo,
  limitToSelect,
  applicationProfile,
}: ResourceModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [contentLanguage, setContentLanguage] = useState<string>();
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>(
      initialSearchData(i18n.language, modelId, type, limitSearchTo)
    );
  const [searchInternalResources, result] =
    useGetInternalResourcesInfoMutation();

  const handleSearch = (obj?: InternalResourcesSearchParams) => {
    if (obj) {
      setSearchParams(obj);
    }

    searchInternalResources(obj ?? searchParams);
  };

  const handleOpen = () => {
    setVisible(true);
    handleSearch();
  };

  const handleClose = () => {
    setSearchParams(
      initialSearchData(i18n.language, modelId, type, limitSearchTo)
    );
    setContentLanguage(undefined);
    setVisible(false);
    setSelectedId('');
  };

  const handleSubmit = (mode: 'create' | 'select') => {
    if (!selectedId || selectedId === '' || !result.data) {
      return;
    }

    const selectedObj = result.data.responseObjects.find(
      (obj) => obj.id === selectedId
    );

    if (selectedObj) {
      handleFollowUp({
        uriData: {
          uri: selectedObj.id,
          curie: selectedObj.curie,
          label: selectedObj.label,
        },
        mode: mode,
        type: type,
      });
    }
    handleClose();
  };

  useEffect(() => {
    if (result.isSuccess) {
      setResultsFormatted(
        result.data.responseObjects.map((r) =>
          mapInternalClassInfoToResultType(r, contentLanguage ?? i18n.language)
        )
      );
    }
  }, [result, i18n.language, contentLanguage, t]);

  return (
    <div>
      <Button
        variant="secondary"
        icon={buttonIcon ? <IconPlus /> : undefined}
        onClick={() => handleOpen()}
        id="add-resource-button"
      >
        {translateResourceAddition(type, t, applicationProfile)}
      </Button>

      <LargeModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>
            {translateResourceAddition(type, t, applicationProfile)}
          </ModalTitle>
          <MultiColumnSearch
            primaryColumnName={translateResourceName(
              type,
              t,
              applicationProfile
            )}
            result={{
              totalHitCount: result.data?.totalHitCount ?? 0,
              items: resultsFormatted,
            }}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            searchParams={searchParams}
            setSearchParams={handleSearch}
            setContentLanguage={setContentLanguage}
            multiTypeSelection={applicationProfile}
            languageVersioned
            modelId={modelId}
          />
        </ModalContent>

        <ModalFooter>
          <Button
            disabled={
              (applicationProfile &&
                searchParams.limitToModelType === 'LIBRARY') ||
              selectedId === ''
            }
            onClick={() => handleSubmit('select')}
            id="use-selected-button"
          >
            {translateResourceAddition(type, t, applicationProfile)}
          </Button>

          {!limitToSelect && (
            <Button
              variant="secondary"
              icon={<IconPlus />}
              disabled={
                searchParams.limitToModelType !== 'LIBRARY' || selectedId === ''
              }
              onClick={() => handleSubmit('create')}
              id="create-new-button"
            >
              {type === ResourceType.ASSOCIATION
                ? t('create-new-association-constraint')
                : t('create-new-attribute-constraint')}
            </Button>
          )}

          <Button
            variant="secondaryNoBorder"
            onClick={() => handleClose()}
            id="cancel-button"
          >
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </LargeModal>
    </div>
  );
}
