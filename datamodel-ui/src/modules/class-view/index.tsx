import {
  resetClass,
  setClass,
  useGetClassQuery,
} from '@app/common/components/class/class.slice';
import { initialClassForm } from '@app/common/interfaces/class-form.interface';
import {
  InternalClass,
  InternalClassInfo,
} from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import ClassForm from '../class-form';
import ClassModal from '../class-modal';
import {
  DEFAULT_SUBCLASS_OF,
  classTypeToClassForm,
  internalClassToClassForm,
} from './utils';
import DrawerItemList from '@app/common/components/drawer-item-list';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import HasPermission from '@app/common/utils/has-permission';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { DetachedPagination } from 'yti-common-ui/pagination';
import { useStoreDispatch } from '@app/store';
import {
  resetHovered,
  resetSelected,
  selectClassView,
  selectDisplayLang,
  selectSelected,
  setHovered,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import ApplicationProfileFlow from './application-profile-flow';
import ClassInfo from './class-info';
import useSetView from '@app/common/utils/hooks/use-set-view';
import useSetPage from '@app/common/utils/hooks/use-set-page';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import ResourceError from '@app/common/components/resource-error';

interface ClassViewProps {
  modelId: string;
  version?: string;
  languages: string[];
  terminologies: string[];
  applicationProfile?: boolean;
  organizationIds?: string[];
}

export default function ClassView({
  modelId,
  version,
  languages,
  terminologies,
  applicationProfile,
  organizationIds,
}: ClassViewProps) {
  const { t, i18n } = useTranslation('common');
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useStoreDispatch();
  const hasPermission = HasPermission({
    actions: ['CREATE_CLASS'],
    targetOrganization: organizationIds,
  });
  const { setView } = useSetView();
  const { setPage, getPage } = useSetPage();
  const displayLang = useSelector(selectDisplayLang());
  const [currentPage, setCurrentPage] = useState(getPage());
  const [query, setQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(hasPermission ? 112 : 97);
  const [isEdit, setIsEdit] = useState(false);
  const [showAppProfileModal, setShowAppProfileModal] = useState(false);
  const [basedOnNodeShape, setBasedOnNodeShape] = useState(false);
  const [selectedTargetClass, setSelectedTargetClass] = useState<
    | {
        targetClass: InternalClassInfo;
        isAppProfile?: boolean;
      }
    | undefined
  >();
  const globalSelected = useSelector(selectSelected());
  const view = useSelector(selectClassView());
  const { data, refetch } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [ResourceType.CLASS],
    fromVersion: version,
  });

  const {
    data: classData,
    isSuccess,
    isError: classIsError,
  } = useGetClassQuery(
    {
      modelId: modelId,
      version: version,
      classId: globalSelected.id ?? '',
      applicationProfile,
    },
    { skip: globalSelected.type !== 'classes' }
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleFollowUpAction = (
    value?: InternalClassInfo,
    targetIsAppProfile?: boolean
  ) => {
    if (isEdit) {
      setIsEdit(false);
    }
    setBasedOnNodeShape(targetIsAppProfile ?? false);

    if (applicationProfile && value && !targetIsAppProfile) {
      setShowAppProfileModal(true);
      setSelectedTargetClass({
        targetClass: value,
        isAppProfile: false,
      });
      return;
    }

    if (!value) {
      const initialData = initialClassForm;
      const label = Object.fromEntries(languages.map((lang) => [lang, '']));
      dispatch(
        setClass({
          ...initialData,
          label: label,
          subClassOf: [DEFAULT_SUBCLASS_OF],
        })
      );
      setView('classes', 'create');
      return;
    }

    dispatch(
      setClass(
        internalClassToClassForm(value, applicationProfile, targetIsAppProfile)
      )
    );

    setView('classes', 'create');
  };

  const handleAppProfileFollowUpAction = (data?: {
    value?: InternalClass;
    targetClass?: InternalClass;
    targetIsAppProfile?: boolean;
    associations?: SimpleResource[];
    attributes?: SimpleResource[];
  }) => {
    setShowAppProfileModal(false);
    setSelectedTargetClass(undefined);

    if (!data || !data.value) {
      return;
    }

    dispatch(
      setClass(
        internalClassToClassForm(
          data.value,
          applicationProfile,
          data.targetIsAppProfile,
          data.associations,
          data.attributes
        )
      )
    );
    setView('classes', 'edit');
  };

  const handleReturn = () => {
    if (view.edit) {
      setView('classes', 'info', globalSelected.id);
    } else {
      dispatch(resetSelected());
      dispatch(resetClass());
      setView('classes', 'list');
      refetch();
    }

    if (isEdit) {
      setIsEdit(false);
    }
  };

  const handleFollowUp = (classId: string) => {
    setView('classes', 'info', classId);
    dispatch(setSelected(classId, 'classes', modelId));
  };

  const handleActive = (classId: string) => {
    dispatch(setSelected(classId, 'classes', modelId));
    dispatch(resetHovered());
  };

  const handleShowClass = (classId: string) => {
    handleActive(classId);
    setView('classes', 'info', classId);
  };

  const handleEdit = () => {
    if (isSuccess) {
      setView('classes', 'edit');
      dispatch(
        setClass(classTypeToClassForm(classData, applicationProfile ?? false))
      );
      setIsEdit(true);
    }
  };

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (ref.current && Object.values(view).filter((val) => val).length > 0) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, [ref, view]);

  return (
    <>
      {renderListing()}
      {renderClass()}
      {renderForm()}
    </>
  );

  function renderListing() {
    if (!view.list) {
      return <></>;
    }

    return (
      <>
        <StaticHeader ref={ref}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text variant="bold">
              {t('classes', { count: data?.totalHitCount ?? 0 })}
            </Text>
            {!version && hasPermission && (
              <>
                <ClassModal
                  modelId={modelId}
                  handleFollowUp={handleFollowUpAction}
                  applicationProfile={applicationProfile}
                />
                {selectedTargetClass && (
                  <ApplicationProfileFlow
                    visible={showAppProfileModal}
                    selectedTargetClass={selectedTargetClass}
                    handleFollowUp={handleAppProfileFollowUpAction}
                  />
                )}
              </>
            )}
          </div>
          <SearchInput
            labelText=""
            clearButtonLabel={t('clear-all-selections', { ns: 'admin' })}
            searchButtonLabel={t('search')}
            labelMode="hidden"
            fullWidth
            onChange={(e) => handleQueryChange(e?.toString() ?? '')}
            debounce={500}
          />
        </StaticHeader>

        <DrawerContent height={headerHeight} spaced>
          {!data || (query === '' && data?.totalHitCount < 1) ? (
            <Text>{t('datamodel-no-classes')}</Text>
          ) : query !== '' && data?.totalHitCount < 1 ? (
            <Text>{t('no-results')}</Text>
          ) : (
            <DrawerItemList
              items={data.responseObjects.map((item) => ({
                label: getLanguageVersion({
                  data: item.label,
                  lang: displayLang ?? i18n.language,
                  appendLocale: true,
                }),
                subtitle: item.curie,
                onClick: () => {
                  handleShowClass(item.identifier);
                },
                onMouseEnter: () => {
                  dispatch(setHovered(item.identifier, 'classes'));
                },
                onMouseLeave: () => {
                  dispatch(resetHovered());
                },
              }))}
            />
          )}
          <DetachedPagination
            currentPage={currentPage}
            maxPages={Math.ceil((data?.totalHitCount ?? 0) / 20)}
            maxTotal={20}
            setCurrentPage={(number) => {
              setCurrentPage(number);
              setPage(number);
            }}
          />
        </DrawerContent>
      </>
    );
  }

  function renderForm() {
    if (!view.edit && !view.create) {
      return <></>;
    }

    return (
      <ClassForm
        handleReturn={handleReturn}
        handleFollowUp={handleFollowUp}
        languages={languages}
        modelId={modelId}
        terminologies={terminologies}
        applicationProfile={applicationProfile}
        basedOnNodeShape={basedOnNodeShape}
        isEdit={isEdit}
      />
    );
  }

  function renderClass() {
    if (!view.info) {
      return <></>;
    }

    if (classIsError) {
      return <ResourceError handleReturn={handleReturn} />;
    }

    return (
      <ClassInfo
        data={classData}
        modelId={modelId}
        languages={languages}
        terminologies={terminologies}
        applicationProfile={applicationProfile}
        handleReturn={handleReturn}
        handleEdit={handleEdit}
        disableEdit={version ? true : false}
        handleShowClass={handleShowClass}
        organizationIds={organizationIds}
      />
    );
  }
}
