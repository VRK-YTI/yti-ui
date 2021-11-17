import { useTranslation } from 'react-i18next';
import { Expander, ExpanderContent, ExpanderTitleButton, Heading } from 'suomifi-ui-components';
import FormatISODate from '../../utils/format-iso-date';
import {
  DescriptionWrapper,
  HR,
  InformationDomainWrapper,
  NameWrapper,
  SimpleInformationWrapper
} from './vocabulary-info.styles';

export default function VocabularyInfo({ data }: any) {
  const { t } = useTranslation('common');
  const prefLabels = data.properties.prefLabel;
  const description = data.properties.description[0];
  const informationDomain = data.references.inGroup[0].properties.prefLabel[2].value;
  const vocabularyLanguages = data.properties.language;
  const contributor = data.references.contributor[0].properties.prefLabel[1].value;
  const createdDate = FormatISODate(data.createdDate);
  const lastModifiedDate = FormatISODate(data.lastModifiedDate);
  const uri = data.uri;

  return (
    <Expander>
      <ExpanderTitleButton>
        Sanaston tiedot
      </ExpanderTitleButton>
      <ExpanderContent>
        <NameWrapper>
          <Heading variant='h4'>Nimi</Heading>
          <ul>
            {prefLabels.map((prefLabel: any) => {
              return (
                <li key={`prefLabel-${prefLabel.lang}`}>
                  <b>{prefLabel.lang.toUpperCase()}</b>
                  {prefLabel.value}
                </li>
              );
            })}
          </ul>
        </NameWrapper>

        <DescriptionWrapper>
          <Heading variant='h4'>Kuvaus</Heading>
          <div>
            <b>{description.lang.toUpperCase()}</b>
            {description.value}
          </div>
        </DescriptionWrapper>

        <InformationDomainWrapper>
          <Heading variant='h4'>Kuuluu tietoalueisiin</Heading>
          <div>{informationDomain}</div>
        </InformationDomainWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>Sanaston kielet</Heading>
          <div>{vocabularyLanguages.map((lang: any, idx: number) => {
            if (idx === 0) {
              return (
                <span key={`lang-${lang.value}`}>
                  {t(`vocabulary-${lang.value}`)} {lang.value.toUpperCase()}
                </span>
              );
            } else {
              return (
                <span key={`lang-${lang.value}`}>
                  , {t(`vocabulary-${lang.value}`)} {lang.value.toUpperCase()}
                </span>
              );
            }
          })}
          </div>
        </SimpleInformationWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>Sanastotyyppi</Heading>
          <div>Terminologinen sanasto</div>
        </SimpleInformationWrapper>

        <HR />

        <SimpleInformationWrapper>
          <Heading variant='h4'>Sisällöstä vastaa</Heading>
          <div>{contributor}</div>
        </SimpleInformationWrapper>

        {data.references.contributor.length > 1 &&
          <SimpleInformationWrapper>
            <Heading variant='h4'>Muut vastuuorganisaatiot</Heading>
            <div></div>
          </SimpleInformationWrapper>
        }

        <SimpleInformationWrapper>
          <Heading variant='h4'>Luotu</Heading>
          <div>{createdDate}</div>
        </SimpleInformationWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>Muokattu viimeksi</Heading>
          <div>{lastModifiedDate}</div>
        </SimpleInformationWrapper>

        <SimpleInformationWrapper>
          <Heading variant='h4'>URI</Heading>
          <div>{uri}</div>
        </SimpleInformationWrapper>
      </ExpanderContent>
    </Expander>
  );
}
