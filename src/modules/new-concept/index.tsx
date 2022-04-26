import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useRouter } from 'next/router';
import { Heading } from 'suomifi-ui-components';
import { NewConceptBlock } from './new-concept.styles';

interface NewConceptProps {
  terminologyId: string;
  conceptName: string;
}

export default function NewConcept({ terminologyId, conceptName }: NewConceptProps) {
  const router = useRouter();
  const { data: terminology } = useGetVocabularyQuery(terminologyId);
  console.log(terminology);
  return (
    <>
      <Breadcrumb>
        {router.query.terminologyId &&
          <BreadcrumbLink url={`/terminology/${router.query.terminologyId}`}>
            <PropertyValue
              property={terminology?.properties.prefLabel}
              fallbackLanguage="fi"
            />
          </BreadcrumbLink>
        }
        {conceptName &&
          <BreadcrumbLink url='' current>
            {conceptName}
          </BreadcrumbLink>
        }
      </Breadcrumb>

      <NewConceptBlock>
        <Heading variant='h1'>
          {conceptName}
        </Heading>

      </NewConceptBlock>
    </>
  );
}
