import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import { useAddCollectionMutation } from '@app/common/components/modify/modify.slice';
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
import { useEffect, useState } from 'react';
import { Button, Heading } from 'suomifi-ui-components';
import ConceptPicker from './concept-picker';
import generateCollection from './generate-collection';
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
  const [addCollection, result] = useAddCollectionMutation();

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


  useEffect(() => {
    if (result.isSuccess) {
      return;
    }
  }, [result]);

  const setName = (language: string, value: string) => {
    const data = formData;
    data.name = data.name.map((n) => {
      if (n.lang === language) {
        return {
          lang: n.lang,
          value: value,
        };
      }
      return n;
    });
    setFormData(data);
  };

  const setDescription = (language: string, value: string) => {
    const data = formData;
    data.description = data.description.map((d) => {
      if (d.lang === language) {
        return {
          lang: d.lang,
          value: value,
        };
      }
      return d;
    });
    setFormData(data);
  };

  const setConcepts = (concepts: any) => {
    const data = formData;
    data.concepts = concepts;
    setFormData(data);
  };

  const handleClick = () => {
    const data = generateCollection(formData, terminologyId);
    addCollection(data);
  };

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
              key={`name-input-${language}`}
              labelText={`Nimi, ${language.toUpperCase()}`}
              visualPlaceholder="Kirjoita nimi"
              onBlur={(e) => setName(language, e.target.value)}
            />
          ))}

          {languages.map((language) => (
            <DescriptionTextarea
              key={`description-textarea-${language}`}
              labelText={`Kuvaus, ${language.toUpperCase()}`}
              visualPlaceholder="Kirjoita määritelmä"
              onBlur={(e) => setDescription(language, e.target.value)}
            />
          ))}
        </TextBlockWrapper>

        <Separator isLarge />

        <ConceptPicker
          terminologyId={terminologyId}
          setFormConcepts={setConcepts}
        />

        <Separator isLarge />

        <FooterBlock>
          <Button onClick={() => handleClick()}>Tallenna</Button>
          <Button variant="secondary">Peruuta</Button>
        </FooterBlock>
      </NewCollectionBlock>
    </>
  );
}
