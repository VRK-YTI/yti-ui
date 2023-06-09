import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  ExternalLink,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  SingleSelect,
  Text,
  TextInput,
} from 'suomifi-ui-components';
import { FilterBlock, ResultBlock, StatusChip } from './code-list-modal.styles';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import {
  useGetCodeRegistriesQuery,
  useGetCodesQuery,
} from '@app/common/components/code';
import { statusList } from 'yti-common-ui/utils/status-list';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { ModelCodeList } from '@app/common/interfaces/model.interface';
import { DetachedPagination } from 'yti-common-ui/pagination';

export default function CodeListModal({
  initialData,
  setData,
}: {
  initialData: ModelCodeList[];
  setData: (value: ModelCodeList[]) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const { isSmall } = useBreakpoints();
  const [defaultGroup] = useState({
    name: t('all-groups'),
    labelText: t('all-groups'),
    uniqueItemId: 'all-groups',
  });
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState({
    keyword: '',
    server: 'koodistot.suomi.fi',
    group: '',
    status: '',
  });
  const statuses = ['all-statuses', ...statusList];
  const [selected, setSelected] = useState<string[]>(
    initialData.map((d) => d.id) ?? []
  );
  const [selectedGroup, setSelectedGroup] = useState(defaultGroup);
  const [currPage, setCurrPage] = useState(1);
  const { data: codes, isSuccess } = useGetCodesQuery({
    lang: i18n.language ?? 'fi',
    searchTerm: filter.keyword !== '' ? filter.keyword : undefined,
    codeRegistryCodeValue: !['', 'all-groups'].includes(filter.group)
      ? filter.group
      : undefined,
    pageFrom: currPage,
  });
  const { data: codeRegistries } = useGetCodeRegistriesQuery();

  const groups = useMemo(
    () => [
      defaultGroup,
      ...(codeRegistries?.results
        .map((registry) => ({
          name: getLanguageVersion({
            data: registry.prefLabel,
            lang: i18n.language,
            appendLocale: true,
          }),
          labelText: getLanguageVersion({
            data: registry.prefLabel,
            lang: i18n.language,
            appendLocale: true,
          }),
          uniqueItemId: registry.codeValue,
        }))
        .sort((a, b) => (a.labelText > b.labelText ? 1 : -1)) ?? []),
    ],
    [codeRegistries, i18n.language, defaultGroup]
  );

  const handleClose = () => {
    setFilter({
      keyword: '',
      server: 'koodistot.suomi.fi',
      group: '',
      status: '',
    });
    setSelectedGroup(defaultGroup);
    setSelected(initialData.map((d) => d.id));
    setVisible(false);
    setCurrPage(1);
  };

  const handleSubmit = () => {
    if (!codes) {
      return;
    }

    setData(
      codes.results
        .filter((code) => selected.includes(code.uri))
        .map((code) => ({
          prefLabel: code.prefLabel,
          status: code.status,
          id: code.uri,
        }))
    );
    handleClose();
  };

  const handleGroupChange = (id: string | null) => {
    setCurrPage(1);

    if (!id) {
      setSelectedGroup(defaultGroup);
      setFilter({ ...filter, group: '' });
      return;
    }

    const newGroup = groups.find((g) => g.uniqueItemId === id);

    if (!newGroup) {
      setSelectedGroup(defaultGroup);
      setFilter({ ...filter, group: '' });
      return;
    }

    setSelectedGroup(newGroup);
    setFilter({ ...filter, group: id });
  };

  useEffect(() => {
    setSelected(initialData.map((d) => d.id));
  }, [initialData]);

  return (
    <>
      <Button variant="secondary" icon="plus" onClick={() => setVisible(true)}>
        {t('add-reference-data')}
      </Button>

      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => handleClose()}
        variant={isSmall ? 'smallScreen' : 'default'}
      >
        <ModalContent>
          <ModalTitle>{t('add-reference-to-reference-data')}</ModalTitle>

          <FilterBlock>
            <div>
              <TextInput
                labelText={t('search-for-reference-data')}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    keyword: e?.toString() ?? '',
                  });
                  setCurrPage(1);
                }}
                debounce={300}
              />

              <Dropdown
                labelText={t('select-server')}
                defaultValue="koodistot.suomi.fi"
              >
                <DropdownItem value="koodistot.suomi.fi">
                  koodistot.suomi.fi
                </DropdownItem>
              </Dropdown>
            </div>

            <div>
              <SingleSelect
                labelText={t('show-groups-register')}
                items={groups}
                clearButtonLabel=""
                selectedItem={selectedGroup}
                itemAdditionHelpText=""
                ariaOptionsAvailableText=""
                defaultSelectedItem={groups.find(
                  (g) => g.uniqueItemId === defaultGroup.uniqueItemId
                )}
                onItemSelect={(e) => handleGroupChange(e)}
              />

              <Dropdown
                labelText={t('show-statuses')}
                defaultValue="all-statuses"
                onChange={(e) => {
                  setFilter({ ...filter, status: e });
                  setCurrPage(1);
                }}
              >
                {statuses.map((status) => (
                  <DropdownItem key={`status-${status}`} value={status}>
                    {status !== 'all-statuses'
                      ? translateStatus(status, t)
                      : t('status-all')}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          </FilterBlock>

          <ResultBlock>
            <Paragraph className="total-results">
              <Text variant="bold">
                {t('reference-data-counts', {
                  count: isSuccess ? codes.meta.totalResults : 0,
                })}
              </Text>
            </Paragraph>
            {isSuccess && codes.meta.totalResults > 0 && (
              <div className="results">
                {codes.results
                  .filter((code) => {
                    if (
                      filter.status === 'all-statuses' ||
                      filter.status === ''
                    ) {
                      return true;
                    }
                    return code.status === filter.status;
                  })
                  .map((code) => (
                    <div className="result" key={`code-list-result-${code.id}`}>
                      <Checkbox
                        onClick={() =>
                          setSelected((selected) =>
                            selected.includes(code.uri)
                              ? selected.filter((s) => s !== code.uri)
                              : [...selected, code.uri]
                          )
                        }
                        checked={selected.includes(code.uri)}
                      >
                        {getLanguageVersion({
                          data: code.prefLabel,
                          lang: i18n.language,
                          appendLocale: true,
                        })}
                      </Checkbox>

                      <div className="subtitle">
                        <div>
                          {code.languageCodes
                            .map((lcode) => lcode.codeValue)
                            .join(', ')}
                        </div>
                        &middot;
                        <div>
                          {code.infoDomains
                            .map((domain) =>
                              getLanguageVersion({
                                data: domain.prefLabel,
                                lang: i18n.language,
                                appendLocale: true,
                              })
                            )
                            .join(', ')}
                        </div>
                        &middot;
                        <StatusChip $isValid={code.status === 'VALID'}>
                          {translateStatus(code.status, t)}
                        </StatusChip>
                      </div>

                      <div className="description">
                        {code.description ? (
                          getLanguageVersion({
                            data: code.description,
                            lang: i18n.language,
                            appendLocale: true,
                          })
                        ) : (
                          <>{t('no-description', { ns: 'common' })}</>
                        )}
                      </div>

                      <div className="link">
                        <ExternalLink href={code.uri} labelNewWindow="">
                          {code.uri}
                        </ExternalLink>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </ResultBlock>
          {codes && codes.meta.totalResults > 20 && (
            <DetachedPagination
              currentPage={currPage}
              maxPages={Math.ceil(codes.meta.totalResults / 20)}
              maxTotal={20}
              setCurrentPage={(e) => setCurrPage(e)}
            />
          )}
        </ModalContent>

        <ModalFooter>
          <Button disabled={selected.length < 1} onClick={() => handleSubmit()}>
            {t('add-selected')}
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
