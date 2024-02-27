import { Dropdown, DropdownItem, TextInput } from 'suomifi-ui-components';
import { FilterBlockWrapper } from './code-list-modal.styles';
import { useTranslation } from 'next-i18next';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { TEXT_INPUT_MAX } from 'yti-common-ui/utils/constants';

export interface FilterType {
  keyword: string;
  server: string;
  group: string;
  status: string;
}

export default function FilterBlock({
  filter,
  groups,
  extendedView,
  setFilter,
  setCurrPage,
}: {
  filter: FilterType;
  groups: {
    name: string;
    labelText: string;
    uniqueItemId: string;
  }[];
  extendedView?: boolean;
  setFilter: (value: FilterType) => void;
  setCurrPage: (value: number) => void;
}) {
  const { t } = useTranslation('admin');
  const handleGroupChange = (id: string | null) => {
    setCurrPage(1);

    if (!id) {
      setFilter({ ...filter, group: '' });
      return;
    }

    const newGroup = groups.find((g) => g.uniqueItemId === id);

    if (!newGroup) {
      setFilter({ ...filter, group: '' });
      return;
    }

    setFilter({ ...filter, group: id });
  };

  return (
    <FilterBlockWrapper extendedView={extendedView}>
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
          defaultValue={filter.keyword}
          debounce={300}
          id="search-text-input"
          maxLength={TEXT_INPUT_MAX}
        />

        <Dropdown
          labelText={t('select-server')}
          defaultValue="koodistot.suomi.fi"
          id="server-dropdown"
        >
          <DropdownItem value="koodistot.suomi.fi">
            koodistot.suomi.fi
          </DropdownItem>
        </Dropdown>
      </div>

      <div>
        <Dropdown
          labelText={t('show-groups-register')}
          defaultValue="all-groups"
          onChange={(e) => handleGroupChange(e)}
          id="group-dropdown"
        >
          {groups.map((group) => (
            <DropdownItem
              key={`group-${group.uniqueItemId}`}
              value={group.uniqueItemId}
            >
              {group.labelText}
            </DropdownItem>
          ))}
        </Dropdown>

        <Dropdown
          labelText={t('show-statuses')}
          defaultValue="all-statuses"
          onChange={(e) => {
            setFilter({ ...filter, status: e });
            setCurrPage(1);
          }}
          id="status-dropdown"
        >
          {['all-statuses', 'VALID', 'DRAFT', 'SUPERSEDED', 'RETIRED'].map(
            (status) => (
              <DropdownItem key={`status-${status}`} value={status}>
                {status !== 'all-statuses'
                  ? translateStatus(status, t)
                  : t('status-all')}
              </DropdownItem>
            )
          )}
        </Dropdown>
      </div>
    </FilterBlockWrapper>
  );
}
