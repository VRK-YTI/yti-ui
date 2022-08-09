import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import PropertyValue from '@app/common/components/property-value';
import Title from '@app/common/components/title/title';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button, Heading, Paragraph, Text } from 'suomifi-ui-components';
import InfoManual from '../new-terminology/info-manual';
import { TallerSeparator } from '../new-terminology/new-terminology.styles';
import { FormWrapper, FormFooter, FormTitle } from './edit-vocabulary.styles';
import generateInitialData from './generate-initial-data';

interface EditVocabularyProps {
  terminologyId: string;
}

export default function EditVocabulary({ terminologyId }: EditVocabularyProps) {
  const { t, i18n } = useTranslation('admin');
  const { data: info, error: infoError } = useGetVocabularyQuery({
    id: terminologyId,
  });

  console.log(info);

  const [temp, setTemp] = useState<any>({});

  if (infoError || !info) {
    return (
      <>
        <Breadcrumb>
          <BreadcrumbLink url="" current>
            ...
          </BreadcrumbLink>
        </Breadcrumb>
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbLink url={`/terminology/${terminologyId}`} current>
          <PropertyValue
            property={info.properties.prefLabel}
            fallbackLanguage="fi"
          />
        </BreadcrumbLink>
      </Breadcrumb>

      <Title info={info} noExpander />

      <FormWrapper>
        <FormTitle>
          <Heading variant="h3">Muokkaa sanaston tietoja</Heading>

          <Paragraph>
            <Text>
              Tiedot ovat pakollisia, jos niitä ei ole merkitty valinnaisiksi.
            </Text>
          </Paragraph>
        </FormTitle>

        <InfoManual
          setIsValid={() => false}
          setManualData={setTemp}
          userPosted={false}
          initialData={generateInitialData(info, i18n.language)}
        />

        <TallerSeparator />

        <FormFooter>
          <Button>{t('save')}</Button>
          <Button variant="secondary">{t('cancel')}</Button>
        </FormFooter>
      </FormWrapper>
    </>
  );
}
