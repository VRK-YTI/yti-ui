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
import { Concepts } from '@app/common/interfaces/concepts.interface';
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
import {
  NewCollectionFormDataType,
  NewCollectionProps,
} from './new-collection.types';

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
  const [newConceptId, setNewConceptId] = useState('');
  const [errors, setErrors] = useState({
    name: false,
    description: false,
  });

  const languages =
    terminology?.properties.language?.map(({ value }) => value) ?? [];

  const [formData, setFormData] = useState<NewCollectionFormDataType>({
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
      router.push(
        `/terminology/${
          router.query.terminologyId ?? terminologyId
        }/concept/${newConceptId}`
      );
    }
  }, [result, router, terminologyId, newConceptId]);

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

    if (errors.name && data.name.filter((n) => n.value !== '').length > 0) {
      setErrors({ ...errors, name: false });
    }
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

    if (
      errors.description &&
      data.description.filter((d) => d.value !== '').length > 0
    ) {
      setErrors({ ...errors, description: false });
    }
  };

  const setConcepts = (concepts: Concepts[]) => {
    const data = formData;
    data.concepts = concepts;
    setFormData(data);
  };

  const handleClick = () => {
    let errorOccurs = false;
    if (formData.name.filter((n) => n.value !== '').length < 1) {
      setErrors({ ...errors, name: true });
      errorOccurs = true;
    }

    if (formData.description.filter((n) => n.value !== '').length < 1) {
      setErrors({ ...errors, description: true });
      errorOccurs = true;
    }

    if (errorOccurs) {
      return;
    }

    const data = generateCollection(formData, terminologyId);
    setNewConceptId(data[0].id);
    addCollection(data);
  };

  const handleCancel = () => {
    router.push(`/terminology/${router.query.terminologyId ?? terminologyId}`);
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

        <Heading variant="h3">{t('collection-basic-information')}</Heading>

        <TextBlockWrapper>
          {languages.map((language) => (
            <NameTextInput
              key={`name-input-${language}`}
              labelText={`${t('field-name')}, ${language.toUpperCase()}`}
              visualPlaceholder={t('enter-collection-name')}
              onBlur={(e) => setName(language, e.target.value)}
              status={errors.name ? 'error' : 'default'}
            />
          ))}

          {languages.map((language) => (
            <DescriptionTextarea
              key={`description-textarea-${language}`}
              labelText={`${t('field-definition')}, ${language.toUpperCase()}`}
              visualPlaceholder={t('enter-collection-description')}
              onBlur={(e) => setDescription(language, e.target.value)}
              status={errors.description ? 'error' : 'default'}
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
          <Button onClick={() => handleClick()}>
            {t('save', { ns: 'admin' })}
          </Button>
          <Button variant="secondary" onClick={() => handleCancel()}>
            {t('cancel-variant', { ns: 'admin' })}
          </Button>
        </FooterBlock>
      </NewCollectionBlock>
    </>
  );
}
