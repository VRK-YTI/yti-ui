/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Checkbox,
  ExternalLink,
  Icon,
  RadioButton,
  Text,
} from 'suomifi-ui-components';
import { StatusChip, ResultsTable } from './resource-list.styles';
import { useTranslation } from 'next-i18next';

export interface ResultType {
  target: {
    identifier: string;
    label: string;
    linkLabel: string;
    link: string;
    note: string;
    status: string;
    isValid?: boolean;
  };
  partOf: {
    label: string;
    type: string;
    domains: string[];
  };
  subClass: {
    label: string;
    link: string;
    partOf: string;
  };
}

interface ResourceListProps {
  primaryColumnName: string;
  items: ResultType[];
  type?: 'single' | 'multiple';
  selected?: string | string[];
  extraHeader?: React.ReactFragment;
  handleClick: (value: string | string[]) => void;
}

export default function ResourceList({
  primaryColumnName,
  items,
  type = 'single',
  selected,
  extraHeader,
  handleClick,
}: ResourceListProps) {
  const { t } = useTranslation('admin');

  const checkChecked = (id: string): boolean => {
    if (!selected) {
      return false;
    }

    if (Array.isArray(selected) ? selected.includes(id) : selected === id) {
      return true;
    }

    return false;
  };

  const handleMultipleCheck = () => {
    if (selected && selected.length < items.length) {
      handleClick(items.map((i) => i.target.identifier));
    } else {
      handleClick([]);
    }
  };

  return (
    <ResultsTable cellSpacing={0}>
      <thead>
        {extraHeader && extraHeader}
        <tr>
          {type === 'single' ? (
            <td>
              <Text variant="bold">{primaryColumnName}</Text>
            </td>
          ) : (
            <td className="td-with-button">
              <div>
                <Checkbox
                  onClick={() => handleMultipleCheck()}
                  checked={selected ? selected.length === items.length : false}
                />
              </div>
              <Text variant="bold">{primaryColumnName}</Text>
            </td>
          )}

          <td>
            <Text variant="bold">{t('data-model')}</Text>
          </td>
          <td>
            <Text variant="bold">{t('concept')}</Text>
          </td>
          <td>
            <Text variant="bold">{t('technical-description')}</Text>
          </td>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={`item-${item.target.identifier}`}>
            <td className="td-with-button">
              {type === 'single' ? (
                <div
                  onMouseDown={() => handleClick(item.target.identifier)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleClick(item.target.identifier)
                  }
                >
                  <RadioButton
                    value={item.target.identifier}
                    checked={checkChecked(item.target.identifier)}
                  />
                </div>
              ) : (
                <Checkbox
                  onClick={() => handleClick(item.target.identifier)}
                  checked={checkChecked(item.target.identifier)}
                />
              )}
              <div>
                {item.target.label}
                <ExternalLink
                  href={item.target.link}
                  labelNewWindow={t('link-opens-new-window-external', {
                    ns: 'common',
                  })}
                >
                  {item.target.linkLabel}
                </ExternalLink>
              </div>
            </td>
            <td style={{ width: '30%' }}>
              <div>
                <Text>{item.partOf.label}</Text>
                <div>
                  <Text>
                    <Icon icon="calendar" /> {item.partOf.type}
                  </Text>{' '}
                  <StatusChip $isValid={item.target.isValid}>
                    {item.target.status}
                  </StatusChip>
                </div>
                <Text>{item.partOf.domains.join(', ')}</Text>
              </div>
            </td>
            <td style={{ width: '20%' }}>
              <div>
                <ExternalLink
                  href={item.subClass.link}
                  labelNewWindow={t('link-opens-new-window-external', {
                    ns: 'common',
                  })}
                >
                  {item.subClass.label}
                </ExternalLink>
                <Text>{item.subClass.partOf}</Text>
              </div>
            </td>
            <td style={{ minWidth: '25%' }}>
              <div>
                <Text>{item.target.note}</Text>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </ResultsTable>
  );
}
