/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CodeType } from '@app/common/interfaces/code';
import {
  InfoBlock,
  ResultBlock,
  ResultsAndInfoBlockWrapper,
} from './code-list-modal.styles';
import { StatusChip } from 'yti-common-ui/status-chip';
import { Checkbox, ExternalLink, Paragraph, Text } from 'suomifi-ui-components';
import { useTranslation } from 'next-i18next';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { translateStatus } from 'yti-common-ui/utils/translation-helpers';
import { useState } from 'react';
import { useGetCodeRegistryQuery } from '@app/common/components/code/code.slice';
import { ModelCodeList } from '@app/common/interfaces/model.interface';

interface ResultsAndInfoBlockProps {
  codes?: {
    meta: {
      from: number;
      resultCount: number;
      totalResults: number;
    };
    results: CodeType[];
  };
  extendedView?: boolean;
  selected: ModelCodeList[];
  isSuccess?: boolean;
  setSelected: (value: ModelCodeList[]) => void;
}

export default function ResultsAndInfoBlock({
  codes,
  extendedView,
  selected,
  isSuccess,
  setSelected,
}: ResultsAndInfoBlockProps) {
  const { t, i18n } = useTranslation('admin');
  const [selectedPreview, setSelectedPreview] = useState<
    CodeType | undefined
  >();
  const { data: codeRegistry, isUninitialized } = useGetCodeRegistryQuery(
    {
      codeRegistryId: selectedPreview?.codeRegistry.codeValue ?? '',
      codeValue: selectedPreview?.codeValue ?? '',
    },
    { skip: !selectedPreview }
  );

  return (
    <ResultsAndInfoBlockWrapper $extendedView={extendedView}>
      <ResultBlock>
        <Paragraph className="total-results">
          <Text variant="bold">
            {t('reference-data-counts', {
              count: isSuccess && codes ? codes.meta.totalResults : 0,
            })}
          </Text>
        </Paragraph>
        {isSuccess && codes && codes.meta.totalResults > 0 && (
          <div className="results">
            {codes.results.map((code) => (
              <div
                className={
                  selectedPreview?.uri === code.uri
                    ? 'result-highlighted'
                    : 'result'
                }
                key={`code-list-result-${code.id}`}
                onClick={() => setSelectedPreview(code)}
              >
                <Checkbox
                  onClick={() =>
                    setSelected(
                      selected.map((s) => s.id).includes(code.uri)
                        ? selected.filter((s) => s.id !== code.uri)
                        : [
                            ...selected,
                            {
                              id: code.uri,
                              prefLabel: code.prefLabel,
                              status: code.status,
                            },
                          ]
                    )
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setSelected(
                        selected.map((s) => s.id).includes(code.uri)
                          ? selected.filter((s) => s.id !== code.uri)
                          : [
                              ...selected,
                              {
                                id: code.uri,
                                prefLabel: code.prefLabel,
                                status: code.status,
                              },
                            ]
                      );
                    }
                  }}
                  checked={selected.map((s) => s.id).includes(code.uri)}
                  id={`code-list-checkbox_${code.uri}`}
                >
                  {getLanguageVersion({
                    data: code.prefLabel,
                    lang: i18n.language,
                    appendLocale: true,
                  })}
                </Checkbox>

                <div className="subtitle">
                  <div>
                    {code.languageCodes
                      .map((lcode) => lcode.codeValue)
                      .join(', ')}
                  </div>
                  &middot;
                  <div>
                    {code.infoDomains
                      .map((domain) =>
                        getLanguageVersion({
                          data: domain.prefLabel,
                          lang: i18n.language,
                          appendLocale: true,
                        })
                      )
                      .join(', ')}
                  </div>
                  &middot;
                  <StatusChip status={code.status}>
                    {translateStatus(code.status, t)}
                  </StatusChip>
                </div>

                <div className="description">
                  {code.description ? (
                    getLanguageVersion({
                      data: code.description,
                      lang: i18n.language,
                      appendLocale: true,
                    })
                  ) : (
                    <>{t('no-description', { ns: 'common' })}</>
                  )}
                </div>

                <div className="link">
                  <ExternalLink href={code.uri} labelNewWindow="">
                    {code.uri}
                  </ExternalLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </ResultBlock>

      {extendedView && !isUninitialized && (
        <InfoBlock>
          <Paragraph className="code-list-info">
            <Text variant="bold">{t('codelist-contents')}</Text>
          </Paragraph>

          <table>
            <thead>
              <tr>
                <td>{t('identifier')}</td>
                <td>{t('name', { ns: 'common' })}</td>
                <td>{t('status')}</td>
              </tr>
            </thead>

            <tbody>
              {codeRegistry?.results.map((code) => (
                <tr key={`code-${code.id}`}>
                  <td>{code.codeValue}</td>
                  <td>
                    {getLanguageVersion({
                      data: code.prefLabel,
                      lang: i18n.language,
                      appendLocale: true,
                    })}
                  </td>

                  <td>{translateStatus(code.status, t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfoBlock>
      )}
    </ResultsAndInfoBlockWrapper>
  );
}
