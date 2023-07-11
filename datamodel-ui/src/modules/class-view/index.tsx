import {
  resetClass,
  setClass,
  useGetClassQuery,
} from '@app/common/components/class/class.slice';
import { initialClassForm } from '@app/common/interfaces/class-form.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { SearchInput, Text } from 'suomifi-ui-components';
import ClassForm from '../class-form';
import ClassModal from '../class-modal';
import { classTypeToClassForm, internalClassToClassForm } from './utils';
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
  // setView,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getResourceInfo } from '@app/common/utils/parse-slug';
import ApplicationProfileFlow from './application-profile-flow';
import ClassInfo from './class-info';
import useSetView from '@app/common/utils/hooks/use-set-view';

interface ClassViewProps {
  modelId: string;
  languages: string[];
  terminologies: string[];
  applicationProfile?: boolean;
}

export default function ClassView({
  modelId,
  languages,
  terminologies,
  applicationProfile,
}: ClassViewProps) {
  const { t, i18n } = useTranslation('common');
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useStoreDispatch();
  const hasPermission = HasPermission({ actions: ['ADMIN_CLASS'] });
  const router = useRouter();
  const { setView } = useSetView();
  const displayLang = useSelector(selectDisplayLang());
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [showAppProfileModal, setShowAppProfileModal] = useState(false);
  const [basedOnNodeShape, setBasedOnNodeShape] = useState(false);
  const [selectedNodeShape, setSelectedNodeShape] = useState<
    | {
        nodeShape: InternalClass;
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
  });

  const [currentClassId, setCurrentClassId] = useState<string | undefined>(
    getResourceInfo(router.query.slug)?.type === 'class'
      ? getResourceInfo(router.query.slug)?.id
      : undefined
  );
  const { data: classData, isSuccess } = useGetClassQuery(
    { modelId: modelId, classId: currentClassId ?? '', applicationProfile },
    { skip: typeof currentClassId === 'undefined' }
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleFollowUpAction = (
    value?: InternalClass,
    targetIsAppProfile?: boolean
  ) => {
    if (isEdit) {
      setIsEdit(false);
    }
    setBasedOnNodeShape(targetIsAppProfile ?? false);

    if (applicationProfile && value && !targetIsAppProfile) {
      setShowAppProfileModal(true);
      setSelectedNodeShape({
        nodeShape: value,
        isAppProfile: targetIsAppProfile ?? false,
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
          subClassOf: [
            {
              attributes: [],
              identifier: 'owl:Thing',
              label: 'owl:Thing',
            },
          ],
        })
      );
      // dispatch(setView('classes', 'edit'));
      setView('classes', 'edit');
      return;
    }

    dispatch(
      setClass(internalClassToClassForm(value, languages, applicationProfile))
    );

    // dispatch(setView('classes', 'edit'));
    setView('classes', 'edit');
  };

  const handleAppProfileFollowUpAction = (data?: {
    value?: InternalClass;
    targetClass?: InternalClass;
    associations?: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[];
    attributes?: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[];
  }) => {
    setShowAppProfileModal(false);

    if (!data || !data.value) {
      return;
    }

    dispatch(
      setClass(
        internalClassToClassForm(
          data.value,
          languages,
          applicationProfile,
          data.targetClass,
          data.associations,
          data.attributes
        )
      )
    );
    // dispatch(setView('classes', 'edit'));
    setView('classes', 'edit');
  };

  const handleReturn = () => {
    dispatch(resetSelected());
    dispatch(resetClass());
    // dispatch(setView('classes', 'list'));
    setView('classes', 'list');
    refetch();

    if (isEdit) {
      setIsEdit(false);
    }
  };

  const handleFollowUp = (classId: string) => {
    // dispatch(setView('classes', 'info'));
    setView('classes', 'info');
    dispatch(setSelected(classId, 'classes'));
    router.replace({
      pathname: `${modelId}/class/${classId}`,
      query: {
        lang: Array.isArray(router.query.lang)
          ? router.query.lang[0]
          : router.query.lang,
      },
    });
  };

  const handleActive = (classId: string) => {
    dispatch(setSelected(classId, 'classes'));
    dispatch(resetHovered());
    router.replace({
      pathname: `${modelId}/class/${classId}`,
      query: {
        lang: Array.isArray(router.query.lang)
          ? router.query.lang[0]
          : router.query.lang,
      },
    });
  };

  const handleEdit = () => {
    if (isSuccess) {
      // dispatch(setView('classes', 'edit'));
      setView('classes', 'edit');
      dispatch(setClass(classTypeToClassForm(classData)));
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

  useEffect(() => {
    if (
      globalSelected.type === 'classes' &&
      currentClassId !== globalSelected.id
    ) {
      setCurrentClassId(globalSelected.id);
    }
  }, [globalSelected, currentClassId]);

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
            {hasPermission && (
              <>
                <ClassModal
                  modelId={modelId}
                  handleFollowUp={handleFollowUpAction}
                  applicationProfile={applicationProfile}
                />
                {selectedNodeShape && (
                  <ApplicationProfileFlow
                    visible={showAppProfileModal}
                    selectedNodeShape={selectedNodeShape}
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
          {!data || data?.totalHitCount < 1 ? (
            <Text>{t('datamodel-no-classes')}</Text>
          ) : (
            <DrawerItemList
              items={data.responseObjects.map((item) => ({
                label: getLanguageVersion({
                  data: item.label,
                  lang: displayLang ?? i18n.language,
                  appendLocale: true,
                }),
                subtitle: `${modelId}:${item.identifier}`,
                onClick: () => {
                  setCurrentClassId(item.identifier);
                  handleActive(item.identifier);
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
            setCurrentPage={(number) => setCurrentPage(number)}
          />
        </DrawerContent>
      </>
    );
  }

  function renderForm() {
    if (!view.edit) {
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

    return (
      <ClassInfo
        data={classData}
        modelId={modelId}
        applicationProfile={applicationProfile}
        handleReturn={handleReturn}
        handleEdit={handleEdit}
      />
    );
  }
}
