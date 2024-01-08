/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Checkbox,
  ExternalLink,
  IconApplicationProfile,
  IconGrid,
  RadioButton,
  Text,
} from 'suomifi-ui-components';
import { ResultsTable } from './resource-list.styles';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { i18n, useTranslation } from 'next-i18next';
import { translateModelType } from '@app/common/utils/translation-helpers';
import { ServiceCategory } from '@app/common/interfaces/service-categories.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import SanitizedTextContent from 'yti-common-ui/sanitized-text-content';
import { Type } from '@app/common/interfaces/type.interface';
import { Status as StatusType } from '@app/common/interfaces/status.interface';
import { StatusChip } from 'yti-common-ui/status-chip';
import { getEnvParam } from '../uri-info';

export interface ResultType {
  target: {
    identifier: string;
    label: string;
    linkLabel: string;
    link: string;
    note: string;
    status: StatusType;
  };
  datamodel?: {
    label: string;
    type: Type;
    status: StatusType;
    domains: string[];
    uri: string;
    version?: string;
  };
  concept?: {
    label: string;
    link: string;
    partOf: string;
  };
}

interface ResourceListProps {
  primaryColumnName: string;
  items: ResultType[];
  id: string;
  type?: 'single' | 'multiple' | 'multiple-without-global' | 'display';
  selected?: string | string[];
  extraHeader?: React.ReactFragment;
  handleClick: (value: string | string[]) => void;
  serviceCategories?: ServiceCategory[];
}

export default function ResourceList({
  primaryColumnName,
  items,
  id,
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
              id={`select-all-checkbox-${id}`}
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
            onKeyDown={(e) =>
              (e.code === 'Enter' || e.code === 'Space') && handleClick(id)
            }
            id="select-single-radio-button"
          >
            <RadioButton value={id} checked={checkChecked(id)} />
          </div>
        );
      case 'multiple':
      case 'multiple-without-global':
        return (
          <Checkbox
            onClick={() => handleClick(id)}
            onKeyPress={(e) => e.key === 'Enter' && handleClick(id)}
            checked={checkChecked(id)}
            id={`select-multiple-checkbox-${id}`}
          />
        );
      default:
        return <></>;
    }
  };

  const renderItem = (item: ResultType) => {
    if (type === 'multiple-without-global') {
      return <></>;
    }

    return (
      <td className="td-with-button">
        {renderTrButton(item.target.identifier)}
        <div>
          {item.target.label}
          <ExternalLink
            href={`${item.target.link}${getEnvParam(item.target.link)}`}
            labelNewWindow={t('link-opens-new-window-external', {
              ns: 'common',
            })}
          >
            {item.target.linkLabel}
          </ExternalLink>
        </div>
      </td>
    );
  };

  const renderDataModel = (item: ResultType) => {
    if (!item.datamodel) {
      return <></>;
    }

    return (
      <td
        className={type === 'multiple-without-global' ? 'td-with-button' : ''}
      >
        {type === 'multiple-without-global' &&
          renderTrButton(item.target.identifier)}
        {item.datamodel?.type ? (
          <div>
            <div>
              <Text>{item.datamodel.label} </Text>
              {item.datamodel.version && (
                <Text>{`(${t('version', {
                  ns: 'common',
                })} ${item.datamodel.version})`}</Text>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                flexWrap: 'wrap',
              }}
            >
              {item.datamodel.type === 'PROFILE' ? (
                <IconApplicationProfile />
              ) : (
                <IconGrid />
              )}
              <Text>{translateModelType(item.datamodel.type, t)}</Text>
              <StatusChip status={item.datamodel.status}>
                {translateStatus(item.datamodel.status, t)}
              </StatusChip>
            </div>
            <Text>
              {item.datamodel.domains
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
            <Text>{item.datamodel?.uri}</Text>
          </div>
        )}
      </td>
    );
  };

  const renderConcept = (item: ResultType) => {
    if (type === 'multiple-without-global') {
      return <></>;
    }

    if (!item.concept) {
      return <td></td>;
    }

    return (
      <td>
        {item.concept && (
          <div>
            {item.concept.link && (
              <>
                <ExternalLink
                  href={`${item.concept.link}${getEnvParam(item.concept.link)}`}
                  labelNewWindow={t('link-opens-new-window-external', {
                    ns: 'common',
                  })}
                  id="subClass-link"
                >
                  {item.concept.label}
                </ExternalLink>
                <Text>{item.concept.partOf}</Text>
              </>
            )}
          </div>
        )}
      </td>
    );
  };

  const renderNote = (item: ResultType) => {
    return (
      <td>
        <div>
          <SanitizedTextContent text={item.target.note} />
        </div>
      </td>
    );
  };

  return (
    <ResultsTable cellSpacing={0} $expandedLastCell={type === 'multiple'}>
      <thead>
        {extraHeader && extraHeader}
        <tr>
          {renderHeaderButton()}
          {(!extraHeader ||
            items.filter((item) => item.datamodel).length > 0) &&
            type !== 'multiple-without-global' && (
              <td>
                <Text variant="bold">{t('data-model')}</Text>
              </td>
            )}
          {type !== 'multiple-without-global' && (
            <>
              <td>
                <Text variant="bold">{t('concept', { ns: 'common' })}</Text>
              </td>
            </>
          )}
          <td>
            <Text variant="bold">
              {t('technical-description', { ns: 'common' })}
            </Text>
          </td>
        </tr>
      </thead>

      <tbody>
        {items.map((item, idx) => (
          <tr key={`item-${item.target.identifier}-${idx}`}>
            {renderItem(item)}
            {renderDataModel(item)}
            {renderConcept(item)}
            {renderNote(item)}
          </tr>
        ))}
      </tbody>
    </ResultsTable>
  );
}
