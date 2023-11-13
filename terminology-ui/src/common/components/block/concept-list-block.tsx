import React from 'react';
import Link from 'next/link';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { BasicBlock, List } from 'yti-common-ui/block';
import { Concept } from '@app/common/interfaces/concept.interface';
import { getProperty } from '@app/common/utils/get-property';
import PropertyValue from '@app/common/components/property-value';

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
  if (!data?.length) {
    return null;
  }

  return (
    <BasicBlock title={title} extra={extra}>
      <List>
        {data?.map((concept) => (
          <li key={concept.id}>
            <Link
              href={`/terminology/${concept.identifier.type.graph.id}/concept/${concept.id}`}
              passHref
              legacyBehavior
            >
              <SuomiLink href="">
                <PropertyValue
                  property={getProperty(
                    'prefLabel',
                    concept.references.prefLabelXl
                  )}
                />
              </SuomiLink>
            </Link>
          </li>
        ))}
      </List>
    </BasicBlock>
  );
}
