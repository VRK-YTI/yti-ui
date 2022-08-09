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
} from './edit-collection.styles';
import {
  EditCollectionFormDataType,
  EditCollectionProps,
} from './edit-collection.types';
import { useGetCollectionQuery } from '@app/common/components/collection/collection.slice';
import { Collection } from '@app/common/interfaces/collection.interface';
import useUser from '@app/common/utils/hooks/useUser';
import { translateLanguage } from '@app/common/utils/translation-helpers';

export default function EditCollection({
  terminologyId,
  collectionName,
  collectionInfo,
}: EditCollectionProps) {
  const { t } = useTranslation('collection');
  const { user } = useUser();
  const router = useRouter();
  const { data: terminology } = useGetVocabularyQuery({
    id: terminologyId,
  });
  const { data: collection } = useGetCollectionQuery(
    /*
      Setting collectionId as string manually because skip
      flag isn't detected correctly by type checker.
      It informs that collectionId might be undefined even
      though call is skipped if collectionId isn't defined.
    */
    {
      collectionId: collectionInfo?.collectionId as string,
      terminologyId: terminologyId,
    },
    {
      skip: !collectionInfo?.collectionId,
    }
  );

  const [addCollection, result] = useAddCollectionMutation();
  const [newCollectionId, setNewCollectionId] = useState('');
  const [errors, setErrors] = useState({
    name: false,
    definition: false,
  });

  const languages =
    terminology?.properties.language?.map(({ value }) => value) ?? [];

  const [formData, setFormData] = useState<EditCollectionFormDataType>(
    setInitialData(collection)
  );

  useEffect(() => {
    if (result.isSuccess) {
      router.push(
        `/terminology/${terminologyId}/collection/${newCollectionId}`
      );
    }
  }, [result, router, terminologyId, newCollectionId]);

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

    if (data.definition.some((d) => d.lang === language)) {
      data.definition = data.definition.map((d) => {
        if (d.lang === language) {
          return {
            lang: d.lang,
            value: value,
          };
        }
        return d;
      });
    } else {
      data.definition.push({
        lang: language,
        value: value,
      });
    }

    setFormData(data);

    if (
      errors.definition &&
      data.definition.filter((d) => d.value !== '').length > 0
    ) {
      setErrors({ ...errors, definition: false });
    }
  };

  const setFormConcepts = (
    concepts: EditCollectionFormDataType['concepts']
  ) => {
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

    if (formData.definition.filter((n) => n.value !== '').length < 1) {
      setErrors({ ...errors, definition: true });
      errorOccurs = true;
    }

    if (errorOccurs) {
      return;
    }

    const data = generateCollection(
      formData,
      terminologyId,
      `${user?.firstName} ${user?.lastName}`,
      collectionInfo
    );
    setNewCollectionId(collectionInfo?.collectionId ?? data[0].id);
    addCollection(data);
  };

  const handleCancel = () => {
    if (collectionInfo?.collectionId) {
      router.push(
        `/terminology/${terminologyId}/collection/${collectionInfo?.collectionId}`
      );
    } else {
      router.push(`/terminology/${terminologyId}`);
    }
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
              labelText={`${t('field-name')}, ${translateLanguage(
                language,
                t
              )} ${language.toUpperCase()}`}
              visualPlaceholder={t('enter-collection-name')}
              onBlur={(e) => setName(language, e.target.value)}
              status={errors.name ? 'error' : 'default'}
              defaultValue={
                formData.name.find((n) => n.lang === language)?.value
              }
            />
          ))}

          {languages.map((language) => (
            <DescriptionTextarea
              key={`description-textarea-${language}`}
              labelText={`${t('field-definition')}, ${translateLanguage(
                language,
                t
              )} ${language.toUpperCase()}`}
              visualPlaceholder={t('enter-collection-description')}
              onBlur={(e) => setDescription(language, e.target.value)}
              status={errors.definition ? 'error' : 'default'}
              defaultValue={
                formData.definition.find((n) => n.lang === language)?.value
              }
            />
          ))}
        </TextBlockWrapper>

        <Separator isLarge />

        <ConceptPicker
          formConcepts={formData.concepts}
          terminologyId={terminologyId}
          setFormConcepts={setFormConcepts}
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

  function setInitialData(collection?: Collection) {
    if (collection) {
      return {
        name: collection.properties.prefLabel
          ? collection.properties.prefLabel.map((l) => ({
              lang: l.lang,
              value: l.value,
            }))
          : [],
        definition: collection.properties.definition
          ? collection.properties.definition.map((d) => ({
              lang: d.lang,
              value: d.value,
            }))
          : [],
        concepts: collection.references.member
          ? collection.references.member.map((m) => {
              const prefLabels = new Map();

              m.references.prefLabelXl?.map((label) => {
                prefLabels.set(
                  label.properties.prefLabel?.[0].lang,
                  label.properties.prefLabel?.[0].value
                );
              });

              return {
                id: m.id,
                prefLabels: Object.fromEntries(prefLabels),
              };
            })
          : [],
      };
    }

    return {
      name: languages.map((language) => ({
        lang: language,
        value: '',
      })),
      definition: languages.map((language) => ({
        lang: language,
        value: '',
      })),
      concepts: [],
    };
  }
}