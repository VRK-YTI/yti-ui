import { BasicBlock, BasicBlockExtraWrapper } from 'yti-common-ui/block';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import { DiagramType, ListType } from '../new-concept.types';
import { FormError } from '../validate-form';
import { BasicInfoUpdate } from './concept-basic-information';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';
import Diagrams from './diagrams';
import Sources from './sources';

interface ConceptDiagramsAndSourcesProps {
  infoKey: string;
  update: (value: BasicInfoUpdate) => void;
  initialValues?: {
    diagrams: DiagramType[];
    sources: ListType[];
  };
  errors: FormError;
  languages: string[];
}

export default function ConceptDiagramsAndSources({
  infoKey,
  update,
  initialValues,
  errors,
  languages,
}: ConceptDiagramsAndSourcesProps) {
  const { t } = useTranslation('admin');
  const [sources, setSources] = useState<ListType[]>(
    initialValues?.sources ?? []
  );
  const [diagrams, setDiagrams] = useState<DiagramType[]>(
    initialValues?.diagrams ?? []
  );

  const handleBlur = () => {
    update({
      key: infoKey,
      value: {
        diagrams: diagrams,
        sources: sources,
      },
    });
  };

  const handleRemove = (s?: ListType[], d?: DiagramType[]) => {
    if (s) {
      setSources(s);
    }

    if (d) {
      setDiagrams(d);
    }

    update({
      key: infoKey,
      value: {
        diagrams: d ? d : diagrams,
        sources: s ? s : sources,
      },
    });
  };

  return (
    <ConceptExpander id="diagrams-and-sources-expander">
      <ExpanderTitleButton asHeading="h3">
        {t('concept-diagrams-and-sources')}
      </ExpanderTitleButton>
      <ExpanderContentFitted>
        <BasicBlock
          title={t('concept-diagram-or-link')}
          extra={
            <BasicBlockExtraWrapper onBlur={() => handleBlur()}>
              <Diagrams
                diagrams={diagrams}
                setDiagrams={setDiagrams}
                handleRemove={handleRemove}
                isError={errors.diagrams || errors.diagramsUri}
                languages={languages}
              />
            </BasicBlockExtraWrapper>
          }
        >
          {t('add-new-link-description')}
        </BasicBlock>

        <BasicBlock
          title={t('source', { count: 2 })}
          extra={
            <BasicBlockExtraWrapper onBlur={() => handleBlur()}>
              <Sources
                sources={sources}
                setSources={setSources}
                handleRemove={handleRemove}
                isError={errors.source}
              />
            </BasicBlockExtraWrapper>
          }
        >
          {t('sources-hint-text-concept')}
        </BasicBlock>
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
