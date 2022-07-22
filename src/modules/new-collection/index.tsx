import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import Separator from '@app/common/components/separator';
import {
  BadgeBar,
  MainTitle,
  SubTitle,
} from '@app/common/components/title-block';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { getProperty } from '@app/common/utils/get-property';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Heading } from 'suomifi-ui-components';
import ConceptPicker from './concept-picker';
import {
  DescriptionTextarea,
  FooterBlock,
  NameTextInput,
  NewCollectionBlock,
  PageHelpText,
  TextBlockWrapper,
} from './new-collection.styles';

interface NewCollectionProps {
  terminologyId: string;
  collectionName: string;
}

export default function NewCollection({
  terminologyId,
  collectionName,
}: NewCollectionProps) {
  const { t } = useTranslation('collection');
  const router = useRouter();
  const { data: terminology } = useGetVocabularyQuery({
    id: terminologyId,
  });
  const languages =
    terminology?.properties.language?.map(({ value }) => value) ?? [];

  const [formData, setFormData] = useState({
    name: languages.map((language) => ({
      lang: language,
      value: '',
    })),
    description: languages.map((language) => ({
      lang: language,
      value: '',
    })),
    concepts: [],
  });

  return (
    <>
      <Breadcrumb>
        {router.query.terminologyId && (
          <BreadcrumbLink url={`/terminology/${router.query.terminologyId}`}>
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BreadcrumbLink>
        )}
        <BreadcrumbLink url="" current>
          {collectionName}
        </BreadcrumbLink>
      </Breadcrumb>

      <NewCollectionBlock>
        <SubTitle>
          <PropertyValue
            property={getProperty(
              'prefLabel',
              terminology?.references.contributor
            )}
            fallbackLanguage="fi"
          />
        </SubTitle>
        <MainTitle>{collectionName}</MainTitle>
        <BadgeBar>
          {t('heading')}
          <PropertyValue
            property={terminology?.properties.prefLabel}
            fallbackLanguage="fi"
          />
        </BadgeBar>
        <PageHelpText>{t('new-collection-page-help')}</PageHelpText>

        <Separator isLarge />

        <Heading variant="h3">Käsitekokoelman perustiedot</Heading>

        <TextBlockWrapper>
          {languages.map((language) => (
            <NameTextInput
              labelText={`Nimi, ${language.toUpperCase()}`}
              visualPlaceholder="Kirjoita nimi"
            />
          ))}

          {languages.map((language) => (
            <DescriptionTextarea
              labelText={`Kuvaus, ${language.toUpperCase()}`}
              visualPlaceholder="Kirjoita määritelmä"
            />
          ))}
        </TextBlockWrapper>

        <Separator isLarge />

        <ConceptPicker terminologyId={terminologyId} />

        <Separator isLarge />

        <FooterBlock>
          <Button>Tallenna</Button>
          <Button variant="secondary">Peruuta</Button>
        </FooterBlock>
      </NewCollectionBlock>
    </>
  );
}
