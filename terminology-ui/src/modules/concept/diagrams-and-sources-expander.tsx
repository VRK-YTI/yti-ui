import { useTranslation } from 'next-i18next';
import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  ExternalLink,
} from 'suomifi-ui-components';
import { BasicBlock } from 'yti-common-ui/block';
import { PropertyList } from './concept.styles';
import Link from 'next/link';
import { ConceptInfo } from '@app/common/interfaces/interfaces-v2';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export interface DiagramsAndSourcesExpanderProps {
  concept?: ConceptInfo;
}

export default function DiagramsAndSourcesExpander({
  concept,
}: DiagramsAndSourcesExpanderProps) {
  const { t, i18n } = useTranslation('concept');

  if (!concept?.links?.length && !concept?.sources?.length) {
    return null;
  }

  return (
    <Expander id="diagrams-and-sources-expander">
      <ExpanderTitleButton>
        {t('section-concept-diagrams-and-sources')}
      </ExpanderTitleButton>
      <ExpanderContent>
        {concept?.links?.length > 0 && (
          <BasicBlock title={t('field-concept-diagrams')}>
            <PropertyList $smBot>
              {concept?.links?.map((link, idx) => {
                return (
                  <li key={`diagrams-${idx}`}>
                    <Link href={link.uri} passHref legacyBehavior>
                      <ExternalLink
                        href=""
                        labelNewWindow=""
                        style={{ fontSize: '16px' }}
                      >
                        {getLanguageVersion({
                          data: link.name,
                          lang: i18n.language,
                        })}
                      </ExternalLink>
                    </Link>
                    {Object.entries(link.description).length > 0 && (
                      <>
                        <br />
                        {getLanguageVersion({
                          data: link.description,
                          lang: i18n.language,
                        })}
                      </>
                    )}
                  </li>
                );
              })}
            </PropertyList>
          </BasicBlock>
        )}

        {concept?.sources.length > 0 && (
          <BasicBlock title={t('field-sources')}>
            <PropertyList>
              {concept?.sources?.map((source, idx) => (
                <li key={`source-${idx}`}>{source}</li>
              ))}
            </PropertyList>
          </BasicBlock>
        )}
      </ExpanderContent>
    </Expander>
  );
}
