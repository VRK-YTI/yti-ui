import { Schema } from '@app/common/interfaces/schema.interface';
import { Crosswalk } from '@app/common/interfaces/crosswalk.interface';
import {
  MetadataAttribute,
  MetadataContainer,
  MetadataFormContainer,
  MetadataHeading,
  MetadataLabel,
  MetadataRow,
} from '@app/modules/form/metadata-form/metadata-form.styles';
import { Grid } from '@mui/material';
import { Type } from '@app/common/interfaces/search.interface';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import * as React from 'react';
import FormattedDate from 'yti-common-ui/components/formatted-date';

export default function MetadataStub({
  metadata,
  type,
}: {
  metadata: Schema | Crosswalk;
  type: Type;
}) {
  const { t } = useTranslation('common');
  const lang = useRouter().locale ?? '';
  const localizedLabel = metadata.label
    ? getLanguageVersion({
        data: metadata.label,
        lang,
      })
    : '';
  const localizedDescription = metadata.description
    ? getLanguageVersion({
        data: metadata.description,
        lang,
      })
    : '';

  function renderRow(label: string, attribute: string | JSX.Element) {
    return (
      <MetadataRow key={label} container>
        <Grid item xs={4}>
          <MetadataLabel>{label}:</MetadataLabel>
        </Grid>
        <Grid item xs={8}>
          <MetadataAttribute>{attribute}</MetadataAttribute>
        </Grid>
      </MetadataRow>
    );
  }

  const metadataRows = [
    { label: t('metadata.name'), attribute: localizedLabel },
    { label: t('metadata.version-label'), attribute: metadata.versionLabel },
    { label: t('metadata.contact'), attribute: metadata.contact },
    {
      label: t('metadata.owner'),
      attribute: metadata.ownerMetadata.map((o) => o.name ?? o.id).join(', '),
    },
    {
      label: t('metadata.pid'),
      attribute: metadata.handle ?? t('metadata.not-available'),
    },
    { label: t('metadata.format'), attribute: metadata.format },
    {
      label: t('metadata.created'),
      attribute: <FormattedDate date={metadata.created} />,
    },
    {
      label: t('metadata.modified'),
      attribute: <FormattedDate date={metadata.modified} />,
    },
    { label: t('metadata.state'), attribute: metadata.state },
  ];

  return (
    <MetadataContainer>
      {type === Type.Crosswalk ? (
        <MetadataHeading variant={'h2'}>
          {t('metadata.stub-crosswalk-details')}
        </MetadataHeading>
      ) : (
        <MetadataHeading variant={'h2'}>
          {t('metadata.stub-schema-details')}
        </MetadataHeading>
      )}
      <MetadataFormContainer container>
        <Grid item xs={12} md={7}>
          {metadataRows.map((item) => renderRow(item.label, item.attribute))}
          {type === Type.Crosswalk ? (
            <>
              {renderRow(
                t('metadata.source-schema'),
                metadata.sourceSchema ?? ''
              )}
              {renderRow(
                t('metadata.target-schema'),
                metadata.targetSchema ?? ''
              )}
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} md={5}>
          <MetadataRow item xs={6} md={7}>
            <Grid item xs={12}>
              <MetadataLabel>{t('metadata.description')}:</MetadataLabel>
            </Grid>
            <p>{localizedDescription}</p>
          </MetadataRow>
        </Grid>
      </MetadataFormContainer>
    </MetadataContainer>
  );
}
