import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import { useGetServiceCategoriesQuery } from '@app/common/components/serviceCategories/serviceCategories.slice';
import { DataModel } from '@app/common/interfaces/datamodel.interface';
import Title from 'yti-common-ui/title';
import FrontPageFilter from './front-page-filter';
import { ResultAndFilterContainer, ResultAndStatsWrapper } from './front-page.styles';
import SearchResults from 'yti-common-ui/search-results/search-results';

export default function FrontPage() {
  const { data: serviceCategories } = useGetServiceCategoriesQuery();
  const { data: organizations } = useGetOrganizationsQuery();

  return (
    <main id='main'>
      <Title
        title={'Tietomallit'}
        description={
          'Tietomallit-työkalulla kuvataan tietojärjestelmien ja rajapintojen tietosisältöjä ja -rakennetta. Tietomallit-työkalu tekee julkishallinnon julkisten tietojen loogisesta tietomallityöstö avointa ja julkista, joka helpottaa tietomallien hyödyntämistä yli organisaatiorajojen.'
        }
      />
      <ResultAndFilterContainer>
        <FrontPageFilter organizations={organizations} serviceCategories={serviceCategories} />
        <ResultAndStatsWrapper>
          <SearchResults data={temp} />
        </ResultAndStatsWrapper>
      </ResultAndFilterContainer>
    </main>
  );
}


const temp: DataModel[] = [
  {
    id: 'http://uri.suomi.fi/datamodel/ns/aurora-att',
    useContext: 'InformationDescription',
    status: 'DRAFT',
    statusModified: '2021-07-06T13:20:32.506Z',
    modified: '2022-05-04T12:37:34.479Z',
    created: '2021-07-06T13:20:32.506Z',
    contentModified: '2022-10-05T12:10:16.594Z',
    type: 'profile',
    prefix: 'aurora-att',
    namespace: 'http://uri.suomi.fi/datamodel/ns/aurora-att#',
    label: {
      fi: 'AuroraAI-attribuutit'
    },
    comment: {
      fi: 'Kuvaus AuroraAI-attribuuteista'
    },
    contributor: [
      'd9c76d52-03d3-4480-8c2c-b66e6d9c57f2'
    ],
    isPartOf: [
      'P9'
    ],
    language: [
      'fi',
      'en',
      'sv'
    ]
  },
  {
    id: 'http://uri.suomi.fi/datamodel/ns/auroraai',
    useContext: 'InformationSystem',
    status: 'DRAFT',
    statusModified: '2021-06-22T13:16:40.539Z',
    modified: '2021-07-08T14:34:51.328Z',
    created: '2021-06-22T13:16:40.539Z',
    contentModified: '2021-08-11T11:14:18.557Z',
    type: 'profile',
    prefix: 'auroraai',
    namespace: 'http://uri.suomi.fi/datamodel/ns/auroraai#',
    label: {
      fi: 'AuroraAI'
    },
    comment: {
      fi: ''
    },
    contributor: [
      'd9c76d52-03d3-4480-8c2c-b66e6d9c57f2'
    ],
    isPartOf: [
      'P9'
    ],
    language: [
      'en',
      'sv',
      'fi'
    ]
  },
  {
    id: 'http://uri.suomi.fi/datamodel/ns/busdoc',
    useContext: 'InformationDescription',
    status: 'DRAFT',
    statusModified: '2021-03-15T10:53:21.523Z',
    modified: '2021-10-27T12:31:28.008Z',
    created: '2020-10-21T06:41:44.347Z',
    contentModified: '2022-08-02T14:27:33.885Z',
    type: 'library',
    prefix: 'busdoc',
    namespace: 'http://uri.suomi.fi/datamodel/ns/busdoc#',
    label: {
      da: 'Forretningsdokumenter',
      fi: 'Liiketoiminnan asiakirjat',
      en: 'Business documents'
    },
    comment: {
      en: 'NSG and RTE test-site for generic data components for business documents, mainly based on UBL.'
    },
    contributor: [
      '0e7e4f57-be57-4f99-bb1f-bfdcf0b6948a'
    ],
    isPartOf: [
      'P15'
    ],
    language: [
      'en',
      'fr',
      'is',
      'da',
      'sv',
      'fi',
      'de',
      'no'
    ]
  }
];
