import React from 'react';
import { Link } from 'suomifi-ui-components';
import { BasicBlock } from '.';
import { Concept } from '../../interfaces/concept.interface';
import PropertyValue from '../property-value';
import { List } from './block.styles';

export interface ConceptListBlockProps {
  title: React.ReactNode;
  data?: Concept[];
  extra?: React.ReactNode;
}

export default function ConceptListBlock({
  title,
  data,
  extra,
}: ConceptListBlockProps) {
  return (
    <BasicBlock title={title} extra={extra}>
      <List>
        {data?.map((concept) => (
          <li key={concept.id}>
            <Link
              href={`/terminology/${concept.identifier.type.graph.id}/concept/${concept.id}`}
            >
              <PropertyValue
                property={concept.references.prefLabelXl?.[0].properties.prefLabel}
                fallbackLanguage='fi'
              />
            </Link>
          </li>
        ))}
      </List>
    </BasicBlock>
  );
}
