import { useGetClassMutMutation } from '@app/common/components/class/class.slice';
import {
  ClassFormType,
  initialClassForm,
} from '@app/common/interfaces/class-form.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Expander,
  ExpanderGroup,
  ExpanderTitleButton,
  ExternalLink,
  HintText,
  Label,
  Link,
  SearchInput,
  Text,
  Tooltip,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import { StatusChip } from '@app/common/components/multi-column-search/multi-column-search.styles';
import Separator from 'yti-common-ui/separator';
import ClassForm from '../class-form';
import ClassModal from '../class-modal';
import { TooltipWrapper } from '../model/model.styles';
import { internalClassToClassForm } from './utils';
import DrawerItemList from '@app/common/components/drawer-item-list';
import StaticHeader from 'yti-common-ui/drawer/static-header';
import DrawerContent from 'yti-common-ui/drawer/drawer-content-wrapper';
import HasPermission from '@app/common/utils/has-permission';
import { useQueryInternalResourcesQuery } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { DetachedPagination } from 'yti-common-ui/pagination';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import FormattedDate from 'yti-common-ui/components/formatted-date';

interface ClassViewProps {
  modelId: string;
  languages: string[];
}

export default function ClassView({ modelId, languages }: ClassViewProps) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({ actions: ['ADMIN_CLASS'] });
  const [formData, setFormData] = useState<ClassFormType>(initialClassForm);
  const [showTooltip, setShowTooltip] = useState(false);
  const [view, setView] = useState<'listing' | 'class' | 'form'>('listing');
  const [getClass, getClassResult] = useGetClassMutMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { data, refetch } = useQueryInternalResourcesQuery({
    query: query ?? '',
    limitToDataModel: modelId,
    pageSize: 20,
    pageFrom: (currentPage - 1) * 20,
    resourceTypes: [ResourceType.CLASS],
  });

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleFollowUpAction = (value?: InternalClass) => {
    setView('form');

    if (!value) {
      const initialData = initialClassForm;
      const label = Object.fromEntries(languages.map((lang) => [lang, '']));
      setFormData({ ...initialData, label: label });
      return;
    }

    setFormData(internalClassToClassForm(value, languages));
  };

  const handleReturn = () => {
    setView('listing');
    refetch();
  };

  const handleFollowUp = (classId: string) => {
    getClass({ modelId: modelId, classId: classId });
    setView('class');
  };

  useEffect(() => {
    if (getClassResult.isSuccess) {
      setView('class');
    }
  }, [getClassResult]);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }

    if (ref.current && ['listing', 'class'].includes(view)) {
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
    if (view !== 'listing') {
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
              <ClassModal
                modelId={modelId}
                handleFollowUp={handleFollowUpAction}
              />
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
                onClick: () =>
                  getClass({ modelId: modelId, classId: item.identifier }),
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
    if (view !== 'form') {
      return <></>;
    }

    return (
      <ClassForm
        initialData={formData}
        handleReturn={handleReturn}
        handleFollowUp={handleFollowUp}
        languages={languages}
        modelId={modelId}
      />
    );
  }

  function renderClass() {
    if (view !== 'class' || !getClassResult.isSuccess) {
      return <></>;
    }
    const data = getClassResult.data;

    return (
      <>
        <StaticHeader ref={ref}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="secondaryNoBorder"
              icon="arrowLeft"
              onClick={() => handleReturn()}
              style={{ textTransform: 'uppercase' }}
            >
              {t('back')}
            </Button>
            <div>
              <Button
                variant="secondary"
                iconRight="menu"
                onClick={() => setShowTooltip(!showTooltip)}
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
                  {hasPermission && (
                    <>
                      <Button variant="secondaryNoBorder">
                        {t('edit', { ns: 'admin' })}
                      </Button>
                      <Separator />
                    </>
                  )}
                  <Button variant="secondaryNoBorder">
                    {t('show-as-file')}
                  </Button>
                  <Button variant="secondaryNoBorder">
                    {t('download-as-file')}
                  </Button>
                  {hasPermission && (
                    <>
                      <Separator />
                      <Button variant="secondaryNoBorder">
                        {t('remove', { ns: 'admin' })}
                      </Button>
                    </>
                  )}
                </Tooltip>
              </TooltipWrapper>
            </div>
          </div>
        </StaticHeader>

        <DrawerContent height={headerHeight}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Text variant="bold">
              {getLanguageVersion({ data: data.label, lang: i18n.language })}
            </Text>
            <StatusChip $isValid={data.status === 'VALID'}>
              {translateStatus(data.status, t)}
            </StatusChip>
          </div>

          <BasicBlock title={t('class-identifier')}>
            {`${modelId}:${data.identifier}`}
            <Button
              icon="copy"
              variant="secondary"
              style={{ width: 'min-content', whiteSpace: 'nowrap' }}
              onClick={() => navigator.clipboard.writeText(data.identifier)}
            >
              {t('copy-to-clipboard')}
            </Button>
          </BasicBlock>

          <div style={{ marginTop: '20px' }}>
            <Expander>
              <ExpanderTitleButton>
                {t('concept-definition')}
                <HintText>{t('interval')}</HintText>
              </ExpanderTitleButton>
            </Expander>
          </div>

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

          <BasicBlock title={t('additional-information')}>
            {getLanguageVersion({
              data: data.note,
              lang: i18n.language,
              appendLocale: true,
            })}
          </BasicBlock>

          <div style={{ marginTop: '20px' }}>
            <Label style={{ marginBottom: '10px' }}>
              {t('attributes', { count: 2 })}
            </Label>
            <ExpanderGroup
              closeAllText=""
              openAllText=""
              showToggleAllButton={false}
            >
              <Expander>
                <ExpanderTitleButton>Attribuutti #1</ExpanderTitleButton>
              </Expander>
              <Expander>
                <ExpanderTitleButton>Attribuutti #2</ExpanderTitleButton>
              </Expander>
            </ExpanderGroup>
          </div>

          <BasicBlock title={t('associations', { count: 0 })}>
            {t('no-assocations')}
          </BasicBlock>

          <BasicBlock title={t('references-from-other-components')}>
            {t('no-references')}
          </BasicBlock>

          <Separator />

          <BasicBlock title={t('created')}>
            <FormattedDate date={data.created} />
          </BasicBlock>

          <BasicBlock title={t('modified-at')}>
            <FormattedDate date={data.created} />
          </BasicBlock>

          <BasicBlock title={t('editorial-note')}>
            {data.editorialNote ?? t('no-editorial-note')}
          </BasicBlock>

          <BasicBlock title={t('uri')}>{data.uri}</BasicBlock>

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
              labelNewWindow=""
            >
              {t('class-contact')}
            </ExternalLink>
          </BasicBlock>
        </DrawerContent>
      </>
    );
  }
}
