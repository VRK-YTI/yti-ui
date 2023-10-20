import MultiColumnSearch from '@app/common/components/multi-column-search';
import { ResultType } from '@app/common/components/resource-list';
import {
  InternalResourcesSearchParams,
  initialSearchData,
  useGetInternalResourcesInfoMutation,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import WideModal from '@app/common/components/wide-modal';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { UriData } from '@app/common/interfaces/uri.interface';
import {
  translateResourceAddition,
  translateResourceName,
} from '@app/common/utils/translation-helpers';
import { mapInternalClassInfoToResultType } from '@app/modules/class-restriction-modal/utils';
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

interface ResourceModalProps {
  modelId: string;
  type: ResourceType;
  buttonTranslations: {
    useSelected: string;
    createNew?: string;
    openButton?: string;
  };
  handleFollowUp: (value?: UriData) => void;
  defaultSelected?: string;
  buttonIcon?: boolean;
  applicationProfile?: boolean;
  hideSelfReference?: string;
  buttonVariant?: 'secondary' | 'secondaryNoBorder';
}

export default function ResourceModal({
  modelId,
  type,
  buttonTranslations,
  handleFollowUp,
  defaultSelected,
  buttonIcon,
  applicationProfile,
  hideSelfReference,
  buttonVariant,
}: ResourceModalProps) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(
    defaultSelected ? defaultSelected : ''
  );
  const [contentLanguage, setContentLanguage] = useState<string>();
  const [resultsFormatted, setResultsFormatted] = useState<ResultType[]>([]);
  const [searchParams, setSearchParams] =
    useState<InternalResourcesSearchParams>(
      initialSearchData(i18n.language, modelId, type)
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

    if (defaultSelected && defaultSelected !== selectedId) {
      setSelectedId(defaultSelected);
    }
  };

  const handleClose = () => {
    setSearchParams(initialSearchData(i18n.language, modelId, type));
    setContentLanguage(undefined);
    setVisible(false);
    setSelectedId('');
  };

  const handleSubmit = () => {
    if (!selectedId || selectedId === '' || !result.data) {
      handleFollowUp();
      handleClose();
      return;
    }

    const selectedObj = result.data.responseObjects.find(
      (obj) => obj.id === selectedId
    );

    if (selectedObj) {
      handleFollowUp({
        uri: selectedObj.id,
        curie: selectedObj.curie,
        label: selectedObj.label,
      });
    }
    handleClose();
  };

  useEffect(() => {
    if (result.isSuccess) {
      setResultsFormatted(
        result.data.responseObjects
          .filter((r) => r.id !== hideSelfReference)
          .map((r) =>
            mapInternalClassInfoToResultType(
              r,
              contentLanguage ?? i18n.language
            )
          )
      );
    }
  }, [result, i18n.language, contentLanguage, t, hideSelfReference]);

  return (
    <>
      <Button
        variant={buttonVariant ?? 'secondary'}
        icon={buttonIcon ? <IconPlus /> : undefined}
        onClick={() => handleOpen()}
        id="add-resource-button"
      >
        {buttonTranslations.openButton ??
          translateResourceAddition(type, t, applicationProfile)}
      </Button>

      <WideModal
        appElementId="__next"
        visible={visible}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => setVisible(false)}
      >
        <ModalContent>
          <ModalTitle>{translateResourceAddition(type, t)}</ModalTitle>
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
            languageVersioned
            modelId={modelId}
          />
        </ModalContent>

        <ModalFooter>
          <Button
            disabled={selectedId === ''}
            onClick={() => handleSubmit()}
            id="use-selected-button"
          >
            {buttonTranslations.useSelected}
          </Button>

          {buttonTranslations.createNew && (
            <Button
              variant="secondary"
              icon={<IconPlus />}
              disabled={selectedId !== ''}
              onClick={() => handleSubmit()}
              id="create-new-button"
            >
              {buttonTranslations.createNew}
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
      </WideModal>
    </>
  );
}
