import { translateStatus } from '../../utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { BaseIconKeys, Icon, VisuallyHidden } from 'suomifi-ui-components';
import {
  OrganizationParagraph,
  CardBlock,
  Title,
  Subtitle,
  Description,
  PartOf,
  TitleLink,
  Status,
  Extra,
} from './result-card.styles';

interface ResultCardProps {
  contributors?: string[];
  description?: string;
  extra?: JSX.Element | (JSX.Element | undefined)[];
  icon?: BaseIconKeys;
  noChip?: boolean;
  noStatus?: boolean;
  partOf?: string[];
  status?: string;
  title: string | JSX.Element;
  titleLink: string;
  type: string;
}

export default function ResultCard({
  contributors,
  description,
  extra,
  icon,
  noChip = false,
  noStatus = false,
  partOf,
  status,
  title,
  titleLink,
  type,
}: ResultCardProps) {
  const { t } = useTranslation('common');

  return (
    <CardBlock padding="m" className="result-card">
      {contributors && contributors.length > 0 && (
        <OrganizationParagraph id="card-contributor">
          {contributors.length === 1
            ? contributors[0]
            : `${contributors.length} ${t('card-organizations')}`}
        </OrganizationParagraph>
      )}
      <Link passHref href={titleLink}>
        <TitleLink href="">
          {icon && <Icon icon={icon} style={{ minWidth: 'max-content' }} />}
          <Title variant="h2" id="card-title-link">
            {title}
            <VisuallyHidden>
              {contributors?.join(', ') ?? t('no-contributors')}
            </VisuallyHidden>
          </Title>
        </TitleLink>
      </Link>
      <Subtitle id="card-subtitle">
        <span>{type}</span>
        {!noStatus && renderStatus()}
      </Subtitle>
      <Description id="card-description">
        {description && description.length > 0
          ? description
          : t('no-description')}
      </Description>
      {partOf && (
        <PartOf id="card-partof">
          <b>{t('card-information-domains')}: </b>
          {partOf.join(', ')}
        </PartOf>
      )}
      {extra && <Extra id="card-extra">{extra}</Extra>}
    </CardBlock>
  );

  function renderStatus() {
    return (
      <>
        <span aria-hidden={true}>&middot;</span>
        {noChip ? (
          translateStatus(status ?? 'DRAFT', t)
        ) : (
          <Status
            valid={status === 'VALID' ? 'true' : undefined}
            id="card-status"
          >
            {translateStatus(status ?? 'DRAFT', t)}
          </Status>
        )}
      </>
    );
  }
}
