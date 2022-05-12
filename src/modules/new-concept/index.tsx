import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import {
  MainTitle,
  SubTitle,
  BadgeBar,
  Badge,
} from '@app/common/components/title-block';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { getProperty } from '@app/common/utils/get-property';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Text } from 'suomifi-ui-components';
import ConceptBasicInformation from './basic-information/concept-basic-information';
import FormFooter from './form-footer';
import { NewConceptBlock } from './new-concept.styles';

interface NewConceptProps {
  terminologyId: string;
  conceptNames: { [key: string]: string | undefined };
}

export default function NewConcept({
  terminologyId,
  conceptNames,
}: NewConceptProps) {
  const { t } = useTranslation('concept');
  const router = useRouter();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);

  const [conceptInfo, setConceptInfo] = useState({
    definition: {},
    example: [],
    subject: '',
    note: [],
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
        {conceptNames && (
          <BreadcrumbLink url="" current>
            {getTermName()}
          </BreadcrumbLink>
        )}
      </Breadcrumb>

      <NewConceptBlock>
        <SubTitle>
          <PropertyValue
            property={getProperty(
              'prefLabel',
              terminology?.references.contributor
            )}
            fallbackLanguage="fi"
          />
        </SubTitle>
        <MainTitle>{getTermName()}</MainTitle>
        <BadgeBar>
          {t('heading')}
          <PropertyValue
            property={terminology?.properties.prefLabel}
            fallbackLanguage="fi"
          />
          <Badge>{t('DRAFT')}</Badge>
        </BadgeBar>
        <Text>{t('new-concept-page-help')}</Text>

        <ConceptBasicInformation setConceptInfo={setConceptInfo} />

        <FormFooter conceptInfo={conceptInfo} terminologyId={router.query.terminologyId} />
      </NewConceptBlock>
    </>
  );

  // Get first defined termName
  // This would be smart to replace with a proper function
  function getTermName() {
    const conceptNameKeys = Object.keys(conceptNames);
    for (let i = 0; i < conceptNameKeys.length; i++) {
      if (conceptNames[conceptNameKeys[i]]) {
        return conceptNames[conceptNameKeys[i]];
      }
    }

    return '';
  }
}
