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
import {
  Button,
  ExpanderGroup,
  ExternalLink,
  IconArrowLeft,
  IconCopy,
  IconMenu,
  Link,
  SearchInput,
  Text,
  Tooltip,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import Separator from 'yti-common-ui/separator';
import ClassForm from '../class-form';
import ClassModal from '../class-modal';
import { TooltipWrapper } from '../model/model.styles';
import { classTypeToClassForm, internalClassToClassForm } from './utils';
import DrawerItemList from '@app/common/components/drawer-item-list';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import HasPermission from '@app/common/utils/has-permission';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { DetachedPagination } from 'yti-common-ui/pagination';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { useStoreDispatch } from '@app/store';
import FormattedDate from 'yti-common-ui/components/formatted-date';
import DeleteModal from '../delete-modal';
import {
  resetHovered,
  resetSelected,
  selectClassView,
  selectSelected,
  setHovered,
  setSelected,
  setView,
} from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import ResourceInfo from './resource-info';
import ConceptView from '../concept-view';
import { useRouter } from 'next/router';
import { getResourceInfo } from '@app/common/utils/parse-slug';
import { StatusChip } from '@app/common/components/resource-list/resource-list.styles';
import ApplicationProfileFlow from './application-profile-flow';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { useGetAwayListener } from '@app/common/utils/hooks/use-get-away-listener';

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [showAppProfileModal, setShowAppProfileModal] = useState(false);
  const [basedOnNodeShape, setBasedOnNodeShape] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNodeShape, setSelectedNodeShape] = useState<
    | {
        nodeShape: InternalClass;
        isAppProfile?: boolean;
      }
    | undefined
  >();
  const globalSelected = useSelector(selectSelected());
  const view = useSelector(selectClassView());
  const { ref: toolTipRef } = useGetAwayListener(showTooltip, setShowTooltip);
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
      dispatch(setView('classes', 'edit'));
      return;
    }

    dispatch(
      setClass(internalClassToClassForm(value, languages, applicationProfile))
    );

    dispatch(setView('classes', 'edit'));
  };

  const handleAppProfileFollowUpAction = (
    value?: InternalClass,
    associations?: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[],
    attributes?: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[]
  ) => {
    setShowAppProfileModal(false);

    if (!value) {
      return;
    }

    dispatch(
      setClass(
        internalClassToClassForm(
          value,
          languages,
          applicationProfile,
          associations,
          attributes
        )
      )
    );
    dispatch(setView('classes', 'edit'));
  };

  const handleReturn = () => {
    dispatch(resetSelected());
    dispatch(resetClass());
    dispatch(setView('classes', 'list'));
    refetch();

    if (isEdit) {
      setIsEdit(false);
    }
  };

  const handleFollowUp = (classId: string) => {
    dispatch(setView('classes', 'info'));
    dispatch(setSelected(classId, 'classes'));
    router.replace(`${modelId}/class/${classId}`);
  };

  const handleActive = (classId: string) => {
    dispatch(setSelected(classId, 'classes'));
    dispatch(resetHovered());
    router.replace(`${modelId}/class/${classId}`);
  };

  const handleEdit = () => {
    if (isSuccess) {
      dispatch(setView('classes', 'edit'));
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
                    handleFollowUp={(
                      value?: InternalClass,
                      associations?: {
                        identifier: string;
                        label: { [key: string]: string };
                        modelId: string;
                        uri: string;
                      }[],
                      attributes?: {
                        identifier: string;
                        label: { [key: string]: string };
                        modelId: string;
                        uri: string;
                      }[]
                    ) =>
                      handleAppProfileFollowUpAction(
                        value,
                        associations,
                        attributes
                      )
                    }
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
                  lang: i18n.language,
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

    const data = classData;

    return (
      <>
        <StaticHeader ref={ref}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="secondaryNoBorder"
              icon={<IconArrowLeft />}
              onClick={() => handleReturn()}
              style={{ textTransform: 'uppercase' }}
            >
              {t('back')}
            </Button>
            <div>
              <Button
                variant="secondary"
                iconRight={<IconMenu />}
                onClick={() => setShowTooltip(!showTooltip)}
                ref={toolTipRef}
              >
                {t('actions')}
              </Button>
              <TooltipWrapper>
                <Tooltip
                  ariaCloseButtonLabelText=""
                  ariaToggleButtonLabelText=""
                  open={showTooltip}
                  onCloseButtonClick={() => setShowTooltip(false)}
                >
                  {hasPermission && data && (
                    <>
                      <Button
                        variant="secondaryNoBorder"
                        onClick={() => handleEdit()}
                      >
                        {t('edit', { ns: 'admin' })}
                      </Button>
                      <Separator />
                      <Button
                        variant="secondaryNoBorder"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        {t('remove', { ns: 'admin' })}
                      </Button>
                    </>
                  )}
                </Tooltip>
              </TooltipWrapper>
            </div>
          </div>
          {data ? (
            <DeleteModal
              modelId={modelId}
              resourceId={data.identifier}
              type="class"
              label={getLanguageVersion({
                data: data.label,
                lang: i18n.language,
              })}
              onClose={handleReturn}
              applicationProfile={applicationProfile}
              visible={showDeleteModal}
              hide={() => setShowDeleteModal(false)}
            />
          ) : (
            <></>
          )}
        </StaticHeader>

        {isSuccess && data && (
          <DrawerContent height={headerHeight}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              <Text variant="bold">
                {getLanguageVersion({ data: data.label, lang: i18n.language })}
              </Text>
              <StatusChip $isValid={data.status === 'VALID'}>
                {translateStatus(data.status, t)}
              </StatusChip>
            </div>

            <BasicBlock title={t('class-identifier')}>
              {`${modelId}:${data.identifier}`}
            </BasicBlock>

            <BasicBlock title={t('uri')}>
              {data.uri}
              <Button
                icon={<IconCopy />}
                variant="secondary"
                onClick={() => navigator.clipboard.writeText(data.uri)}
                style={{ width: 'max-content' }}
              >
                {t('copy-to-clipboard')}
              </Button>
            </BasicBlock>

            <BasicBlock title={t('concept')}>
              <ConceptView data={data.subject} />
            </BasicBlock>

            <BasicBlock title={t('upper-class')}>
              {!data.subClassOf || data.subClassOf.length === 0 ? (
                <> {t('no-upper-classes')}</>
              ) : (
                <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
                  {data.subClassOf.map((c) => (
                    <li key={c}>
                      <Link key={c} href={c} style={{ fontSize: '16px' }}>
                        {c.split('/').pop()?.replace('#', ':')}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </BasicBlock>

            <BasicBlock title={t('equivalent-classes')}>
              {!data.equivalentClass || data.equivalentClass.length === 0 ? (
                <> {t('no-equivalent-classes')}</>
              ) : (
                <ul style={{ padding: '0', margin: '0', paddingLeft: '20px' }}>
                  {data.equivalentClass.map((c) => (
                    <li key={c}>
                      <Link key={c} href={c} style={{ fontSize: '16px' }}>
                        {c.split('/').pop()?.replace('#', ':')}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </BasicBlock>

            <BasicBlock title={t('disjoint-classes')}>
              {t('no-disjoint-classes')}
            </BasicBlock>

            <BasicBlock title={t('technical-description')}>
              {getLanguageVersion({
                data: data.note,
                lang: i18n.language,
                appendLocale: true,
              }) !== '' ? (
                <SanitizedTextContent
                  text={getLanguageVersion({
                    data: data.note,
                    lang: i18n.language,
                    appendLocale: true,
                  })}
                />
              ) : (
                t('no-note')
              )}
            </BasicBlock>

            <Separator />

            <BasicBlock
              title={t('attributes', { count: data.attribute?.length ?? 0 })}
            >
              {data.attribute && data.attribute.length > 0 ? (
                <ExpanderGroup
                  closeAllText=""
                  openAllText=""
                  showToggleAllButton={false}
                >
                  {data.attribute.map((attr) => (
                    <ResourceInfo
                      key={`${data.identifier}-attr-${attr.identifier}`}
                      data={attr}
                      modelId={attr.modelId}
                    />
                  ))}
                </ExpanderGroup>
              ) : (
                t('no-attributes')
              )}
            </BasicBlock>

            <BasicBlock
              title={t('associations', {
                count: data.association?.length ?? 0,
              })}
            >
              {data.association && data.association.length > 0 ? (
                <ExpanderGroup
                  closeAllText=""
                  openAllText=""
                  showToggleAllButton={false}
                >
                  {data.association.map((assoc) => (
                    <ResourceInfo
                      key={`${data.identifier}-attr-${assoc.identifier}`}
                      data={assoc}
                      modelId={modelId}
                    />
                  ))}
                </ExpanderGroup>
              ) : (
                t('no-assocations')
              )}
            </BasicBlock>

            <Separator />

            <BasicBlock title={t('references-from-other-components')}>
              {t('no-references')}
            </BasicBlock>

            <Separator />

            <BasicBlock title={t('created')}>
              <FormattedDate date={data.created} />
              {data.creator.name ? `, ${data.creator.name}` : ''}
            </BasicBlock>

            <BasicBlock title={t('modified-at')}>
              <FormattedDate date={data.modified} />
              {data.modifier.name ? `, ${data.modifier.name}` : ''}
            </BasicBlock>

            {hasPermission ? (
              <BasicBlock title={t('work-group-comment', { ns: 'admin' })}>
                {data.editorialNote ??
                  t('no-work-group-comment', { ns: 'admin' })}
              </BasicBlock>
            ) : (
              <></>
            )}

            <Separator />

            <BasicBlock title={t('contributors')}>
              {data.contributor?.map((contributor) =>
                getLanguageVersion({
                  data: contributor.label,
                  lang: i18n.language,
                })
              )}
            </BasicBlock>
            <BasicBlock>
              {t('class-contact-description')}
              <ExternalLink
                href={`mailto:${
                  data.contact ?? 'yhteentoimivuus@dvv.fi'
                }?subject=${getLanguageVersion({
                  data: data.label,
                  lang: i18n.language,
                })}`}
                labelNewWindow={t('link-opens-new-window-external')}
              >
                {t('class-contact')}
              </ExternalLink>
            </BasicBlock>
          </DrawerContent>
        )}
      </>
    );
  }
}
