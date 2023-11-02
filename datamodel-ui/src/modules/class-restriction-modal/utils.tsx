import { ResultType } from '@app/common/components/resource-list';
import { InternalClassInfo } from '@app/common/interfaces/internal-class.interface';
import { getLanguageVersion } from '@app/common/utils/get-language-version';

export function mapInternalClassInfoToResultType(
  data: InternalClassInfo,
  language: string
): ResultType {
  return {
    ...(data.conceptInfo && {
      concept: {
        label: getLanguageVersion({
          data: data.conceptInfo.conceptLabel,
          lang: language,
          appendLocale: true,
        }),
        link: data.conceptInfo.conceptURI,
        partOf: getLanguageVersion({
          data: data.conceptInfo?.terminologyLabel,
          lang: language,
          appendLocale: true,
        }),
      },
    }),
    datamodel: {
      domains: data.dataModelInfo.groups,
      label: getLanguageVersion({
        data: data.dataModelInfo.label,
        lang: language,
        appendLocale: true,
      }),
      type: data.dataModelInfo.modelType,
      uri: data.dataModelInfo.uri,
      status: data.dataModelInfo.status,
      version: data.dataModelInfo.version,
    },
    target: {
      identifier: data.id,
      label: getLanguageVersion({
        data: data.label,
        lang: language,
        appendLocale: true,
      }),
      link: data.id,
      linkLabel: data.curie,
      note: getLanguageVersion({
        data: data.note,
        lang: language,
        appendLocale: true,
      }),
      status: data.status,
    },
  };
}
