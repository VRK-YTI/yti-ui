import {
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
} from 'suomifi-ui-components';
import { PropertyList, TermHeading, TermText } from './term-modal.styles';

interface TermExpanderProps {
  title: string;
  data: {
    subtitle: string;
    value?: string | string[];
    checkCondition?: boolean;
  }[];
}

export default function TermExpander({ title, data }: TermExpanderProps) {
  if (data.filter((d) => d.value).length < 1) {
    return null;
  }

  return (
    <Expander>
      <ExpanderTitleButton asHeading="h4">{title}</ExpanderTitleButton>
      <ExpanderContent>
        {data
          .filter((d) => d.value && d.checkCondition !== false)
          .map((d, idx) => {
            return (
              <div key={`${title}-${idx}`}>
                <TermHeading variant="h4">{d.subtitle}</TermHeading>
                {Array.isArray(d.value) ? (
                  <PropertyList>
                    {d.value.map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </PropertyList>
                ) : (
                  <TermText>{d.value}</TermText>
                )}
              </div>
            );
          })}
      </ExpanderContent>
    </Expander>
  );
}
