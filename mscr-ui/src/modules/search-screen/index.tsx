import {FacetsWrapper, ResultsWrapper, SearchContainer} from '@app/modules/search-screen/search-screen.styles';
import SearchResult from '@app/common/components/search-result';

export default function SearchScreen() {
  return (
    <SearchContainer>
      <p>Search screen is now open</p>
      <FacetsWrapper>
        {/* Groups of facets for different contexts, made with search-filter-set */}
      </FacetsWrapper>
      <ResultsWrapper>
        {/* Only a list of results if searching all of mscr, but two lists if searching own workspace */}
        {mockSearch.hits.hits.map((hit) => (
          <SearchResult key={hit._id} />
        ))}
      </ResultsWrapper>
      {/* Close button */}
    </SearchContainer>
  );
}

const mockSearch = {
  'took': 10,
  'timed_out': false,
  '_shards': {
    'failed': 0.0,
    'successful': 2.0,
    'total': 2.0,
    'skipped': 0.0
  },
  'hits': {
    'total': {
      'relation': 'eq',
      'value': 1
    },
    'hits': [
      {
        '_index': 'crosswalks_v2',
        '_id': 'urn%3AIAMNOTAPID%3Af4f11101-6f95-4936-812d-1230b98ecfb5',
        '_source': {
          'id': 'urn:IAMNOTAPID:f4f11101-6f95-4936-812d-1230b98ecfb5',
          'label': {
            'en': 'string'
          },
          'status': 'DRAFT',
          'state': 'DRAFT',
          'visibility': 'PUBLIC',
          'modified': '2023-06-22T13:32:44.288Z',
          'created': '2023-06-16T07:03:11.42Z',
          'contentModified': '2023-06-16T07:03:11.42Z',
          'type': 'CROSSWALK',
          'prefix': 'urn:IAMNOTAPID:f4f11101-6f95-4936-812d-1230b98ecfb5',
          'comment': {
            'en': 'string2'
          },
          'contributor': [
            '7d3a3c00-5a6b-489b-a3ed-63bb58c26a63'
          ],
          'organizations': [
            {
              'id': '7d3a3c00-5a6b-489b-a3ed-63bb58c26a63',
              'label': {
                'fi': 'test',
                'sv': 'test',
                'en': 'test'
              }
            }
          ],
          'isPartOf': [],
          'language': [
            'en'
          ],
          'numberOfRevisions': 0,
          'sourceSchema': 'urn:IAMNOTAPID:d840d215-5a16-4e5d-af68-70a059d58b59',
          'targetSchema': 'urn:IAMNOTAPID:3a56a297-1f01-42c0-bc72-47b2345f6368'
        },
        'sort': [
          null
        ]
      }
    ]
  },
  'aggregations': {
    'sterms#isReferenced': {
      'buckets': [],
      'doc_count_error_upper_bound': 0,
      'sum_other_doc_count': 0
    },
    'sterms#organization': {
      'buckets': [],
      'doc_count_error_upper_bound': 0,
      'sum_other_doc_count': 0
    },
    'sterms#format': {
      'buckets': [],
      'doc_count_error_upper_bound': 0,
      'sum_other_doc_count': 0
    },
    'sterms#type': {
      'buckets': [
        {
          'doc_count': 1,
          'key': 'CROSSWALK'
        }
      ],
      'doc_count_error_upper_bound': 0,
      'sum_other_doc_count': 0
    },
    'sterms#status': {
      'buckets': [
        {
          'doc_count': 1,
          'key': 'VALID'
        }
      ],
      'doc_count_error_upper_bound': 0,
      'sum_other_doc_count': 0
    }
  }
};
