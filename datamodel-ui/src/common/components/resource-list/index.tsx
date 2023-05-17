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
  partOf?: {
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
  type?: 'single' | 'multiple' | 'display';
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

  const renderHeaderButton = () => {
    if (type === 'multiple') {
      return (
        <td className="td-with-button">
          <div>
            <Checkbox
              onClick={() => handleMultipleCheck()}
              checked={
                items.length > 0 && selected
                  ? selected.length === items.length
                  : false
              }
              disabled={items.length < 1}
            />
          </div>
          <Text variant="bold">{primaryColumnName}</Text>
        </td>
      );
    }

    return (
      <td>
        <Text variant="bold">{primaryColumnName}</Text>
      </td>
    );
  };

  const renderTrButton = (id: string) => {
    switch (type) {
      case 'single':
        return (
          <div
            onMouseDown={() => handleClick(id)}
            onKeyDown={(e) => e.key === 'Enter' && handleClick(id)}
          >
            <RadioButton value={id} checked={checkChecked(id)} />
          </div>
        );
      case 'multiple':
        return (
          <Checkbox
            onClick={() => handleClick(id)}
            checked={checkChecked(id)}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <ResultsTable cellSpacing={0} $expandedLastCell={type === 'multiple'}>
      <thead>
        {extraHeader && extraHeader}
        <tr>
          {renderHeaderButton()}
          {(!extraHeader || items.filter((item) => item.partOf).length > 0) && (
            <td>
              <Text variant="bold">{t('data-model')}</Text>
            </td>
          )}
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
              {renderTrButton(item.target.identifier)}
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
            {item.partOf && (
              <td>
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
            )}
            <td>
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
            <td>
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
