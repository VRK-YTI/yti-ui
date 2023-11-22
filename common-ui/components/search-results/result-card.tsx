import { ReactNode } from 'react';
import { translateStatus } from '../../utils/translation-helpers';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { VisuallyHidden } from 'suomifi-ui-components';
import {
  OrganizationParagraph,
  CardBlock,
  Title,
  Subtitle,
  Description,
  PartOf,
  TitleLink,
  Extra,
} from './result-card.styles';
import SanitizedTextContent from '../sanitized-text-content';
import { StatusChip } from '../status-chip/status-chip.styles';

interface ResultCardProps {
  contributors?: string[];
  description?: string;
  extra?: JSX.Element | string;
  icon?: ReactNode;
  noChip?: boolean;
  noDescriptionText: string;
  noVersion?: boolean;
  partOfText?: string;
  partOf?: string[];
  identifier?: string;
  version?: string;
  status?: string;
  title: string;
  titleLink: string;
  type: string;
}

export default function ResultCard({
  contributors,
  description,
  extra,
  icon,
  noChip = false,
  noDescriptionText,
  partOf,
  noVersion,
  version,
  identifier,
  partOfText,
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
      <Link passHref href={titleLink} legacyBehavior>
        <TitleLink href="">
          {icon && icon}
          <Title variant="h2" id="card-title-link">
            <SanitizedTextContent text={title} />
            <VisuallyHidden>
              {contributors?.join(', ') ?? t('no-contributors')}
            </VisuallyHidden>
          </Title>
        </TitleLink>
      </Link>
      <Subtitle id="card-subtitle">
        <span>{type}</span>
        {identifier && (
          <>
            <span aria-hidden={true}>&middot;</span>
            <span style={{ textTransform: 'uppercase' }}>{identifier}</span>
          </>
        )}
        {noVersion ? (
          <></>
        ) : version ? (
          <>
            <span aria-hidden={true}>&middot;</span>
            <span style={{ textTransform: 'uppercase' }}>{`${t(
              'version'
            )} ${version}`}</span>
          </>
        ) : (
          <>
            <span aria-hidden={true}>&middot;</span>
            <span style={{ textTransform: 'uppercase' }}>
              {t('working-version')}
            </span>
          </>
        )}
        {status && renderStatus()}
      </Subtitle>
      <Description id="card-description">
        <SanitizedTextContent
          text={
            description && description.length > 0
              ? description
              : noDescriptionText
          }
        />
      </Description>
      {partOf && (
        <PartOf id="card-partof">
          <b>{partOfText}: </b>
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
          <StatusChip status={status ?? 'DRAFT'} id="card-status">
            {translateStatus(status ?? 'DRAFT', t)}
          </StatusChip>
        )}
      </>
    );
  }
}
