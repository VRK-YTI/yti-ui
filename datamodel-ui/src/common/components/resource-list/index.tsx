/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Checkbox,
  ExternalLink,
  IconCalendar,
  RadioButton,
  Text,
} from 'suomifi-ui-components';
import { StatusChip, ResultsTable } from './resource-list.styles';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { i18n, useTranslation } from 'next-i18next';
import {
  translateModelType,
  translateResourceType,
} from '@app/common/utils/translation-helpers';
import { ServiceCategory } from '@app/common/interfaces/service-categories.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Type } from '@app/common/interfaces/type.interface';

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
    type: ResourceType | Type;
    domains: string[];
    uri: string;
  };
  subClass?: {
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
  serviceCategories?: ServiceCategory[];
}

export default function ResourceList({
  primaryColumnName,
  items,
  type = 'single',
  selected,
  extraHeader,
  handleClick,
  serviceCategories,
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
              id="select-all-checkbox"
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
            id="select-single-radio-button"
          >
            <RadioButton value={id} checked={checkChecked(id)} />
          </div>
        );
      case 'multiple':
        return (
          <Checkbox
            onClick={() => handleClick(id)}
            checked={checkChecked(id)}
            id="select-multiple-checkbox"
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
        {items.map((item, idx) => (
          <tr key={`item-${item.target.identifier}-${idx}`}>
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
            <td>
              {item.partOf?.type ? (
                <div>
                  <Text>{item.partOf.label}</Text>
                  <div>
                    <Text>
                      <IconCalendar />{' '}
                      {['LIBRARY', 'PROFILE'].includes(item.partOf.type)
                        ? translateModelType(item.partOf.type as Type, t)
                        : translateResourceType(
                            item.partOf.type as ResourceType,
                            t
                          )}
                    </Text>{' '}
                    <StatusChip $isValid={item.target.isValid}>
                      {translateStatus(item.target.status, t)}
                    </StatusChip>
                  </div>
                  <Text>
                    {item.partOf.domains
                      ?.map((domain) =>
                        getLanguageVersion({
                          data: serviceCategories?.find(
                            (cat) => cat.identifier === domain
                          )?.label,
                          lang: i18n?.language ?? 'fi',
                        })
                      )
                      .join(', ')}
                  </Text>
                </div>
              ) : (
                <div>
                  <Text>{item.partOf?.uri}</Text>
                </div>
              )}
            </td>
            {item.subClass && (
              <td>
                <div>
                  {item.subClass.link && (
                    <>
                      <ExternalLink
                        href={item.subClass.link}
                        labelNewWindow={t('link-opens-new-window-external', {
                          ns: 'common',
                        })}
                        id="subClass-link"
                      >
                        {item.subClass.label}
                      </ExternalLink>
                      <Text>{item.subClass.partOf}</Text>
                    </>
                  )}
                </div>
              </td>
            )}
            <td>
              <div>
                <SanitizedTextContent text={item.target.note} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </ResultsTable>
  );
}
