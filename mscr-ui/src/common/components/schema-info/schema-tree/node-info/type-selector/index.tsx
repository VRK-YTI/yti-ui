import { Button, Heading, Paragraph, SearchInput } from 'suomifi-ui-components';
import { IconLinkExternal } from 'suomifi-icons';
import { useTranslation } from 'next-i18next';
import { DataType } from '@app/common/interfaces/data-type.interface';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  TypeInfoWrapper,
  TypeSearchResultWrapper
} from '@app/common/components/schema-info/schema-tree/node-info/type-selector/type-selector.styles';
import { usePatchDataTypeMutation } from '@app/common/components/schema/schema.slice';

export default function TypeSelector({ attributeId } : { attributeId?: string }) {
  // Todo: What if target is undefined when you need to make internal change type api call?
  const { t } = useTranslation('common');
  const [skip, setSkip] = useState(true);
  const [query, setQuery] = useState('');
  const { query: queryRoute } = useRouter();
  const schemaId = (queryRoute?.pid ?? [''])[0];
  const [patchDataType, resultPatchDataType] = usePatchDataTypeMutation();

  const handleInputChange = (value: string) => {
    if (value.length < 3) {
      setSkip(true);
      setQuery(value);
      return;
    }
    setQuery(value);
    setSkip(false);
    console.log('searching with: ', value);
  };

  const handleUseButtonClick = (dataType: string) => {
    const trimmedId = attributeId?.substring(5);
    const target = `${schemaId}#${trimmedId}`;
    console.log('target: ', target);
    console.log('data type: ', dataType);
    // patchDataType({schemaID: schemaId, target: target, datatype: dataType })
  };

  function dataTypeSearchResult(id: string, name: string, description: string) {
    return (
      <TypeSearchResultWrapper key={id}>
        <TypeInfoWrapper>
          <Heading variant={'h5'}>{name}</Heading>
          <Paragraph>{description}</Paragraph>
        </TypeInfoWrapper>
        <Button variant={'secondaryNoBorder'} onClick={() => handleUseButtonClick(id)}>Use</Button>
        <Button icon={<IconLinkExternal />} variant={'secondaryNoBorder'}>Type Registry</Button>
      </TypeSearchResultWrapper>
    );
  }

  const mockResults: DataType[] = [
    {
      'aliases':[],
      'authors':[],
      'content':{
        'Identifier':'21.T11969/a94a8fe5ccb19ba61c4c',
        'Schema':{
          'Properties':[
            {
              'Name':'same0',
              'Properties':{
                'Cardinality':'0 - 1',
                'extractProperties':true
              },
              'Type':'21.T11969/eba491f4edadbea9133c'
            },
            {
              'Name':'same1',
              'Properties':{'Cardinality':'0 - 1'},
              'Type':'21.T11969/1e67c576c1bdc5229b7a'
            }
          ],
          'Type':'Object',
          'addProps':true,
          'subCond':'anyOf'
        },
        'description':'See [AuthorityResource doucmentation](AuthorityResource.md) for accepted identifiers',
        'name':'test',
        'provenance':{
          'creationDate':'2024-07-16T10:00:19.082Z',
          'lastModificationDate':'2024-07-16T10:05:20.496Z'
        }
      },
      'date':1721088000,
      'description':'See [AuthorityResource doucmentation](AuthorityResource.md) for accepted identifiers',
      'fundamentalType':'Object','id':'21.T11969/a94a8fe5ccb19ba61c4c',
      'name':'test',
      'origin':'Typeregistry-EOSC',
      'style':'eosc',
      'taxonomies':[],
      'type':'InfoType',
      'unit':'None'
    },
    {'aliases':[],
      'authors':[],
      'content':{
        'Identifier':'21.T11969/b415e16fbe4ca40f2270',
        'Schema':{
          'Properties':[
            {
              'Property':'String Enum',
              'Value':[
                'climatologyMeteorologyAtmosphere',
                'oceans',
                'society',
                'economy',
                'environment',
                'transportation',
                'geoscientificInformation',
                'space physics',''
              ]
            }
          ],
          'Type':'Enum'
        },
        'description':'INSPIRE topic category (see http://inspire.ec.europa.eu/metadata-codelist/TopicCategory)',
        'name':'topic',
        'provenance':{
          'creationDate':'2024-05-24T13:34:39.097Z',
          'lastModificationDate':'2024-05-24T13:34:39.097Z'
        },
        'versioning':{'version':'0.1'}
      },
      'date':1716508800,
      'description':'INSPIRE topic category (see http://inspire.ec.europa.eu/metadata-codelist/TopicCategory)',
      'fundamentalType':'Enum',
      'id':'21.T11969/b415e16fbe4ca40f2270',
      'name':'topic',
      'origin':'Typeregistry-EOSC',
      'style':'eosc',
      'taxonomies':[],
      'type':'BasicInfoType',
      'unit':'None'
    },
    {
      'aliases':[],
      'authors':[],
      'content':{
        'Identifier':'21.T11969/50c9e3dd19460ed72a07',
        'Schema':{
          'Type':'Array',
          'minItems':1,
          'subCond':'21.T11969/6d2c84af313b862f1b18',
          'unique':true
        },
        'name':'titles',
        'provenance':{
          'creationDate':'2024-05-20T21:23:20.332Z',
          'lastModificationDate':'2024-05-21T12:38:22.862Z'
        }
      },
      'date':1716163200,
      'description':'',
      'fundamentalType':'Array',
      'id':'21.T11969/50c9e3dd19460ed72a07',
      'name':'titles',
      'origin':'Typeregistry-EOSC',
      'style':'eosc',
      'taxonomies':[],
      'type':'InfoType',
      'unit':'None'
    },
    {'aliases':[],'authors':[],'content':{'Identifier':'21.T11969/a37c9d2079b19efcfa56','Schema':{'Properties':[{'Name':'test','Properties':{'Cardinality':'0 - 1'},'Type':'21.T11969/984816fd329622876e14'}],'Type':'Object'},'name':'testInfo','provenance':{'creationDate':'2024-05-14T13:20:01.817Z','lastModificationDate':'2024-05-14T13:20:01.817Z'}},'date':1715644800,'description':'','fundamentalType':'Object','id':'21.T11969/a37c9d2079b19efcfa56','name':'testInfo','origin':'Typeregistry-EOSC','style':'eosc','taxonomies':[],'type':'InfoType','unit':'None'},
    {'aliases':[],'authors':[],'content':{'Identifier':'21.T11969/984816fd329622876e14','Schema':{'Properties':[{'Property':'minLength','Value':0}],'Type':'String'},'name':'TEST','provenance':{'creationDate':'2024-05-14T13:19:16.364Z','lastModificationDate':'2024-05-14T13:19:16.364Z'}},'date':1715644800,'description':'','fundamentalType':'String','id':'21.T11969/984816fd329622876e14','name':'TEST','origin':'Typeregistry-EOSC','style':'eosc','taxonomies':[],'type':'BasicInfoType','unit':'None'},
    {'aliases':[],'authors':[],'content':{'Identifier':'21.T11969/3c6de1b7dd91465d437e','Schema':{'Properties':[{'Property':'minLength','Value':1},{'Property':'maxLength','Value':550}],'Type':'String'},'name':'title','provenance':{'creationDate':'2024-05-14T08:56:12.340Z','lastModificationDate':'2024-05-14T08:56:12.340Z'}},'date':1715644800,'description':'','fundamentalType':'String','id':'21.T11969/3c6de1b7dd91465d437e','name':'title','origin':'Typeregistry-EOSC','style':'eosc','taxonomies':[],'type':'BasicInfoType','unit':'None'},
    {'aliases':[],'authors':[],'content':{'description':'taxonomic topic of TETTRIs Service. ','identifier':'21.T11148/28f819ea05c9aafea06f','name':'taxonomicTopic','provenance':{'creationDate':'2024-05-01T13:26:31.608Z','lastModificationDate':'2024-05-01T13:26:31.608Z'}},'date':1714521600,'description':'taxonomic topic of TETTRIs Service. ','fundamentalType':'None','id':'21.T11148/28f819ea05c9aafea06f','name':'taxonomicTopic','origin':'DTR-Test','style':'legacy','taxonomies':[],'type':'PID-BasicInfoType','unit':'None'}
  ];

  return (
    // Todo: Implement the wrapper in styled components
    // <TypeSelectorWrapper>
    <>
      <SearchInput
        labelText={t('node-info.type-search')}
        clearButtonLabel={t('clear')}
        searchButtonLabel={t('search')}
        labelMode={'hidden'}
        visualPlaceholder={t('node-info.type-to-search')}
        value={query}
        onChange={(value) => handleInputChange(value as string)}
      />
      <Heading variant={'h4'}>{t('node-info.type-search-results-title')}</Heading>
      {mockResults && (
        <>
          {mockResults.map((result) => {
            return dataTypeSearchResult(result.id, result.name, result.description);
          })}
        </>
      )
      }
    </>
    // </TypeSelectorWrapper>
  );
}
