import { BasicBlock } from '@app/common/components/block';
import { BasicBlockExtraWrapper } from '@app/common/components/block/block.styles';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { ExpanderTitleButton } from 'suomifi-ui-components';
import ListBlock from '../list-block';
import { DiagramType, ListType } from '../new-concept.types';
import { BasicInfoUpdate } from './concept-basic-information';
import {
  ConceptExpander,
  ExpanderContentFitted,
} from './concept-basic-information.styles';
import NewDiagramOrLink from './new-diagram-or-link';

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
              <NewDiagramOrLink addDiagram={handleAddDiagram} />
            </BasicBlockExtraWrapper>
          }
        >
          {t('add-new-link-description')}
        </BasicBlock>

        <ListBlock
          update={handleAddSource}
          items={sources}
          itemsKey={'source'}
          noLangOption
          title={t('source', { count: 2 })}
          description={t('sources-hint-text-concept')}
          addNewText={t('add-new-source')}
          inputLabel={t('source', { count: 1 })}
          inputPlaceholder={t('sources-placeholder')}
        />
      </ExpanderContentFitted>
    </ConceptExpander>
  );
}
