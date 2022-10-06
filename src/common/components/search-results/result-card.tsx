import {
  ContributorsDTO,
  InformationDomainDTO,
} from '@app/common/interfaces/terminology.interface';
import { translateStatus } from '@app/common/utils/translation-helpers';
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
  contributors?: ContributorsDTO[];
  description: string | JSX.Element;
  extra?: JSX.Element | (JSX.Element | undefined)[];
  icon?: BaseIconKeys;
  noChip?: boolean;
  noStatus?: boolean;
  partOf?: InformationDomainDTO[];
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
  const { t, i18n } = useTranslation('common');

  const getLabel = (labels: { [key: string]: string }) => {
    if (labels[i18n.language]) {
      return labels[i18n.language];
    }

    if (labels['fi']) {
      return labels['fi'];
    }

    return labels[Object.keys(labels)[0]];
  };

  return (
    <CardBlock padding="m" className="result-card">
      {contributors && contributors.length > 0 && (
        <OrganizationParagraph id="card-contributor">
          {contributors.length === 1
            ? getLabel(contributors[0].label)
            : `${contributors.length} ${t('card-organizations')}`}
        </OrganizationParagraph>
      )}
      <Link passHref href={titleLink}>
        <TitleLink href="">
          {icon && <Icon icon={icon} style={{ minWidth: 'max-content' }} />}
          <Title variant="h2" id="card-title-link">
            {title}
            <VisuallyHidden>
              {contributors
                ?.map((contributor) => getLabel(contributor.label))
                .join(', ')}
            </VisuallyHidden>
          </Title>
        </TitleLink>
      </Link>
      <Subtitle id="card-subtitle">
        <div>{type}</div>
        {!noStatus && renderStatus()}
      </Subtitle>
      <Description id="card-description">{description}</Description>
      {partOf && (
        <PartOf id="card-partof">
          <b>{t('terminology-search-results-information-domains')}: </b>
          {partOf.map((part, idx) => {
            const comma = idx !== partOf.length - 1 ? ', ' : '';
            return (
              <span key={part.id}>
                {getLabel(part.label)}
                {comma}
              </span>
            );
          })}
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
