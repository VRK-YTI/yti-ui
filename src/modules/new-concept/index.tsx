import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useRouter } from 'next/router';
import { Heading } from 'suomifi-ui-components';
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
  const router = useRouter();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);

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
        <Heading variant="h1">{getTermName()}</Heading>

        <ConceptBasicInformation />

        <FormFooter />
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
