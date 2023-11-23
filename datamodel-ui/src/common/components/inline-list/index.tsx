import { useTranslation } from 'next-i18next';
import { ExternalLink, Button, Text, IconRemove } from 'suomifi-ui-components';
import { List, ListItem } from './inline-list.styles';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { UriData } from '@app/common/interfaces/uri.interface';
import { getEnvParam } from '../uri-info';

export interface InlineListProps {
  items?: UriData[];
  handleRemoval: (value: string) => void;
  labelRow?: boolean;
  deleteDisabled: string[] | boolean;
}

export default function InlineList({
  items,
  handleRemoval,
  deleteDisabled,
}: InlineListProps) {
  const { t, i18n } = useTranslation('admin');

  if (!items || items.length < 1) {
    return <></>;
  }

  return (
    <List className="inline-list">
      {items.map((item) => (
        <ListItem key={item.uri}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text>
              {getLanguageVersion({
                data: item.label,
                lang: i18n.language ?? 'fi',
              })}
            </Text>
            <ExternalLink
              href={`${item.uri}${getEnvParam(item.uri)}`}
              labelNewWindow={t('link-opens-new-window-external', {
                ns: 'common',
              })}
            >
              {item.curie}
            </ExternalLink>
          </div>

          {(Array.isArray(deleteDisabled) &&
            deleteDisabled.includes(item.uri)) ||
          deleteDisabled === true ? (
            <></>
          ) : (
            <Button
              variant="secondaryNoBorder"
              icon={<IconRemove />}
              onClick={() => handleRemoval(item.uri)}
              id="remove-button"
            >
              {t('remove')}
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  );
}
