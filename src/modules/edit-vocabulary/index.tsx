import { Breadcrumb, BreadcrumbLink } from '@app/common/components/breadcrumb';
import { selectLogin } from '@app/common/components/login/login.slice';
import PropertyValue from '@app/common/components/property-value';
import Title from '@app/common/components/title/title';
import { useGetVocabularyQuery } from '@app/common/components/vocabulary/vocabulary.slice';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Heading, Paragraph, Text } from 'suomifi-ui-components';
import generateNewTerminology from '../new-terminology/generate-new-terminology';
import InfoManual from '../new-terminology/info-manual';
import { TallerSeparator } from '../new-terminology/new-terminology.styles';
import { FormWrapper, FormFooter, FormTitle } from './edit-vocabulary.styles';
import generateInitialData from './generate-initial-data';

interface EditVocabularyProps {
  terminologyId: string;
}

export default function EditVocabulary({ terminologyId }: EditVocabularyProps) {
  const { t, i18n } = useTranslation('admin');
  const router = useRouter();
  const { data: info, error: infoError } = useGetVocabularyQuery({
    id: terminologyId,
  });
  const user = useSelector(selectLogin());
  const [data, setData] = useState(generateInitialData(i18n.language, info));

  const handleSubmit = () => {
    if (!data) {
      return;
    }

    const newData = generateNewTerminology({
      data: data,
      code: info?.code,
      createdBy: info?.createdBy,
      createdDate: info?.createdDate,
      id: info?.id,
      lastModifiedBy: `${user.firstName} ${user.lastName}`,
      terminologyId: terminologyId,
      uri: info?.uri,
    });

    console.log(newData);
  };

  const handleCancel = () => {
    router.push(`/terminology/${terminologyId}`);
  };

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
          setManualData={setData}
          userPosted={false}
          initialData={data}
        />

        <TallerSeparator />

        <FormFooter>
          <Button onClick={() => handleSubmit()}>{t('save')}</Button>
          <Button variant="secondary" onClick={() => handleCancel()}>
            {t('cancel')}
          </Button>
        </FormFooter>
      </FormWrapper>
    </>
  );
}
