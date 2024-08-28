import { ResultType } from '@app/common/components/resource-list';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export function convertSimpleResourceToResultType(
  data: SimpleResource[],
  lang: string
): ResultType[] {
  if (data.length < 1) {
    return [];
  }

  return data.map((res) => ({
    target: {
      identifier: res.identifier,
      label: `${getLanguageVersion({
        data: res.label,
        lang: lang,
      })} ${res.range ? `(${res.range.curie})` : ''}`,
      linkLabel: res.curie,
      link: res.versionIri ?? res.uri,
      note: getLanguageVersion({
        data: res.note,
        lang: lang,
      }),
      status: 'VALID',
    },
    ...(res.concept && {
      concept: {
        label: getLanguageVersion({
          data: res.concept.label,
          lang: lang,
        }),
        link: res.concept.conceptURI,
        partOf: getLanguageVersion({
          data: res.concept.terminology.label,
          lang: lang,
        }),
      },
    }),
  }));
}

export function convertExternalResourceToResultType(
  resources: {
    label: {
      [key: string]: string;
    };
    description?: {
      [key: string]: string;
    };
    uri: string;
  }[],
  lang: string
): ResultType[] {
  return resources.map((data) => {
    return {
      target: {
        identifier: data.uri,
        label: `${getLanguageVersion({
          data: data.label,
          lang: lang,
        })}`,
        linkLabel: data.uri,
        link: data.uri,
        note: `${getLanguageVersion({
          data: data.description,
          lang: lang,
        })}`,
        status: 'VALID',
      },
    };
  });
}
