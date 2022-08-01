import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import { DiagramType } from '../new-concept.types';
import { BasicInfoUpdate } from './concept-basic-information';
import {
  ConceptExpander,
  ExpanderContentFitted,
  WideTextarea,
} from './concept-basic-information.styles';
import NewDiagramOrLink from './new-diagram-or-link';

interface ConceptDiagramsAndSourcesProps {
  infoKey: string;
  update: (value: BasicInfoUpdate) => void;
  initialValues?: {
    diagram: DiagramType[];
    sources: string;
  };
}

export default function ConceptDiagramsAndSources({
  infoKey,
  update,
  initialValues
}: ConceptDiagramsAndSourcesProps) {
  const { t } = useTranslation('admin');
  const [sources, setSources] = useState<string>(initialValues?.sources ?? '');
  const [diagrams, setDiagrams] = useState<DiagramType[]>(initialValues?.diagram ?? []);

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

  return (
    <ConceptExpander>
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
              <NewDiagramOrLink addDiagram={handleAddDiagram} />
            </BasicBlockExtraWrapper>
          }
        >
          {t('add-new-link-description')}
        </BasicBlock>

        <WideTextarea
          labelText={t('sources')}
          hintText={t('sources-hint-text')}
          visualPlaceholder={t('sources-placeholder')}
          onBlur={() => handleBlur()}
          onChange={(e) => setSources(e.target.value)}
          value={sources}
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
