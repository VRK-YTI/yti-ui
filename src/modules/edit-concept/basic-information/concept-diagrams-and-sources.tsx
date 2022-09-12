import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import { DiagramType, ListType } from '../new-concept.types';
import { BasicInfoUpdate } from './concept-basic-information';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';
import Diagrams from './diagrams';
import NewDiagramOrLink from './new-diagram-or-link';
import Sources from './sources';

interface ConceptDiagramsAndSourcesProps {
  infoKey: string;
  update: (value: BasicInfoUpdate) => void;
  initialValues?: {
    diagram: DiagramType[];
    sources: ListType[];
  };
}

export default function ConceptDiagramsAndSources({
  infoKey,
  update,
  initialValues,
}: ConceptDiagramsAndSourcesProps) {
  const { t } = useTranslation('admin');
  const [sources, setSources] = useState<ListType[]>(
    initialValues?.sources ?? []
  );
  const [diagrams, setDiagrams] = useState<DiagramType[]>(
    initialValues?.diagram ?? []
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

  const handleAddDiagram = (newDiagram: DiagramType) => {
    setDiagrams([...diagrams, newDiagram]);
  };

  const handleAddSource = ({ value }: BasicInfoUpdate) => {
    setSources([...sources, value as ListType]);

    if (typeof value !== 'string' && Array.isArray(value)) {
      update({
        key: infoKey,
        value: {
          diagrams: diagrams,
          sources: value,
        },
      });
    }
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
              {diagrams.map((diagram, idx) => (
                <div key={`'diagram-${idx}`}>{diagram.diagramName}</div>
              ))}
              <Diagrams />
            </BasicBlockExtraWrapper>
          }
        >
          {t('add-new-link-description')}
        </BasicBlock>

        <BasicBlock
          title={t('source', { count: 2 })}
          extra={
            <BasicBlockExtraWrapper onBlur={() => handleBlur()}>
              {diagrams.map((diagram, idx) => (
                <div key={`'diagram-${idx}`}>{diagram.diagramName}</div>
              ))}
              <Sources />
            </BasicBlockExtraWrapper>
          }
        >
          {t('sources-hint-text-concept')}
        </BasicBlock>
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
