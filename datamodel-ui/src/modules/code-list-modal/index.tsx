import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
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
  useGetCodesQuery,
  useGetInfoDomainsQuery,
} from '@app/common/components/code';
import { statusList } from 'yti-common-ui/utils/status-list';
import { useBreakpoints } from 'yti-common-ui/media-query';

export default function CodeListModal() {
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
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState(defaultGroup);
  const { data: codeListInfoDomains } = useGetInfoDomainsQuery({
    lang: i18n.language,
  });
  const { data: codes, isSuccess } = useGetCodesQuery({
    searchTerm: filter.keyword !== '' ? filter.keyword : undefined,
    infoDomain: filter.group !== '' ? filter.group : undefined,
  });

  const groups = useMemo(
    () => [
      defaultGroup,
      ...(codeListInfoDomains?.results.map((infoDomain) => ({
        name: getLanguageVersion({
          data: infoDomain.prefLabel,
          lang: i18n.language,
        }),
        labelText: getLanguageVersion({
          data: infoDomain.prefLabel,
          lang: i18n.language,
        }),
        uniqueItemId: infoDomain.codeValue,
      })) ?? []),
    ],
    [codeListInfoDomains, i18n.language, defaultGroup]
  );

  const handleClose = () => {
    setFilter({
      keyword: '',
      server: 'koodistot.suomi.fi',
      group: '',
      status: '',
    });
    setSelectedGroup(defaultGroup);
    setVisible(false);
  };

  const handleGroupChange = (id: string | null) => {
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
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    keyword: e?.toString() ?? '',
                  })
                }
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
                onChange={(e) => setFilter({ ...filter, status: e })}
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

            <div className="results">
              {isSuccess &&
                codes.results
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
                            selected.includes(code.id)
                              ? selected.filter((s) => s !== code.id)
                              : [...selected, code.id]
                          )
                        }
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
          </ResultBlock>
        </ModalContent>

        <ModalFooter>
          <Button disabled={selected.length < 1}>{t('add-selected')}</Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            {t('cancel-variant')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
